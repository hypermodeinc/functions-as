# Change Log

# 2024-04-18 - Version 0.5.0

_Note: Requires Hypermode Runtime v0.5.0 or newer_

- Internal metadata format has changed. [#39](https://github.com/gohypermode/functions-as/pull/39)
  - Metadata includes function signatures for improved Runtime support.
  - Compiling a project now outputs the metadata.
- **(BREAKING)** Support query parameters of different types. [#40](https://github.com/gohypermode/functions-as/pull/40)
- Further improvements to compiler output. [#41](https://github.com/gohypermode/functions-as/pull/41)
- Example project now uses a local path to the source library. [#42](https://github.com/gohypermode/functions-as/pull/42)
- Capture custom data type definitions in the metadata. [#44](https://github.com/gohypermode/functions-as/pull/44) [#52](https://github.com/gohypermode/functions-as/pull/52) [#53](https://github.com/gohypermode/functions-as/pull/53) [#55](https://github.com/gohypermode/functions-as/pull/55) [#56](https://github.com/gohypermode/functions-as/pull/56)
- Improve build scripts [#46](https://github.com/gohypermode/functions-as/pull/46) [#51](https://github.com/gohypermode/functions-as/pull/51)
- Add environment variable to debug metadata [#54](https://github.com/gohypermode/functions-as/pull/54)

# 2024-03-22 - Version 0.4.0

- Adds `model.generate<TData>` and `model.generateList<TData>` [#30](https://github.com/gohypermode/functions-as/pull/30)
- **(BREAKING)** `model.invokeTextGenerator` has been renamed to `model.generateText`

# 2024-03-14 - Version 0.3.0

- Metadata is now included during build. [#27](https://github.com/gohypermode/functions-as/pull/27)

  - You must also add `@hypermode/functions-as/transform` to the transforms in the `asconfig.json` file. For example:

    ```json
    "options": {
        "transform": [
            "@hypermode/functions-as/transform",
            "json-as/transform"
        ],
        "exportRuntime": true
    }
    ```

# 2024-03-13 - Version 0.2.2

- **(BREAKING)** Host functions that previously returned vector embeddings as strings now return `f64[]` instead. [#25](https://github.com/gohypermode/functions-as/pull/25)

_note: 0.2.1 was published prematurely and has been unpublished. Use 0.2.2._

# 2024-03-07 - Version 0.2.0

- Added `model.InvokeTextGenerator` [#20](https://github.com/gohypermode/functions-as/pull/20)

# 2024-02-23 - Version 0.1.0

This is the first published release of the Hypermode Functions library for AssemblyScript.

- Renamed from pre-release `hypermode-as` to `@hypermode/functions-as`
- Published to NPM
