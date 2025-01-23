import { obj_props } from "@gaubee/util";
import { Buffer } from "node:buffer";
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { formatWithOptions } from "node:util";
import type { Plugin, PluginCreator } from "postcss";
import { MaterialSymbolName, materialSymbolNameParser, MaterialSymbolType } from "../../custom/icon.types.ts";
import { createHash } from "node:crypto";

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
        const res = config.variations.reduce(
          (res, v) => {
            res.axisSet.push(v.axis);
            res.rangeSet.push(v.range);
            return res;
          },
          {
            axisSet: [] as string[],
            rangeSet: [] as string[],
          },
        );
        return `:${res.axisSet.join(",")}@${res.rangeSet.join(",")}`;
      })()
    : "";
  const icon_names = config.names.join(",");
  return `${config.base}/css2?family=${fontFamily}${variationsSettings}&icon_names=${icon_names}&display=block`;
};
const defaultFontsGoogleApisBase = "https://fonts.googleapis.com";
export const materialSymbolGeneratorPlugin: PluginCreator<MaterialSymbolGeneratorPluginOptions> = Object.assign(
  (opts: MaterialSymbolGeneratorPluginOptions = {}): Plugin => {
    const tailwindFilename = "/" + (opts.tailwindFilename ?? "tailwind.css");
    const {
      downloadUrlBuilder = defaultGoogleFontsApiUrlBuilder,
      fontsGoogleApisBase = defaultFontsGoogleApisBase,
      inlineFont = false,
    } = opts;
    const outputDir = path.resolve(process.cwd(), opts.output?.dir ?? "./public/icons/material-symbol.gen");
    const cssUrlDir = opts.output?.cssUrl ?? "/icons/material-symbol.gen";

    let debug = true;

    return {
      postcssPlugin: "vite:rollup-plugin-material-symbol-generator",
      async Once(root) {
        const log = (...args: unknown[]) =>
          console.info(
            formatWithOptions(
              {
                colors: true,
              },
              ...args,
            ),
          );

        // 2. 准备数据收集器

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
        type SymbolVariation = keyof typeof symbolVariations;
        /// 3. 解析CSS，遍历代码语法树，过滤出符合条件的class选择器
        root.walkRules((rule) => {
          // 这里可能多个selector会合并在一个rule里头
          for (const selector of rule.selectors) {
            if (selector.startsWith(".")) {
              const className = selector.slice(1);
              const ms = materialSymbolNameParser(className);
              if (ms) {
                symbolNames[ms.type].add(ms.name);
              } else if (className.startsWith("msv-")) {
                const fontVariation = className.split("-")[1];
                if (fontVariation in symbolVariations) {
                  symbolVariations[fontVariation as keyof typeof symbolVariations] = true;
                }
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
        const usedVariations = obj_props(symbolVariations)
          .filter((variation) => symbolVariations[variation])
          .map((variation) => symbolVariationsSettings[variation]);

        /// TODO 提供下载缓存，避免频繁的重复下载
        const fetchFonts = async (type: MaterialSymbolType, names: Set<MaterialSymbolName>) => {
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
          const fontUrl: string | undefined = cssContent.match(/src: url\((.*?)\)/)?.[1];
          if (fontUrl == null) {
            throw new Error(`faile to found ${fontFamily} @font-face url`);
          }
          log(`download fontUrl:`, fontUrl);
          const fontResponse = await fetch(fontUrl);
          return { fontFamily, cssUrl, cssContent, fontUrl, fontResponse };
        };

        /// 4. 对收集到的信息做加工处理，并从google-apis服务下载文件
        let base_code = "";
        await Promise.all(
          obj_props(symbolNames).map(async (type) => {
            const names = symbolNames[type];
            if (names.size === 0) {
              return;
            }
            const res = await fetchFonts(type, names);
            const fontContent = Buffer.from(await res.fontResponse.arrayBuffer());
            fs.mkdirSync(outputDir, { recursive: true });
            const font_file_basename = res.fontFamily.replaceAll(" ", "") + ".woff2";
            const font_filename = path.join(outputDir, font_file_basename);
            fs.writeFileSync(font_filename, fontContent);
            log(`save fontname:`, font_filename);

            const newUrl = inlineFont
              ? // 内联字体文件到css文件里
                `data:${res.fontResponse.headers.get("Content-Type") ?? "font/woff2"};base64,${await fontContent.toString(
                  "base64",
                )}`
              : // 使用配置的路径
                `${cssUrlDir}/${font_file_basename}${`?_=${createHash("sha256")
                  .update(res.fontUrl)
                  .digest("hex")
                  .slice(0, 6)}`}`;

            base_code += res.cssContent.replace(/src: url\((.*?)\)/, `src: url("${newUrl}")`);
          }),
        );

        root.insertBefore(0, `@layer theme {\n${base_code}}\n`);
      },
    };
  },
  { postcss: true as const },
);
