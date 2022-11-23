import with_breaks from "./with_breaks.test";
import missing_single_breaks from "./missing_single_breaks.test";
import missing_multiple_breaks from "./missing_multiple_breaks.test";
import missing_all_breaks from "./missing_all_breaks.test";

describe("Multiple switches", async () => {
    with_breaks();

    missing_single_breaks();

    missing_multiple_breaks();

    missing_all_breaks();
});
