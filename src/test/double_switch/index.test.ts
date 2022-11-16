import with_break from "./with_breaks.test";
import missing_inner_break from "./missing_inner_break.test";
import missing_outer_break from "./missing_outer_break.test";
import missing_breaks from "./missing_breaks.test";

describe("Double nested switches", async () => {
    with_break();

    missing_inner_break();

    missing_outer_break();

    missing_breaks();
});
