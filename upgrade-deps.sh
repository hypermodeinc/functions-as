#!/usr/bin/env bash
# Upgrades all dependencies to the latest version, on all projects.
# Respects the semver versioning scheme.
# Requires npm-check-updates (https://www.npmjs.com/package/npm-check-updates).

set -euo pipefail
trap "cd \"${PWD}\"" EXIT
cd "$(dirname "$0")"

cd src
ncu -u -t semver
npm install

cd ../examples
for example in *; do
  if [ -d "${example}" ]; then
    cd "${example}"
    ncu -u -t semver
    npm install
    cd ..
  fi
done
