import * as ts from "typescript";
import {} from "ts-expose-internals";

import type { TransformerContext } from "./index";
import { AcceptedEscapes, recursiveStatementHasEscape } from "./escape_finder";


/**
 * Checks if each path in the given switch statement escapes.
 * @returns true if each path in the given switch escapes
 */
export function switchEscapes(context: TransformerContext, statement: ts.SwitchStatement, accepted: AcceptedEscapes): boolean {

    let foundDefaultClause = false;
    for (const clause of statement.caseBlock.clauses) {
        if (ts.isDefaultClause(clause)) {
            foundDefaultClause = true;
            break;
        }
    }

    //TODO allow switch that covers each case of an enum to not need a default clause
    if (!foundDefaultClause) return false;


    // escapes in a switch statement, that stop 2 clauses from being connected
    const clauseEscapes: AcceptedEscapes = {
        break: true,
        continue: false,
        return: false
    };

    // combine clauses without break into one
    const actualClauses: ts.CaseOrDefaultClause[][] = [[]];
    for (const clause of statement.caseBlock.clauses) {
        const hasBreak = recursiveStatementHasEscape(context, clause, clauseEscapes);

        // add clause onto last amalgamation
        actualClauses[actualClauses.length -1].push(clause);

        // if current clause has no break, create new amalgamation for the next clause
        if (hasBreak) {
            actualClauses.push([]);
        }
    }


    let allAmalgamationsEscape = true;
    for (const amalgamation of actualClauses) {
        const lastClause = amalgamation[amalgamation.length -1];

        // only check last clause, because if it escapes all previous clauses will also escape
        let foundEscape = recursiveStatementHasEscape(context, lastClause, accepted);

        allAmalgamationsEscape &&= foundEscape;

        if (!foundEscape) break;
    }

    return allAmalgamationsEscape;
}

/**
 * Checks if each path in the given if else chain escapes.
 * @returns true if each path in the given if else chain escapes
 */
export function ifEscapes(context: TransformerContext, statement: ts.IfStatement, accepted: AcceptedEscapes): boolean{

    const paths: ts.Statement[] = [];
    let deepest: ts.IfStatement | undefined = statement;

    while (deepest) {
        const next: ts.Statement | undefined = deepest.elseStatement;

        if (next == undefined) {
            //TODO allow if else chain that covers each case of an enum to not need a default clause
            // if else chain is missing a final else
            return false; // not all paths exist, so it's not possible that all paths escape
        }

        paths.push(next);

        if (ts.isIfStatement(next)) {
            deepest = next;
        } else {
            deepest = undefined;
        }
    }

    // check each path
    let allEscape = true;
    for (const path of paths) {
        let thisPathEscapes = recursiveStatementHasEscape(context, path, ts.clone(accepted));

        if (!thisPathEscapes) {
            allEscape = false;
            break;
        }
    }

    return allEscape;
}
