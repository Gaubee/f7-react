import { obj_props } from "@gaubee/util";
import { cyan, gray, green, red, yellow } from "@marvinh/minichalk";
import Debug from "debug";
import { Buffer } from "node:buffer";
import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import type { Plugin, PluginCreator } from "postcss";
import { MaterialSymbolName, materialSymbolNameParser, MaterialSymbolType } from "../../custom/icon/ms-icon.types.ts";
import { cacheDownloader } from "./cache-download.ts";

const debug = Debug("f7r:postcss");

export type MaterialSymbolGeneratorPluginOptions = {
  tailwindFilename?: string;
  downloadUrlBuilder?: GoogleFontsApiUrlBuilder;
  fontsGoogleApisBase?: string;
  output?: { dir: string; cssUrl: string };
  inlineFont?: boolean;
  clearDir?: boolean;
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
      clearDir = true,
    } = opts;
    const outputDir = path.resolve(process.cwd(), opts.output?.dir ?? "./public/icons/material-symbol.gen");
    const cssUrlDir = opts.output?.cssUrl ?? "/icons/material-symbol.gen";
    const fetch = cacheDownloader("material-symbol-generator");

    // 这里只是在开始的时候清空一下文件夹，而不是每次都清空
    // 因为这个插件会被重新执行好几次，每一次输入不同的root
    // 虽然我们已经尝试在过滤 tailwindFilename 了，但是为了减少歧义，这里仍然只清理一次
    const clearFonts = (suffix: string) => {
      if (fs.existsSync(outputDir)) {
        fs.readdirSync(outputDir).forEach((file) => {
          if (file.endsWith(suffix)) {
            try {
              fs.unlinkSync(path.join(outputDir, file));
            } catch {}
          }
        });
      }
    };
    if (clearDir) {
      fs.rmSync(outputDir, { recursive: true, force: true });
    }

    const fontFamilys = {
      outlined: "Material Symbols Outlined",
      rounded: "Material Symbols Rounded",
      sharp: "Material Symbols Sharp",
    };

    const cacheSymbolNames = {
      outlined: new Set<MaterialSymbolName>(),
      rounded: new Set<MaterialSymbolName>(),
      sharp: new Set<MaterialSymbolName>(),
    };

    const diffSymbolNames = {
      outlined: "",
      rounded: "",
      sharp: "",
    };

    const formatSymbolNames = (type: MaterialSymbolType, symbolNames: typeof cacheSymbolNames) => {
      const names = symbolNames[type];
      const cacheNames = cacheSymbolNames[type];
      const addNames = names.difference(cacheNames);
      const delNames = cacheNames.difference(names);
      if (addNames.size !== 0 || delNames.size !== 0) {
        cacheSymbolNames[type] = names;
        if (names.size === 0) {
          diffSymbolNames[type] = "";
        } else {
          diffSymbolNames[type] = [
            yellow(`count(${names.size})`),
            addNames.size
              ? green(`(+${addNames.size})${[...addNames].slice(0, 3).join(",")}${addNames.size > 3 ? `...` : ""}`)
              : "",
            delNames.size
              ? red(`(-${delNames.size})${[...delNames].slice(0, 3).join(",")}${delNames.size > 3 ? `...` : ""}`)
              : "",
          ]
            .filter(Boolean)
            .join(" ");
        }
      }
      return diffSymbolNames[type];
    };
    return {
      postcssPlugin: "vite:rollup-plugin-material-symbol-generator",
      async Once(root) {
        const isTailwindcss = !!root.source?.input.from?.endsWith(tailwindFilename);
        debug("isTailwindcss", isTailwindcss, root.source?.input.from);
        if (!isTailwindcss) {
          return;
        }
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

        console.log(
          cyan("Material Symbols Variations"),
          obj_props(symbolVariations)
            .map((name) => {
              if (symbolVariations[name]) {
                return green(`${name} ✅`);
              }
              return gray(`${name} ➖`);
            })
            .join("│"),
        );
        for (const type of obj_props(symbolNames)) {
          const info = formatSymbolNames(type, symbolNames);
          if (info) {
            console.log(cyan(fontFamilys[type]), info);
          }
        }

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
        const fetchFonts = async (type: MaterialSymbolType, names: Array<MaterialSymbolName>) => {
          const fontFamily = fontFamilys[type];
          const cssUrl = downloadUrlBuilder({
            base: fontsGoogleApisBase,
            fontFamily,
            variations: usedVariations,
            names: names,
          });
          debug(`download cssUrl: %s`, cssUrl);
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
          debug(`download fontUrl: %s`, fontUrl);
          const fontResponse = await fetch(fontUrl);
          return { fontFamily, cssUrl, cssContent, fontUrl, fontResponse };
        };

        /// 4. 对收集到的信息做加工处理，并从google-apis服务下载文件
        let base_code = "";
        const inputId = createHash("sha256")
          .update(root.source?.input.from ?? "")
          .digest("hex")
          .slice(0, 6);
        const fileSuffix = `.${inputId}.woff2`;
        clearFonts(fileSuffix);
        await Promise.all(
          obj_props(symbolNames).map(async (type) => {
            const names = symbolNames[type];
            if (names.size === 0) {
              return;
            }
            const res = await fetchFonts(type, [...names]);
            const fontContent = Buffer.from(await res.fontResponse.arrayBuffer());
            fs.mkdirSync(outputDir, { recursive: true });
            const font_file_basename = res.fontFamily.replaceAll(" ", "") + fileSuffix;
            const font_filename = path.join(outputDir, font_file_basename);
            fs.writeFileSync(font_filename, fontContent);
            debug(`save fontname: %s`, font_filename);

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
