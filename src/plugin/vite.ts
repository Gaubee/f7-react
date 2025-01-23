export * from "./vite/css-plugin.ts";
// export * from "./icon-plugin.ts";
import { framework7CssPlugin } from "./vite/css-plugin.ts";
export default framework7CssPlugin;
// import {
//   materialSymbolGeneratorPlugin,
//   MaterialSymbolGeneratorPluginOptions,
// } from "./icon-plugin.ts";
// import type { Plugin } from "vite";
// export default function f7cVitePlugin(
//   opts: { icon?: MaterialSymbolGeneratorPluginOptions } = {},
// ): Plugin[] {
//   return [framework7CssPlugin(), materialSymbolGeneratorPlugin(opts.icon)];
// }
