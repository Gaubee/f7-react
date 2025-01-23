// ex. scripts/build_npm.ts
import { build, emptyDir } from "@deno/dnt";

await emptyDir("./npm");
import denoJson from "../deno.json" with { type: "json" };
import packageJson from "../package.json" with { type: "json" };
import fs from "node:fs";
import path from "node:path";

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
  packageManager: "yarn",
  scriptModule: false,
  compilerOptions: {
    target: "Latest",
  },
  package: {
    // package.json properties
    name: denoJson.npmName || denoJson.name,
    version: Deno.args[0] || denoJson.version,
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
  },
});
