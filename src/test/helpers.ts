export function getSwitchCount(input: string): number {
    return input.match(/\/\/switch/g)?.length ?? 0;
}

export function getIfElseCount(input: string): number {
    return input.match(/((else if *\()|else *{|if *\()/g)?.length ?? 0;
}
