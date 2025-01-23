import fs from "node:fs";
import path from "node:path";
import prettier from "prettier";
type ComponentItem = {
  name: string;
  f7?: string;
  f7React?: string;
  types?: string;
  custom?: string;
};
const allComponents: ComponentItem[] = [
  {
    name: "accordion",
    f7: "accordion",
    f7React: "accordion-content|accordion-item|accordion-toggle|accordion",
  },
  {
    name: "actions",
    f7: "actions",
    f7React: "actions-button|actions-group|actions-label|actions",
  },
  { name: "app", f7: "", f7React: "app", custom: "setup.ts" },
  { name: "area-chart", f7: "area-chart", f7React: "area-chart" },
  { name: "badge", f7: "", f7React: "badge" },
  {
    name: "block",
    f7: "",
    f7React: "block-footer|block-header|block-title|block",
  },
  {
    name: "breadcrumbs",
    f7: "breadcrumbs",
    f7React: "breadcrumbs-collapsed|breadcrumbs-item|breadcrumbs-separator|breadcrumbs",
  },
  { name: "button", f7: "", f7React: "button" },
  {
    name: "card",
    f7: "card",
    f7React: "card-content|card-footer|card-header|card",
  },
  { name: "checkbox", f7: "checkbox", f7React: "checkbox" },
  { name: "chip", f7: "chip", f7React: "chip" },
  {
    name: "fab",
    f7: "fab",
    f7React: "fab-backdrop|fab-button|fab-buttons|fab",
  },
  { name: "gauge", f7: "gauge", f7React: "gauge" },
  { name: "icon", f7: "", f7React: "icon", custom: "icon.tsx" },
  { name: "input", f7: "input", f7React: "list-input|input" },
  { name: "link", f7: "", f7React: "link" },
  {
    name: "list",
    f7: "",
    f7React: "list-button|list-group|list-item-content|list-item",
    custom: "list.ts",
  },
  { name: "list-index", f7: "list-index", f7React: "list-index" },
  { name: "contacts-list", f7: "contacts-list", custom: "contacts-list.tsx" },
  { name: "virtual-list", f7: "virtual-list", custom: "virtual-list.tsx" },
  {
    name: "login-screen",
    f7: "login-screen",
    f7React: "login-screen-title|login-screen",
  },
  {
    name: "messagebar",
    f7: "messagebar",
    f7React:
      "messagebar-attachment|messagebar-attachments|messagebar-sheet-image|messagebar-sheet-item|messagebar-sheet|messagebar",
  },
  {
    name: "messages",
    f7: "messages",
    f7React: "message|messages-title|messages",
  },
  {
    name: "navbar",
    f7: "",
    f7React: "nav-left|nav-right|nav-title-large|nav-title|navbar",
  },
  { name: "page", f7: "", f7React: "page-content|page" },
  { name: "panel", f7: "panel", f7React: "panel" },
  { name: "photo-browser", f7: "photo-browser", f7React: "photo-browser" },
  { name: "pie-chart", f7: "pie-chart", f7React: "pie-chart" },
  { name: "popover", f7: "popover", f7React: "popover" },
  { name: "popup", f7: "popup", f7React: "popup" },
  { name: "preloader", f7: "preloader", f7React: "preloader" },
  { name: "sortable", f7: "sortable", f7React: "" },
  { name: "progressbar", f7: "progressbar", f7React: "progressbar" },
  { name: "radio", f7: "radio", f7React: "radio" },
  { name: "range", f7: "range", f7React: "range" },
  { name: "routable-modals", f7: "", f7React: "routable-modals" },
  { name: "searchbar", f7: "searchbar", f7React: "searchbar" },
  { name: "segmented", f7: "", f7React: "segmented" },
  { name: "sheet", f7: "sheet", f7React: "sheet" },
  {
    name: "skeleton",
    f7: "skeleton",
    // f7React: "skeleton-avatar|skeleton-block|skeleton-image|skeleton-text",
    custom: "skeleton.ts",
  },
  { name: "stepper", f7: "stepper", f7React: "stepper" },
  { name: "subnavbar", f7: "", f7React: "subnavbar" },
  {
    name: "swipeout",
    f7: "swipeout",
    f7React: "swipeout-actions|swipeout-button",
  },
  { name: "tabs", f7: "tabs", f7React: "tab|tabs" },
  { name: "text-editor", f7: "text-editor", f7React: "text-editor" },
  { name: "toggle", f7: "toggle", f7React: "toggle" },
  { name: "toolbar", f7: "", f7React: "toolbar" },
  { name: "treeview", f7: "treeview", f7React: "treeview-item|treeview" },
  { name: "view", f7: "", f7React: "view|views" },
  { name: "infinite-scroll", f7: "infinite-scroll", f7React: "" },
  { name: "pull-to-refresh", f7: "pull-to-refresh", f7React: "" },
  { name: "data-table", f7: "data-table", f7React: "" },
  {
    name: "swiper",
    f7: "swiper?exportjs=false",
    f7React: "",
    custom: "swiper.ts",
  },
  { name: "notification", f7: "notification", f7React: "" },
  { name: "autocomplete", f7: "autocomplete", f7React: "" },
  { name: "tooltip", f7: "tooltip", f7React: "" },
  { name: "color-picker", f7: "color-picker", f7React: "" },
  { name: "typography", f7: "typography", f7React: "" },
  { name: "dialog", f7: "dialog", types: "Dialog", custom: "dialog.ts" },
  { name: "toast", f7: "toast", custom: "toast.ts" },
  { name: "router", custom: "safe-router/mod.ts" },
];

