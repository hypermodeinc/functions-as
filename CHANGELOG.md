# Change Log

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
