import * as ts from "typescript";
import switchTransformer from "../index";


const program = ts.createProgram({
    rootNames: ["src"],
    options: {
        newLine: ts.NewLineKind.LineFeed,
        removeComments: false
    }
});
const printer = ts.createPrinter(program.getCompilerOptions());

export default function applyTransformer(code: string): string {
    const sourceFile = ts.createSourceFile(
        "index.ts",
        code,
        ts.ScriptTarget.ES2015,
        true,
        ts.ScriptKind.TS
    );

    const result = switchTransformer(program)(ts.nullTransformationContext)(sourceFile);

    const resultText = printer.printNode(ts.EmitHint.SourceFile, result, sourceFile);

    return resultText;
}
