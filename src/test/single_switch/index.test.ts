import with_break from "./with_break.test";
import missing_break from "./missing_break.test";

describe("Single switch", async () => {
    with_break();

    missing_break();
});

