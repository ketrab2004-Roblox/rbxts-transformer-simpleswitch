export function getNumAsTextOrSomething(num: number): string {
    let result;

    switch (num) {
        case 1:
            result = "1";
            break;

        case 2:
            result = "2";
            break;

        default:
            result = "idk";
            break;
    }

    return result;
}
