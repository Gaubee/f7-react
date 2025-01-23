import process from "node:process";
import { formatWithOptions } from "node:util";
import createPlugin from "tailwindcss/plugin";
import { materialSymbolNames as all_symbols } from "../../custom/icon.types.ts";

type PluginWithOptions<T> = ReturnType<typeof createPlugin.withOptions<T>>;
export const msiconPlugin: PluginWithOptions<void> = createPlugin.withOptions<void>(
  () =>
    ({ matchUtilities, addUtilities }) => {
      const isVite = !process.argv[1]?.endsWith("tailwindServer.js");
      const log = isVite
        ? (...args: unknown[]) =>
            console.info(
              formatWithOptions(
                {
                  colors: true,
                },
                ...args,
              ),
            )
        : () => {};

      const numValues = (min: number, max: number, step: number) => {
        const res: Record<string, string> = {};
        for (let v = min; v <= max; v += step) {
          res[v] = v.toString();
        }
        res[max] = max.toString();
        return res;
      };
      // opsz,20..48
      matchUtilities(
        {
          "msv-opsz": (value, extra) => {
            log("msv-opsz", value, extra);
            return {
              fontVariationSettings: `"opsz" ${value}`,
            };
          },
        },
        {
          values: numValues(20, 48, 4),
          type: "number",
        },
      );
      // FILL,0..1
      matchUtilities(
        {
          "msv-fill": (value, extra) => {
            log("msv-fill", value, extra);
            return {
              fontVariationSettings: `"FILL" ${value}`,
            };
          },
        },
        {
          values: numValues(0, 1, 0.1),
          type: "number",
        },
      );
      // GRAD,-50..200
      matchUtilities(
        {
          "msv-grad": (value, extra) => {
            log("msv-grad", value, extra);
            return {
              fontVariationSettings: `"GRAD" ${value}`,
            };
          },
        },
        {
          values: numValues(-50, 200, 10),
          type: "number",
        },
      );
      // wght,100..700
      matchUtilities(
        {
          "msv-wght": (value, extra) => {
            log("msv-wght", value, extra);
            return {
              fontVariationSettings: `"wght" ${value}`,
            };
          },
        },
        {
          values: numValues(100, 700, 100),
          type: "number",
        },
      );

      //   matchUtilities(
      //     {
      //       msi: (value, extra) => {
      //         log("msi", value, extra);
      //         return { content: `" "` };
      //       },
      //       "msi-outlinted": (value, extra) => {
      //         log("msi-outlinted", value, extra);
      //         return { content: `" "` };
      //       },
      //       "msi-rounded": (value, extra) => {
      //         log("msi-rounded", value, extra);
      //         return { content: `" "` };
      //       },
      //       "msi-sharp": (value, extra) => {
      //         log("msi-sharp", value, extra);
      //         return { content: `" "` };
      //       },
      //     },
      //     {
      //       values: all_symbols.reduce(
      //         (acc, symbolName) => {
      //           acc[symbolName] = symbolName;
      //           return acc;
      //         },
      //         {} as Record<string, string>,
      //       ),
      //     },
      //   );

      addUtilities(
        all_symbols.map((symbolName) => {
          return {
            [`.msi-${symbolName}`]: {
              content: `" "`,
            },
            [`.msi-outlinted-${symbolName}`]: {
              content: `" "`,
            },
            [`.msi-rounded-${symbolName}`]: {
              content: `" "`,
            },
            [`.msi-sharp-${symbolName}`]: {
              content: `" "`,
            },
          };
        }),
      );
    },
);
