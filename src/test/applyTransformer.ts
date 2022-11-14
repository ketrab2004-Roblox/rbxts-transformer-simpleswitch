import * as ts from "typescript";
import switchTransformer from "../index";

const printer = ts.createPrinter({
    newLine: ts.NewLineKind.LineFeed,
    removeComments: false
});

export default function applyTransformer(code: string): string {
    const sourceFile = ts.createSourceFile(
        "index.ts",
        code,
        ts.ScriptTarget.ES2015,
        true,
        ts.ScriptKind.TS
    );

    const result = switchTransformer(ts.nullTransformationContext)(sourceFile);

    return printer.printNode(ts.EmitHint.SourceFile, result, sourceFile);
}
