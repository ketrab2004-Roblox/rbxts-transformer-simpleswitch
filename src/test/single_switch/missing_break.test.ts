import applyTransformer from "../applyTransformer";
import dedent from "../dedent";
import { getSwitchCount, getIfElseCount } from "../helpers";


describe("Switch with missing breaks should not be transformed", () => {
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

    test("should not contain '//switch'", async () => {
        expect( getSwitchCount(result) ).toBe(0);
    });

    test("should not contain 'else if'", async () =>
        expect(result).toEqual( expect.not.stringContaining("else if") )
    );

    test("should contain no 'if', 'else' or 'else if' statements", async () => {
        expect( getIfElseCount(result) ).toBe(0);
    });
});
