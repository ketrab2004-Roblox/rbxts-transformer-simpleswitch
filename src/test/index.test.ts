
describe("Testing if jest works", () => {
    test("true should be true", async () =>
        expect(true).toBe(true)
    );

    test("false should not be truthy", async () =>
        expect(false).not.toBeTruthy()
    );
});
