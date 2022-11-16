import applyTransformer from "../applyTransformer";
import dedent from "../dedent";


export default async () => describe("with code after a break should not include said code", async () => {

    it("should throw error or something", async () =>
        expect(
            () => applyTransformer(dedent(`
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

                    default:
                        console.log("second default clause");
                        break;
                }
            `))
        ).toThrow()
    );
});