const parse = (str: string) => {
  const url = new URL(`data:${str}`);
  return {
    name: url.pathname,
    caseName: url.pathname.replace(/^[a-z]/, (c) => c.toUpperCase()).replace(/-(.)/g, (_, c) => c.toUpperCase()),
    params: url.searchParams,
  };
};

const boolean = (str: string | null | undefined, defaultValue: boolean) => {
  if (str == null) {
    return defaultValue;
  }
  return str === "true";
};
const resolveTo = (...paths: string[]) => path.resolve(import.meta.dirname, ...paths);
const exports: Array<[string, string]> = [
  [".", "./src/index.ts"],
  // ["./source/*", resolveTo("../../../node_modules/framework7/*")],
];

for (const { name, f7, f7React, types, custom } of allComponents) {
  const filename = resolveTo(`../src/components/${name}.ts`);
  const f7Code = f7
    ?.split("|")
    .filter(Boolean)
    .map((f7) => {
      const info = parse(f7);
      f7 = info.name;
      const moduleName = info.caseName + "Module";
      const enableCss = boolean(info.params.get("css"), true);
      const enableExportJs = boolean(info.params.get("exportjs"), true);
      return `
        ${enableCss ? `import 'framework7/components/${f7}/css';` : ""}
        ${
          enableExportJs
            ? `export type { ${info.caseName} as $${info.caseName} } from 'framework7/components/${f7}';`
            : ""
        }
        import ${moduleName} from 'framework7/components/${f7}';
        await f7.loadModule(${moduleName});
        `;
    });
  const f7ReactCode = f7React
    ?.split("|")
    .filter(Boolean)
    .map((componentName) => {
      const info = parse(componentName);
      componentName = info.name;
      const componentFn = info.caseName;
      return `
      export * from 'framework7-react/components/${componentName}.js';
      export { default as ${componentFn} } from 'framework7-react/components/${componentName}.js';
      `;
    });
  const typesCode = types
    ?.split("|")
    .filter(Boolean)
    .map((typeName) => `export type {${typeName}} from 'framework7/types'`);

  const customCode =
    custom
      ?.split("|")
      .filter(Boolean)
      .map((customName) => {
        const info = parse(customName);
        const enableInline = boolean(info.params.get("inline"), false);
        customName = info.name;
        if (enableInline) {
          const customCode = fs.readFileSync(resolveTo(`../src/custom/${customName}.ts`), "utf-8");
          return customCode;
        }

        return `export * from '../custom/${customName}';`;
      }) ?? [];

  const fileCode = [
    `/**
      * ---
      * lang:zh
      * ---
      * 警告！
      * 该文件代码是自动生成，请勿手动修改！
      */`,
    typesCode,
    f7Code?.length ? [`import {f7} from 'framework7-react';`, ...f7Code] : [],
    f7ReactCode,
    customCode,
    `/**
      * ---
      * lang:en
      * ---
      * Warning!
      * The file code is automatically generated, do not manually modify!
      */`,
  ].flat();
  fs.writeFileSync(
    filename,
    await prettier.format(fileCode.join("\n"), {
      parser: "typescript",
    }),
  );
  exports.push(["./" + name, `./src/components/${name}.ts`]);
}
exports.sort((a, b) => b[0].localeCompare(a[0]));

const denoJsonFilename = resolveTo("../deno.json");
const denoJson = JSON.parse(fs.readFileSync(denoJsonFilename, "utf-8"));
const extExports = Object.keys(denoJson.exports)
  .filter((k) => k.startsWith("./ext/") || k.startsWith("./plugin/"))
  .reduce(
    (exports, key) => {
      exports[key] = denoJson.exports[key];
      return exports;
    },
    {} as Record<string, string>,
  );
fs.writeFileSync(
  denoJsonFilename,
  await prettier.format(
    JSON.stringify({
      ...denoJson,
      exports: {
        ...extExports,
        ...Object.fromEntries(exports),
      },
    }),
    { parser: "json" },
  ),
);
