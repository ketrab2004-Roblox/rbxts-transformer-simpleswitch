import * as ts from "typescript";
import {} from "ts-expose-internals";

import type { TransformerContext } from "./index";
import hasOrIsEscape from "./escape_finder";

interface ClauseStatementsVisitorResult {
    hasABreak: boolean,
    statements: ts.Statement[]
}


/**
 * Goes through all the statements in a clause to see if one of them is an escape (using hasOrIsEscape).
 * @returns whether the clause escapes and whether
 */
function clauseStatementsVisitor(context: TransformerContext, clause: ts.CaseOrDefaultClause): ClauseStatementsVisitorResult {
    const toReturn: ClauseStatementsVisitorResult = {
        hasABreak: false,
        statements: []
    };

    clause.statements.forEach(node => {
        if (hasOrIsEscape(context, node)) {
            toReturn.hasABreak = true;

            // only replace actual break statements with comments, if not disabled
            if (ts.isBreakStatement(node) && !context.config.disableBreakComments) {
                // create empty statement, because .addSyntheticTrailingComment() doesn't work
                const lastNode = ts.factory.createEmptyStatement();

                ts.addSyntheticLeadingComment(
                    lastNode,
                    ts.SyntaxKind.SingleLineCommentTrivia,
                    "break",
                    true
                );

                toReturn.statements.push(lastNode);
            }

            // only add nodes before the first break to the list (below)
            return;
        }

        if (!toReturn.hasABreak) {
            toReturn.statements.push(node);
        }
    });

    return toReturn;
}

export default clauseStatementsVisitor;