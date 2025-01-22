import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

import { createRequire } from "node:module";
import path from "node:path";
import fs from "node:fs";
import { m } from "./dist/assets/index-B8PM5oqE.js";

export default {
  content: ["./src/**/*.{js,jsx,ts,mts,tsx}"],
  theme: {
    screens: {
      // fold: 折叠小屏幕
      fold: "254px",
      // Small: phone 小屏幕
      s: "360px",
      sm: "375px",
      sm2: "414px",
      // Medium: phone 横屏
      md: "576px",
      // ↑ Medium ~ Large: phone 横屏、 phone 高分辨率
      // ↓ Large: ipad min
      lg: "768px",
      // ↑ Large ~ Extra Large: pad 横屏、 pad 高分辨率
      // ↓ Extra Large: 个人电脑（笔记本、桌面）
      xl: "960px",
      xl2: "1280px",
      xl3: "1440px",
    },
  },
  plugins: [
    plugin(({ matchUtilities, addUtilities }) => {
      const require = createRequire(import.meta.url);
      const symbols_dir = path.dirname(
        require.resolve("@material-symbols/svg-400/package.json"),
      );
      const outlined_dir = path.join(symbols_dir, "outlined");
      const all_symbols = fs.readdirSync(outlined_dir).filter((svg) =>
        svg.endsWith(".svg")
      ).map((svg) => svg.slice(0, -4));
      const numValues = (min: number, max: number, step: number) => {
        const res: Record<string, string> = {};
        for (let v = min; v <= max; v += step) {
          res[v] = v.toString();
        }
        res[max] = max.toString();
        return res;
      };
      // opsz,20..48
      matchUtilities({
        "msv-opsz": (value) => {
          return {
            fontVariationSettings: `"opsz" ${value}`,
          };
        },
      }, {
        values: numValues(20, 48, 4),
        type: "number",
      });
      // FILL,0..1
      matchUtilities({
        "msv-fill": (value) => {
          return {
            fontVariationSettings: `"FILL" ${value}`,
          };
        },
      }, {
        values: numValues(0, 1, 0.1),
        type: "number",
      });
      // GRAD,-50..200
      matchUtilities({
        "msv-grad": (value) => {
          return {
            fontVariationSettings: `"GRAD" ${value}`,
          };
        },
      }, {
        values: numValues(-50, 200, 10),
        type: "number",
      });
      // wght,100..700
      matchUtilities({
        "msv-wght": (value) => {
          return {
            fontVariationSettings: `"wght" ${value}`,
          };
        },
      }, {
        values: numValues(100, 700, 100),
        type: "number",
      });

      addUtilities(all_symbols.map((symbolName) => {
        return {
          [`.ms-${symbolName}`]: {
            content: `" "`,
          },
          [`.ms-outlinted-${symbolName}`]: {
            content: `" "`,
          },
          [`.ms-rounded-${symbolName}`]: {
            content: `" "`,
          },
          [`.ms-sharp-${symbolName}`]: {
            content: `" "`,
          },
        };
      }));
    }),
  ],
} satisfies Config;
