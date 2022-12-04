import applyTransformer from "../applyTransformer";
import dedent from "../dedent";
import { getSwitchCount, getIfElseCount } from "../helpers";


export default async () => describe("with only a return inside not all branches of an ifelse chain shouldn't transform", async () => {
    const result = applyTransformer(dedent(`
    doSomething(2);

    function doSomething(a: number): string {
        switch (a) {
            case 1:
                console.log("one");
                if (Math.random() > .5) {
                    return "one!";
                }

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


    it("should contain no '//switch'", async () =>
        expect( getSwitchCount(result) ).toBe(0)
    );

    it("should not contain 'else if'", async () =>
        expect(result).not.toContain("else if")
    );

    it("should contain no extra 'if', 'else' or 'else if' statements", async () =>
        expect( getIfElseCount(result) ).toBe(1)
    );
});
