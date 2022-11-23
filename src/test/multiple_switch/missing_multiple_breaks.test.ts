import applyTransformer from "../applyTransformer";
import { getSwitchCount, getIfElseCount } from "../helpers";
import { generateSwitch } from "./helper";


export default async () => describe("with multiple breaks missing (O is missing, X is with breaks)", async () => {
    describe("X-O-O", async () => {
        const result = applyTransformer(
            "let a = 1, b = 2, c = 3" +
            generateSwitch("a", 4, false, "1: ",
                generateSwitch("b", 2, true, "2: ",
                    generateSwitch("c", 8, true, "3: ")
                )
            )
        );


        it("should contain one '//switch'", async () =>
            expect( getSwitchCount(result) ).toBe(1)
        );

        it("should contain 4 'if', 'else' or 'else if' statements", async () =>
            expect( getIfElseCount(result) ).toBe(4)
        );
    });


    describe("O-X-O", async () => {
        const result = applyTransformer(
            "let a = 1, b = 2, c = 3" +
            generateSwitch("a", 4, true, "1: ",
                generateSwitch("b", 2, false, "2: ",
                    generateSwitch("c", 8, true, "3: ")
                )
            )
        );


        it("should contain one '//switch'", async () =>
            expect( getSwitchCount(result) ).toBe(1)
        );

        it("should contain 2 'if', 'else' or 'else if' statements", async () =>
            expect( getIfElseCount(result) ).toBe(2)
        );
    });


    describe("O-O-X", async () => {
        const result = applyTransformer(
            "let a = 1, b = 2, c = 3" +
            generateSwitch("a", 4, true, "1: ",
                generateSwitch("b", 2, true, "2: ",
                    generateSwitch("c", 8, false, "3: ")
                )
            )
        );

        it("should contain one '//switch'", async () =>
            expect( getSwitchCount(result) ).toBe(1)
        );

        it("should contain 8 'if', 'else' or 'else if' statements", async () =>
            expect( getIfElseCount(result) ).toBe(8)
        );
    });
});
