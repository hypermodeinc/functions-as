import MockHost from "./mockHost.js";

export default {
  entries: ["assembly/__tests__/**/*.spec.ts"],
  include: ["assembly/__tests__/**/*.include.ts"],
  disclude: [/node_modules/],
  outputBinary: false,

  async instantiate(memory, createImports, instantiate, binary) {
    const host = new MockHost();

    const imports = {
      env: { memory },
      hypermode: {
        ...host.getImports(),
      },
    };

    let instance = instantiate(binary, createImports(imports));
    instance.then((result) => host.setInstance(result));
    return instance;
  },
};
