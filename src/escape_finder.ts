import * as ts from "typescript";
import {} from "ts-expose-internals";

import type { TransformerContext } from "./index";
import { switchEscapes, ifEscapes } from "./path_checker";


export interface AcceptedEscapes {
    break: boolean,
    continue: boolean,
    return: boolean
}

export type EscapeStatement = ts.BreakStatement | ts.ContinueStatement | ts.ReturnStatement | ts.ThrowStatement;


/**
 * Checks if a statement is an escape, if not it will recurse into it using recurseStatementHasEscape.
 * @returns true if the statement has or is an escape
 */
export function statementHasOrIsEscape(context: TransformerContext, statement: ts.Statement): boolean {
    if (
        ts.isBreakStatement(statement)
        || ts.isReturnStatement(statement)
        || ts.isContinueStatement(statement)
    ) return true;


    return recursiveStatementHasEscape(context, statement, {
        // initial accepted breaks
        break: true,
        continue: true,
        return: true
    });
}

/**
 * Checks if a statement is an escape, if not it will recurse into it.
 * It also keeps track of which escapes can still be used to escape the upper switch statement.
 * @returns true if the statement has or is an escape
 */
export function recursiveStatementHasEscape(context: TransformerContext, nodeToRecurse: ts.Node, accepted: AcceptedEscapes): boolean {
    let foundBreak = false;

    for (const node of nodeToRecurse.getChildren()) {

        if (
            (accepted.break && ts.isBreakStatement(node))
            || (accepted.continue && ts.isContinueStatement(node))
            || (accepted.return && ts.isReturnStatement(node))
        ) {
            foundBreak = true;
            break;
        }

        // clone so we can edit it (each node gets its own version based on its parent node)
        const localAccepted = ts.clone(accepted)

        // stop accepting certain escapes when inside certain types of nodes
        if (ts.isFunctionLikeDeclaration(node)) {
            localAccepted.return = false;

            // breaks and continues inside a function don't work for the current switch
            localAccepted.break = false;
            localAccepted.continue = false;

        } else if (ts.isForStatement(node) || ts.isForInOrOfStatement(node)) {
            localAccepted.break = false;
            localAccepted.continue = false;

        } else if (ts.isSwitchStatement(node)) {
            localAccepted.break = false;

        } else if (ts.isIfStatement(node)) {
        }


        // can't accept any escapes anymore, so don't go deeper
        if ( !(localAccepted.break || localAccepted.continue || localAccepted.return) ) break;

        // go deeper
        foundBreak =
            ts.isSwitchStatement(node) ? switchEscapes(context, node, localAccepted) // if switch then switchEscapes()
                : ts.isIfStatement(node) ? ifEscapes(context, node, localAccepted) // else if if then ifEscapes()
                    : recursiveStatementHasEscape(context, node, accepted); // else recurse

        if (foundBreak != undefined) break;
    }

    return foundBreak;
}

export default statementHasOrIsEscape;