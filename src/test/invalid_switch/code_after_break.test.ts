import applyTransformer from "../applyTransformer";
import dedent from "../dedent";


export default async () => describe("with code after a break should not include said code", async () => {
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
            console.log("this log should not exist");
    }
    `));

    it("should not contain the code after the break", async () =>
        expect( result ).not.toContain("this log should not exist")
    );
});
