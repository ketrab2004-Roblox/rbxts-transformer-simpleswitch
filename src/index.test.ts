import { Transformer } from "ts-transformer-testing-library";
import switchTransformer from "./index";


describe("Testing the switch case transformer", () => {
    test("true should be true", () => {
        expect(true).toBeTruthy();
    });

    const transformersSetup = new Transformer()
        .addTransformer(switchTransformer);

    test("An actual test", () => {
        // const result = transformString(`
        // let a = 2;

        // switch (a) {
        //     case 1:
        //         console.log("one");
        //         break;

        //     case 2:
        //         console.log("two");
        //         break;

        //     default:
        //         console.log("uhmmm???");
        //         break;
        // };
        // `, {
        //     transforms: [
        //         switchTransformer
        //     ]
        // });

        const result = transformersSetup.transform(`
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
        `);

        console.log(result);

        expect(result).toBe(`
        let a = 2
        if (a == 1) {
            console.log("one");
        } elseif (a == 2) {
            console.log("two");
        } else {
            console.log("uhmmm???");
        }
        `);
    })
});
