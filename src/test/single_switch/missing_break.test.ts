import applyTransformer from "../applyTransformer";
import dedent from "../dedent";
import { getSwitchCount, getIfElseCount } from "../helpers";


export default async () => describe("with missing breaks should not be transformed", async () => {
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

    it("should not contain '//switch'", async () =>
        expect( getSwitchCount(result) ).toBe(0)
    );

    it("should not contain 'else if'", async () =>
        expect(result).not.toContain("else if")
    );

    it("should contain no 'if', 'else' or 'else if' statements", async () =>
        expect( getIfElseCount(result) ).toBe(0)
    );
});
