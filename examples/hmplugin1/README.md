# Hypermode Example Plugin 1

This is an example Hypermode plugin, written in [AssemblyScript](https://www.assemblyscript.org/).

## Dependencies

First, install [Node.js](https://nodejs.org/) version 18 or newer
on your development workstation or build server

Then, install package dependencies:

```sh
npm install
```

## Building

To build the plugin:

```sh
npm run build
```

Output files are located in the `build` folder.

- `hmplugin1.wasm` - This is the compiled program that will be executed via the Hypermode Runtime.
- `hmplugin1.wasm.map` - This is a file that will support an improved debug experience in the future. It is currently unused.

Note, the name of the file will be generated from the `"name"` field specified in `package.json`.
You can also provide a `"version"` if you like, though it is not mandatory.

## Schema and Sample Data

The Hypermode Runtime will auto-generate the schema for your plugin, based on the signatures of your exported functions.

However, this example also includes some functions that query data from Dgraph. If you would like to try that out,
you will need to a schema and sample data for Dgraph.

In the `./extras` folder, you will find the following:

- `schema.graphql` - A Dgraph schema that is used by some of the example functions.
- `sampledata.graphql` - Some mutations that apply sample data based on that schema.
- `loaddata.sh` - A convenient script for applying the schema and sample data.

Note, the script presumes Dgraph is located at `http://localhost:8080`.
If it is elsewhere, you will need to update the script accordingly.

### Run the example

Try some graphql queries on the Hypermode Runtime endpoint:

```graphql
{
  add(a: 123, b: 456)
}
```

```graphql
{
  getFullName(firstName: "John", lastName: "Doe")
}
```

These will invoke the respective Hypermode functions within `hmplugin1`.

There are other example functions to try. See the source code in [`./assembly/index.ts`](./assembly/index.ts).
