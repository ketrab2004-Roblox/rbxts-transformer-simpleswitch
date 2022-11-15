
describe("testing whether jasmine works", async () => {
    it("true should be true", async () =>
        expect(true).toBeTrue()
    );

    it("false should not be truthy", async () =>
        expect(false).not.toBeTruthy()
    );
});
