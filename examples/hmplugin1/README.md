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

This will create both a `debug` and `release` build of the app.
Output files are located in the `build` folder.

The `debug.wasm` file is recommended for debugging only.
Generally, the `release.wasm` version of your app is what should be published to Hypermode.

In the future, the other files in the `build` folder will help support testing and debugging.

## Schema and Sample Data

The `loaddata.sh` script can be used to populate schema and sample data.
It connects to Dgraph on `localhost:8080`, and applies the `schema.graphql` and `sampledata.graphql` files.

### Run the example

Try some graphql queries on the Dgraph endpoint:

```graphql
{
  add(a: 123, b: 456)
}
```

```graphql
{
  getFullName(firstName: "John", lastName:"Doe")
}
```

These will invoke the respective Hypermode functions within `hmplugin1`.

Next, try adding some data:

```graphql

mutation {
  addPerson(input: [
    { firstName: "Harry", lastName: "Potter" },
    { firstName: "Tom", lastName: "Riddle" },
    { firstName: "Albus", lastName: "Dumbledore" }
    ]) {
    person {
      id
      firstName
      lastName
      fullName
    }
  }
}
```

In the response, notice how the `fullName` field is returned,
which is the output from calling the `getFullName` function in `hmplugin1`.

You can now also query for data:

```graphql
{
  queryPerson {
    id
    firstName
    lastName
    fullName
  }
}
```

Again, the `fullName` field is populated by calling `getFullName` in `hmplugin1`.
