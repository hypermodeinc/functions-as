# Hypermode AssemblyScript Library

This repository contains the shared library used by Hypermode plugins written in AssemblyScript.
It provides access to host functions of the Hypermode platform, as well as additional
AssemblyScript classes and helper functions for use with Hypermode plugins.

## Getting Started

### Prerequisites

Ensure you have [Node.js](https://nodejs.org/) 18 or higher installed. (Node 20 is recommended.)

If desired, you can use [nvm](https://github.com/nvm-sh/nvm/blob/master/README.md) to install
and select a specific version of Node.js.  This is useful if you have multiple versions on your machine.

```
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash
nvm install 20
nvm use 20
```

### Compiling an example plugin

The [`examples`](./examples/) folder contains example plugins that you can test with,
or use as starter templates for your own plugins.  See the README file in each sample
for further details.

### Publishing a plugin to Hypermode

_TBD_
