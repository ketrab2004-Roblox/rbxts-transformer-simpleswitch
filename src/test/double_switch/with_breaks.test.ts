import applyTransformer from "../applyTransformer";
import dedent from "../dedent";
import { getSwitchCount, getIfElseCount } from "../helpers";


describe("nested switches with breaks should both be transformed", () => {
    const result = applyTransformer(dedent(`
    let a = 2,
        b = 5;

    switch (a) {
        case 1:
            switch (b) {
                case 3:
                    console.log("thirteen");
                    break;

                case 4:
                    console.log("fourteen");
                    break;

                case 5:
                    console.log("fifteen");
                    break;

                default:
                    console.log("one");
                    break;
            }
            break;

        case 2:
            console.log("two");
            break;

        default:
            console.log("uhmmm???");
            break;
    }
    `));

    test("should contain '//switch' twice", async () => {
        expect( getSwitchCount(result) ).toBe(2);
    });

    test("should contain 'else if'", async () =>
        expect(result).toEqual( expect.stringContaining("else if") )
    );

    test("should contain 7 'if', 'else' or 'else if' statements", async () => {
        expect( getIfElseCount(result) ).toBe(7);
    });
});
