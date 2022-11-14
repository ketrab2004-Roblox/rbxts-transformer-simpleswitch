export default function dedent(str: string): string {
    let shortestWhitespace = Number.MAX_VALUE;

    const lines = str.replace(/^\n/, '').split("\n");

    lines.forEach(line => {
        const match = line.match(/^ +/);

        if (match && match[0].length < shortestWhitespace) {
            shortestWhitespace = match[0].length;
        }
    });

    const minWhitespace = " ".repeat(shortestWhitespace);

    return lines.map(line => line.replace( new RegExp(`^${minWhitespace}`), '' )).join("\n");
}
