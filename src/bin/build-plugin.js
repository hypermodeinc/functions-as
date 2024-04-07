import { execSync } from "child_process";
import { readFile } from "fs/promises";
import { existsSync } from "fs";
import process from "process";
import console from "console";

const npm = process.env.npm_execpath;
const pkg = process.env.npm_package_name;
const ver = process.env.npm_package_version;

if (!npm) {
  console.error("This script must be run with npm.");
  process.exit(1);
}

if (!pkg || !ver) {
  console.error("A package name and version must be defined in package.json.");
  process.exit(1);
}

const target = process.argv[2] || "debug";
if (target !== "debug" && target !== "release") {
  console.error("Invalid target. Use 'debug' or 'release'");
  process.exit(1);
}

await validatePackageJson();
await validateAsJson();

console.log(`Building ${pkg}@${ver} in ${target} mode...`);
const cmd = `node ${npm} exec -- asc assembly/index.ts -o build/${pkg}.wasm --target ${target}`;
execSync(cmd, { stdio: "inherit" });

async function loadPackageJson() {
  const file = process.env.npm_package_json;
  return JSON.parse(await readFile(file));
}

function verifyPackageInstalled(pkgJson, name, dev) {
  if (!pkgJson.dependencies?.[name] && !pkgJson.devDependencies?.[name]) {
    console.error(`Package ${name} not found in package.json.`);
    console.error(`Please run: npm install ${name}${dev ? " --save-dev" : ""}`);
    process.exit(1);
  }
}

async function validatePackageJson() {
  const pkgJson = await loadPackageJson();
  verifyPackageInstalled(pkgJson, "assemblyscript", true);
  verifyPackageInstalled(pkgJson, "@assemblyscript/wasi-shim", true);
  verifyPackageInstalled(pkgJson, "visitor-as", true);

  const overrides = pkgJson.overrides;
  if (!overrides || overrides["assemblyscript"] !== "$assemblyscript") {
    const msg = `package.json must contain the following:

    "overrides": {
      "assemblyscript": "$assemblyscript"
    }`;
    console.error(msg);
    process.exit(1);
  }
}

async function validateAsJson() {
  const file = "asconfig.json";

  if (!existsSync(file)) {
    console.error(`${file} not found.`);
    process.exit(1);
  }

  const config = JSON.parse(await readFile(file));

  const t = "@hypermode/functions-as/transform";
  const transforms = config?.options?.transform || [];
  if (!transforms.includes(t)) {
    console.error(`${file} must include "${t}" in the "transform" option.`);
    process.exit(1);
  }
}
