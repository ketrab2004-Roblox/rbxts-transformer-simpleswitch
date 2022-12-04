import continue_escape from "./continue.test";
import return_escape from "./return.test";

import continue_inside_loop from "./continue_inside_inner_loop.test";
import return_inside_func from "./return_inside_inner_func.test";

import continue_inside_func from "./continue_inside_inner_func.test";
import return_inside_if from "./return_inside_inner_if.test";

fdescribe("Non break statements", async () => {
    continue_escape();

    return_escape();

    continue_inside_loop();

    return_inside_func();

    continue_inside_func();

    return_inside_if();
});
