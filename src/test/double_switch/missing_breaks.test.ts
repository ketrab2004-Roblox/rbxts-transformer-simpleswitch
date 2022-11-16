import applyTransformer from "../applyTransformer";
import dedent from "../dedent";
import { getSwitchCount, getIfElseCount } from "../helpers";


export default async () => describe("with missing outer breaks should only transform the inner switch", async () => {
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
                    console.log("five");

                default:
                    console.log("one");
                    break;
            }

        case 2:
            console.log("two");
            break;

        default:
            console.log("uhmmm???");
            break;
    }
    `));

    it("should contain no '//switch'", async () =>
        expect( getSwitchCount(result) ).toBe(0)
    );

    it("should not contain 'else if'", async () =>
        expect(result).not.toContain("else if")
    );

    it("should contain no 'if', 'else' or 'else if' statements", async () =>
        expect( getIfElseCount(result) ).toBe(0)
    );
});
