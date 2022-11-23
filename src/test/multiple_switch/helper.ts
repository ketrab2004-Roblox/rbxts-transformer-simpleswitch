import dedent from "../dedent";


const numbers = [ "zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine" ]

export function generateSwitch(expression: string, caseCount: number, missesBreak: boolean, logPrepend: string, child?: string): string {

    const hasDefault = Math.random() >= .5;
    const childClause = Math.floor( Math.random() * caseCount );
    const breaklessClause = Math.floor( Math.random() * caseCount );

    let cases = ''

    for (let i = 0; i < caseCount - (+hasDefault); i++) {
        cases += dedent(`
            case ${i}:
                console.log("${logPrepend + numbers[i] ?? "idk"}");
                ${i == childClause && child ? child+"\n" : ''}${i == breaklessClause && missesBreak ? '' : "break;"}
        `);
    }


    if (hasDefault) {
        const i = caseCount-1;

        cases += dedent(`
            default:
                console.log("${logPrepend + "idk"}");
                ${i == childClause && child ? child+"\n" : ''}${i == breaklessClause && missesBreak ? '' : "break;"}
        `);
    }


    return dedent(`
        switch (${expression}) {
            ${cases}
        }
    `);
}
