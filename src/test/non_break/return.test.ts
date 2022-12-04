import applyTransformer from "../applyTransformer";
import dedent from "../dedent";
import { getSwitchCount, getIfElseCount } from "../helpers";


export default async () => describe("with a return instead of a break should transform", async () => {
    const result = applyTransformer(dedent(`
    doSomething(2);

    function doSomething(a: number): string {
        switch (a) {
            case 1:
                console.log("one");
                return "one";

            case 2:
                console.log("two");
                break;

            default:
                console.log("uhmmm???");
                break;
        }

        return "not one";
    }
    `));


    it("should contain one '//switch'", async () =>
        expect( getSwitchCount(result) ).toBe(1)
    );

    it("should contain 'else if'", async () =>
        expect(result).toContain("else if")
    );

    it("should contain 3 'if', 'else' or 'else if' statements", async () =>
        expect( getIfElseCount(result) ).toBe(3)
    );
});
