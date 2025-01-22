import { obj_props } from "@gaubee/util";
import { Buffer } from "node:buffer";
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { formatWithOptions } from "node:util";
import postcss from "postcss";
import { PluginOption } from "vite";
import {
  MaterialSymbolName,
  materialSymbolNameParser,
  MaterialSymbolType,
} from "../custom/icon.tsx";

export type MaterialSymbolGeneratorPluginOptions = {
  tailwindFilename?: string;
  downloadUrlBuilder?: GoogleFontsApiUrlBuilder;
  fontsGoogleApisBase?: string;
  output?: { dir: string; cssUrl: string };
  inlineFont?: boolean;
};
export type GoogleFontsApiUrlBuilder = (config: {
  base: string;
  fontFamily: string;
  variations: Array<{ axis: string; range: string }>;
  names: string[];
}) => string;
const defaultGoogleFontsApiUrlBuilder: GoogleFontsApiUrlBuilder = (config) => {
  const fontFamily = config.fontFamily.replaceAll(" ", "+");
  const variationsSettings = config.variations.length
    ? (() => {
      const res = config.variations.reduce((res, v) => {
        res.axisSet.push(v.axis);
        res.rangeSet.push(v.range);
        return res;
      }, {
        axisSet: [] as string[],
        rangeSet: [] as string[],
      });
      return `:${res.axisSet.join(",")}@${res.rangeSet.join(",")}`;
    })()
    : "";
  const icon_names = config.names.join(",");
  return `${config.base}/css2?family=${fontFamily}${variationsSettings}&icon_names=${icon_names}&display=block`;
};
const defaultFontsGoogleApisBase = "https://fonts.googleapis.com";
export const materialSymbolGeneratorPlugin = (
  opts: MaterialSymbolGeneratorPluginOptions = {},
): PluginOption => {
  const tailwindFilename = "/" + (opts.tailwindFilename ?? "tailwind.css");
  const {
    downloadUrlBuilder = defaultGoogleFontsApiUrlBuilder,
    fontsGoogleApisBase = defaultFontsGoogleApisBase,
    inlineFont = false,
  } = opts;
  const outputDir = path.resolve(
    process.cwd(),
    opts.output?.dir ??
      "./public/icons/material-symbol.gen",
  );
  const cssUrlDir = opts.output?.cssUrl ?? "/icons/material-symbol.gen";

  return {
    name: "material-symbol-generator",
    enforce: "post",
    async transform(code, id) {
      // 1. 检查是否是目标CSS文件
      if (
        !(
          // 是否是  '/tailwind.css'
          id.endsWith(tailwindFilename) ||
          // 有可能是  '/tailwind.css?*'
          id.includes(tailwindFilename + "?")
        )
      ) return;

      // TODO 这里需要检查，这个文件是 js文件还是css文件，因为css如果在js中被import，那么会走js编译
      const log = (...args: unknown[]) =>
        this.info(formatWithOptions({
          colors: true,
        }, ...args));

      // 2. 解析CSS AST
      const root = postcss.parse(code);
      /// 收集使用到的 symbol
      const symbolNames = {
        outlined: new Set<MaterialSymbolName>(),
        rounded: new Set<MaterialSymbolName>(),
        sharp: new Set<MaterialSymbolName>(),
      };
      /// 收集使用到的 variation
      const symbolVariations = {
        opsz: false,
        fill: false,
        grad: false,
        wght: false,
      };

      // 3. 遍历所有规则
      root.walkRules((rule) => {
        // 4. 过滤出符合条件的class选择器
        for (const selector of rule.selectors) {
          if (selector[0] !== ".") continue;
          const ms = materialSymbolNameParser(selector.slice(1));
          if (ms) {
            symbolNames[ms.type].add(ms.name);
          } else if (selector.startsWith(".msv-")) {
            const fontVariation = selector.split("-")[1];
            if (fontVariation in symbolVariations) {
              symbolVariations[
                fontVariation as keyof typeof symbolVariations
              ] = true;
            }
          }
        }
      });

      log(`symbolNames:`, symbolNames);
      log(`symbolVariations:`, symbolVariations);
      const symbolVariationsSettings = {
        opsz: { axis: "opsz", range: "20..48" },
        fill: { axis: "FILL", range: "0..1" },
        grad: { axis: "GRAD", range: "-50..200" },
        wght: { axis: "wght", range: "100..700" },
      };
      const usedVariations = obj_props(symbolVariations).filter(
        (variation) => symbolVariations[variation],
      ).map((variation) => symbolVariationsSettings[variation]);

      /// TODO 提供下载缓存，避免频繁的重复下载
      const fetchFonts = async (
        type: MaterialSymbolType,
        names: Set<MaterialSymbolName>,
      ) => {
        const fontFamily = {
          outlined: "Material Symbols Outlined",
          rounded: "Material Symbols Rounded",
          sharp: "Material Symbols Sharp",
        }[type];
        const cssUrl = downloadUrlBuilder({
          base: fontsGoogleApisBase,
          fontFamily,
          variations: usedVariations,
          names: [...names],
        });
        log(`download cssUrl:`, cssUrl);
        const cssContent = await fetch(cssUrl, {
          headers: {
            "user-agent":
              "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36",
          },
        }).then((res) => res.text());
        const fontUrl: string | undefined = cssContent.match(
          /src: url\((.*?)\)/,
        )?.[1];
        if (fontUrl == null) {
          throw new Error(
            `faile to found ${fontFamily} @font-face url`,
          );
        }
        log(`download fontUrl:`, fontUrl);
        const fontResponse = await fetch(fontUrl);
        return { fontFamily, cssContent, fontResponse };
      };

      await Promise.all(
        obj_props(symbolNames).map(async (type) => {
          const names = symbolNames[type];
          if (names.size === 0) {
            return;
          }
          const res = await fetchFonts(type, names);
          const fontContent = Buffer.from(
            await res.fontResponse.arrayBuffer(),
          );
          fs.mkdirSync(outputDir, { recursive: true });
          const font_file_basename = res.fontFamily.replaceAll(" ", "") +
            ".woff2";
          const font_filename = path.join(
            outputDir,
            font_file_basename,
          );
          fs.writeFileSync(
            font_filename,
            fontContent,
          );
          log(`save fontname:`, font_filename);

          // 注意要把代码加到最头部，避免优先级过高
          code = res.cssContent.replace(
            /src: url\((.*?)\)/,
            `src: url(" ${
              inlineFont
                /// 内联字体文件到css文件里
                ? `data:${
                  res.fontResponse.headers.get("Content-Type") ?? "font/woff2"
                };base64,${await fontContent
                  .toString("base64")}`
                /// 使用配置的路径
                : `${cssUrlDir}/${font_file_basename}`
            }")`,
          ) + "\n" + code;
        }),
      );

      // 7. 返回原始或修改后的CSS
      return code;
    },
  };
};
