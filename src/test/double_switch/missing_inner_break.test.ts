import applyTransformer from "../applyTransformer";
import dedent from "../dedent";
import { getSwitchCount, getIfElseCount } from "../helpers";


export default async () => describe("with missing inner breaks should not transform the inner switch", async () => {
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
