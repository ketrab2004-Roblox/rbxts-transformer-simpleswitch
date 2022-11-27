import * as ts from "typescript";
import {} from "ts-expose-internals";

import type { TransformerContext } from "./index";


interface ClauseStatementsVisitorResult {
    hasABreak: boolean,
    statements: ts.Statement[]
}


function clauseStatementsVisitor(context: TransformerContext, clause: ts.CaseClause | ts.DefaultClause): ClauseStatementsVisitorResult {
    const toReturn: ClauseStatementsVisitorResult = {
        hasABreak: false,
        statements: []
    };

    clause.statements.forEach(node => {
        if (ts.isBreakStatement(node)) {
            toReturn.hasABreak = true;

            if (!context.config.disableBreakComments) {
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