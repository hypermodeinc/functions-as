import { Transform } from "assemblyscript/transform";
import { TextEncoder } from "util";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { execSync } from "child_process";
import { Xid } from "xid-ts";
import process from "process";

// This transform adds metadata to the compiled wasm file, as custom sections.

export default class HypermodeTransform extends Transform {
  afterCompile(module) {
    // Setup for adding UTF-8 strings in wasm custom sections.
    const encoder = new TextEncoder();
    const addInfo = (name, data) => {
      module.addCustomSection(name, encoder.encode(data));
    };

    // Add metadata.
    addInfo("build_id", getBuildId());
    addInfo("build_ts", getBuildTimestamp());
    addInfo("hypermode_library", getHypermodeInfo());
    addInfo("hypermode_plugin", getPluginInfo());

    // Add git metadata if available.
    if (isGitRepo()) {
      addInfo("git_repo", getGitRepo());
      addInfo("git_commit", getGitCommit());
    }
  }
}

function getBuildId() {
  return new Xid().toString();
}

function getBuildTimestamp() {
  return new Date().toISOString();
}

function getHypermodeInfo() {
  const path = join(dirname(fileURLToPath(import.meta.url)), "package.json");
  const lib = JSON.parse(readFileSync(path));
  return `${lib.name}@${lib.version}`;
}

function getPluginInfo() {
  const pluginName = process.env.npm_package_name;
  const pluginVersion = process.env.npm_package_version;
  return `${pluginName}@${pluginVersion}`;
}

function isGitRepo() {
  try {
    // This will throw if not in a git repo, or if git is not installed.
    execSync("git rev-parse --is-inside-work-tree", { stdio: "ignore" });
    return true;
  } catch (e) {
    return false;
  }
}

function getGitRepo() {
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

function getGitCommit() {
  return execSync("git rev-parse HEAD").toString().trim();
}
