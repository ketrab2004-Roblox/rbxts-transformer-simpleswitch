import * as ts from "typescript";
import switchTransformer from "./index";


const printer = ts.createPrinter({
    newLine: ts.NewLineKind.LineFeed,
    removeComments: false
});
function applyTransformer(code: string): string {
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


describe("Testing the switch case transformer", () => {
    test("true should be true", () => {
        expect(true).toBeTruthy();
    });

    test("An actual test", () => {
        const result = applyTransformer(`
        let a = 2;

        switch (a) {
            case 1:
                console.log("one");
                break;

            case 2:
                console.log("two");
                break;

            default:
                console.log("uhmmm???");
                break;
        }
        `);

        console.log(result);

        expect(result).toBe(`
        let a = 2
        // switch
        if (a == 1) {
            console.log("one");
        } elseif (a == 2) {
            console.log("two");
        } else {
            console.log("uhmmm???");
        }
        `);
    })
});
