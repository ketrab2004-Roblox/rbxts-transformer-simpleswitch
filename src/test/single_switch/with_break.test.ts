import applyTransformer from "../applyTransformer";
import dedent from "../dedent";
import { getSwitchCount, getIfElseCount } from "../helpers";


export default async () => describe("with breaks should be transformed correctly", async () => {
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

    it("should contain '//switch' once", async () =>
        expect( getSwitchCount(result) ).toBe(1)
    );

    it("should contain 'else if'", async () =>
        expect(result).toContain("else if")
    );

    it("should contain 3 'if', 'else' or 'else if' statements", async () =>
        expect( getIfElseCount(result) ).toBe(3)
    );
});
