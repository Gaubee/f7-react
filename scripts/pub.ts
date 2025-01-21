import cp from "node:child_process";
import path from "node:path";
import fs from "node:fs";
import url from "node:url";
import * as colors from "@std/fmt/colors";

import denoJson from "../deno.json" with { type: "json" };

const npmPackageJsonFilename = url.fileURLToPath(
  import.meta.resolve("../npm/package.json"),
);

const npmPackageJson = JSON.parse(
  fs.readFileSync(npmPackageJsonFilename, "utf8"),
);
for (const pkgName of [denoJson.name, denoJson.npmName]) {
  npmPackageJson.name = pkgName;
  fs.writeFileSync(
    npmPackageJsonFilename,
    JSON.stringify(npmPackageJson, null, 2),
  );
  try {
    cp.execSync("npm publish --access public", {
      cwd: path.dirname(npmPackageJsonFilename),
      stdio: "inherit",
    });
  } catch {
    console.warn(colors.yellow("npm publish failed"));
  }
}
