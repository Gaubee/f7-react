// ex. scripts/build_npm.ts
import { build, emptyDir, PackageJson } from "@deno/dnt";
import { FileEntry } from "@gaubee/nodekit";
import denoJson from "../deno.json" with { type: "json" };
import packageJson from "../package.json" with { type: "json" };
import fs from "node:fs";
import path from "node:path";

await emptyDir("./npm");
fs.mkdirSync("./npm", { recursive: true });
fs.writeFileSync("./npm/yarn.lock", "");

await build({
  entryPoints: Object.entries(denoJson.exports).map((item) => {
    return {
      kind: "export",
      name: item[0],
      path: item[1],
    };
  }),
  outDir: "./npm",
  shims: {
    // see JS docs for overview and more options
    deno: false,
  },
  test: false,
  packageManager: "yarn",
  scriptModule: false,
  compilerOptions: {
    target: "Latest",
  },
  package: {
    // package.json properties
    name: denoJson.npmName || denoJson.name,
    version: Deno.args[0] || denoJson.version,
    type: "module",
    description: "Reencapsulation of Framework7 React",
    license: "MIT",
    repository: {
      type: "git",
      url: "git+https://github.com/gaubee/f7-react.git",
    },
    bugs: {
      url: "https://github.com/gaubee/f7-react/issues",
    },
    dependencies: packageJson.dependencies,
    peerDependencies: packageJson.peerDependencies,
  },
  postBuild() {
    // steps to run after building and before running the tests
    Deno.copyFileSync("LICENSE", "npm/LICENSE");
    Deno.copyFileSync("README.md", "npm/README.md");

    const packageJsonEntry = new FileEntry("./npm/package.json");
    const packageJson = packageJsonEntry.readJson() as PackageJson;

    for (const key in packageJson.exports) {
      if (key.includes("/plugin/")) {
        const pluginExports = packageJson.exports[key];
        pluginExports.require = pluginExports.import.replace(/\.js$/, ".cjs");

        const esmFilename = path.basename(pluginExports.import);
        const cjsCode = new FileEntry("./npm/" + pluginExports.require.slice(2));
        cjsCode.write(
          `module.exports = (process.features.require_module ? require : require("esm")(module))("./${esmFilename}").default`,
        );
        console.log("cjsCode", cjsCode.path);
      }
    }
    packageJsonEntry.writeJson(packageJson, { space: 2 });
  },
});
