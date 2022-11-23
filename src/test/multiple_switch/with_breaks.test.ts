import applyTransformer from "../applyTransformer";
import { getSwitchCount, getIfElseCount } from "../helpers";
import { generateSwitch } from "./helper";


export default async () => describe("with no missing breaks should transform all", async () => {
    const result = applyTransformer(
        "let a = 1, b = 2, c = 3" +
        generateSwitch("a", 4, false, "1: ",
            generateSwitch("b", 2, false, "2: ",
                generateSwitch("c", 8, false, "3: ")
            )
        )
    );


    it("should contain 3 '//switch's", async () =>
        expect( getSwitchCount(result) ).toBe(3)
    );

    it("should contain 'else if'", async () =>
        expect(result).toContain("else if")
    );

    it("should contain 14 'if', 'else' or 'else if' statements", async () =>
        expect( getIfElseCount(result) ).toBe(14)
    );
});
