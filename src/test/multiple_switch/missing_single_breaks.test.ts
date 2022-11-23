import applyTransformer from "../applyTransformer";
import { getSwitchCount, getIfElseCount } from "../helpers";
import { generateSwitch } from "./helper";


export default async () => describe("with a single break missing (O is missing, X is with breaks)", async () => {
    describe("O-X-X", async () => {
        const result = applyTransformer(
            "let a = 1, b = 2, c = 3" +
            generateSwitch("a", 4, true, "1: ",
                generateSwitch("b", 2, false, "2: ",
                    generateSwitch("c", 8, false, "3: ")
                )
            )
        );


        it("should contain 2 '//switch's", async () =>
            expect( getSwitchCount(result) ).toBe(2)
        );

        it("should contain 10 'if', 'else' or 'else if' statements", async () =>
            expect( getIfElseCount(result) ).toBe(10)
        );
    });


    describe("X-O-X", async () => {
        const result = applyTransformer(
            "let a = 1, b = 2, c = 3" +
            generateSwitch("a", 4, false, "1: ",
                generateSwitch("b", 2, true, "2: ",
                    generateSwitch("c", 8, false, "3: ")
                )
            )
        );


        it("should contain 2 '//switch's", async () =>
            expect( getSwitchCount(result) ).toBe(2)
        );

        it("should contain 12 'if', 'else' or 'else if' statements", async () =>
            expect( getIfElseCount(result) ).toBe(12)
        );
    });


    describe("X-X-O", async () => {
        const result = applyTransformer(
            "let a = 1, b = 2, c = 3" +
            generateSwitch("a", 4, false, "1: ",
                generateSwitch("b", 2, false, "2: ",
                    generateSwitch("c", 8, true, "3: ")
                )
            )
        );

        it("should contain 2 '//switch's", async () =>
            expect( getSwitchCount(result) ).toBe(2)
        );

        it("should contain 6 'if', 'else' or 'else if' statements", async () =>
            expect( getIfElseCount(result) ).toBe(6)
        );
    });
});
