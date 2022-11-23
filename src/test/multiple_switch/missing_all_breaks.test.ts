import applyTransformer from "../applyTransformer";
import { getSwitchCount, getIfElseCount } from "../helpers";
import { generateSwitch } from "./helper";


export default async () => describe("with each switch missing a break should not transform anything", async () => {
    const result = applyTransformer(
        "let a = 3, b = 2, c = 1" +
        generateSwitch("a", 4, true, "1: ",
            generateSwitch("b", 2, true, "2: ",
                generateSwitch("c", 8, true, "3: ")
            )
        )
    );


    it("should contain no '//switch'", async () =>
        expect( getSwitchCount(result) ).toBe(0)
    );

    it("should contain no 'else if'", async () =>
        expect(result).not.toContain("else if")
    );

    it("should contain no 'if', 'else' or 'else if' statements", async () =>
        expect( getIfElseCount(result) ).toBe(0)
    );
});
