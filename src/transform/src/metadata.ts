import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { execSync } from "child_process";
import * as path from "path";
import { Xid } from "xid-ts";
import binaryen from "assemblyscript/lib/binaryen.js";
import { FunctionSignature } from "./types.js";

export class HypermodeMetadata {
  buildId: string;
  buildTs: string;
  plugin: string;
  library: string;
  gitRepo?: string;
  gitCommit?: string;
  functions: FunctionSignature[] = [];

  static generate(): HypermodeMetadata {
    const m = new HypermodeMetadata();

    m.buildId = new Xid().toString();
    m.buildTs = new Date().toISOString();
    m.plugin = getPluginInfo();
    m.library = getHypermodeInfo();

    if (isGitRepo()) {
      m.gitRepo = getGitRepo();
      m.gitCommit = getGitCommit();
    }

    return m;
  }

  addFunctions(functions: FunctionSignature[]) {
    this.functions.push(...functions);
  }

  writeToModule(module: binaryen.Module) {
    const encoder = new TextEncoder();
    const json = JSON.stringify(this);
    module.addCustomSection("hypermode_meta", encoder.encode(json));
  }

  logOutput() {
    logColor("Hypermode Plugin Metadata:");
    logColor(`  Plugin: ${this.plugin}`);
    logColor(`  Library: ${this.library}`);
    logColor(`  Build ID: ${this.buildId}`);
    logColor(`  Build Timestamp: ${this.buildTs}`);

    if (this.gitRepo) {
      logColor(`  Git Repo: ${this.gitRepo}`);
      logColor(`  Git Commit: ${this.gitCommit}`);
    }

    console.log();

    logColor("Hypermode Functions:");
    this.functions.forEach((f) => logColor(`  ${f.toString()}`));
    console.log();
  }
}

function logColor(message: string) {
  console.log("\x1b[36m%s\x1b[0m", message);
}

function getHypermodeInfo(): string {
  const filePath = path.join(
    path.dirname(fileURLToPath(import.meta.url)),
    "..",
    "..",
    "package.json",
  );
  const json = readFileSync(filePath).toString();
  const lib = JSON.parse(json);
  return `${lib.name}@${lib.version}`;
}

function getPluginInfo(): string {
  const pluginName = process.env.npm_package_name;
  const pluginVersion = process.env.npm_package_version;
  return `${pluginName}@${pluginVersion}`;
}

function isGitRepo(): boolean {
  try {
    // This will throw if not in a git repo, or if git is not installed.
    execSync("git rev-parse --is-inside-work-tree", { stdio: "ignore" });
    return true;
  } catch (e) {
    return false;
  }
}

function getGitRepo(): string {
  let url = execSync("git remote get-url origin").toString().trim();

  // Convert ssh to https
  if (url.startsWith("git@")) {
    url = url.replace(":", "/").replace("git@", "https://");
  }

  // Remove the .git suffix
  if (url.endsWith(".git")) {
    url = url.slice(0, -4);
  }

  return url;
}

function getGitCommit(): string {
  return execSync("git rev-parse HEAD").toString().trim();
}
