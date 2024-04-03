import binaryen from "assemblyscript/lib/binaryen.js";
export class Extractor {
    binaryen;
    module;
    program;
    constructor(transform, module) {
        this.program = transform.program;
        this.binaryen = transform.binaryen;
        this.module = module;
    }
    async getExportedFunctions() {
        const functions = await this.getAllFunctions();
        const paths = this.getExportedFunctionPaths();
        const results = paths
            .map((path) => functions.get(path))
            .filter((f) => f !== undefined)
            .sort((a, b) => a.name.localeCompare(b.name));
        return results;
    }
    async getAllFunctions() {
        ignoreCompilerMismatchWarning();
        const { HypermodeVisitor } = await import("./visitor.js");
        const visitor = new HypermodeVisitor();
        this.program.parser.sources.forEach((source) => visitor.visit(source));
        return visitor.functions;
    }
    getExportedFunctionPaths() {
        const paths = [];
        const funcs = new Map();
        for (let i = 0; i < this.module.getNumFunctions(); ++i) {
            const ref = this.module.getFunctionByIndex(i);
            const info = this.binaryen.getFunctionInfo(ref);
            funcs.set(info.name, info);
        }
        for (let i = 0; i < this.module.getNumExports(); ++i) {
            const ref = this.module.getExportByIndex(i);
            const info = this.binaryen.getExportInfo(ref);
            if (info.kind !== binaryen.ExternalFunction) {
                continue;
            }
            if (info.name.startsWith("_")) {
                continue;
            }
            const f = funcs.get(info.value);
            if (f === undefined) {
                continue;
            }
            paths.push(info.value.replace(/^export:/, ""));
        }
        return paths;
    }
}
const cw = console.warn;
function ignoreCompilerMismatchWarning() {
    console.warn = (message, ...optionalParams) => {
        if (message === "compiler mismatch: std/portable included twice") {
            return;
        }
        cw(message, ...optionalParams);
    };
}
//# sourceMappingURL=extractor.js.map