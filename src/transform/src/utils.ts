import { Source } from "assemblyscript/dist/assemblyscript.js";

const isStdlibRegex = /~lib\/(?:array|arraybuffer|atomics|builtins|crypto|console|compat|dataview|date|diagnostics|error|function|iterator|map|math|number|object|process|reference|regexp|set|staticarray|string|symbol|table|typedarray|vector|rt\/?|bindings\/|shared\/typeinfo)|util\/|uri|polyfills|memory/;

export function isStdlib(source: Source) {
    return isStdlibRegex.test(source.internalPath);
}
