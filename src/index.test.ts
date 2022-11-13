import * as ts from "typescript";
import switchTransformer from "./index";


function dedent(str: string): string {
    let shortestWhitespace = Number.MAX_VALUE;

    const lines = str.replace(/^\n/, '').split("\n");

    lines.forEach(line => {
        const match = line.match(/^ +/);

        if (match && match[0].length < shortestWhitespace) {
            shortestWhitespace = match[0].length;
        }
    });

    const minWhitespace = " ".repeat(shortestWhitespace);

    return lines.map(line => line.replace( new RegExp(`^${minWhitespace}`), '' )).join("\n");
}


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

describe("Testing if jest works", () => {
    test("true should be true", () =>
        expect(true).toBeTruthy()
    );

    test("false should not be true", () =>
        expect(false).not.toBeTruthy()
    );
});

describe("Testing the switch case transformer", () => {
    describe("switch with breaks should be transformed correctly", () => {
        const result = applyTransformer(dedent(`
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
        `));

        test("should contain '//switch' once", () => {
            const matches = result.match(/\/\/switch/);

            expect(matches?.length).toBe(1);
        });

        test("should contain 'else if'", () =>
            expect(result).toEqual( expect.stringContaining("else if") )
        );

        test("should contain 3 'if', 'else' or 'else if' statements", () => {
            const matches = result.match(/((else if)|else|if)/g);

            expect(matches?.length).toBe(3);
        });
    });


    describe("switch with missing breaks should not be transformed", () => {
        const result = applyTransformer(dedent(`
        let a = 2;

        switch (a) {
            case 1:
                console.log("one");

            case 2:
                console.log("two");
                break;

            default:
                console.log("uhmmm???");
                break;
        }
        `));

        test("should not contain '//switch'", () => {
            const matches = result.match(/\/\/switch/);

            expect(matches?.length).toBeUndefined();
        });

        test("should not contain 'else if'", () =>
            expect(result).toEqual( expect.not.stringContaining("else if") )
        );

        test("should contain no 'if', 'else' or 'else if' statements", () => {
            const matches = result.match(/((else if)|else|if)/g);

            expect(matches?.length).toBeUndefined();
        });
    });
});
