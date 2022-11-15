import applyTransformer from "../applyTransformer";
import dedent from "../dedent";
import { getSwitchCount, getIfElseCount } from "../helpers";


describe("Switch with breaks should be transformed correctly", () => {
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

    test("should contain '//switch' once", async () => {
        expect( getSwitchCount(result) ).toBe(1);
    });

    test("should contain 'else if'", async () =>
        expect(result).toEqual( expect.stringContaining("else if") )
    );

    test("should contain 3 'if', 'else' or 'else if' statements", async () => {
        expect( getIfElseCount(result) ).toBe(3);
    });
});
