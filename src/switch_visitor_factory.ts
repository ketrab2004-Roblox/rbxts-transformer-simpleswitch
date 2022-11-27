import * as ts from "typescript";
import {} from "ts-expose-internals";

import type { VisitorFactory, Visitor } from "./index";
import clauseVisitor from "./switch_clause_visitor";


/**
 * Goes through every clause in a switch statement
 * to check whether each clause escapes using the switchClauseVisitor.
 * If every clause does, then it rebuilds everything into an if else chain.
 */
export const switchVisitorFactory: VisitorFactory<ts.SwitchStatement> = context => {
    const switchVisitor: Visitor<ts.SwitchStatement> = switchStatement => {

        // parse each clause, to see if it can be converted to ifs
        // and to get the statement contents of each clause
        const {everyCaseClauseHasABreak, clauses, defaultClause} = clauseVisitor(context, switchStatement);

        if (!everyCaseClauseHasABreak) {
            // keep going like normal
            return switchStatement;
        }

        // topBlock is default content, or last clause content
        let topNode: ts.IfStatement | undefined;
        let defaultNode = defaultClause ? ts.factory.createBlock(defaultClause?.content ?? [], true) : undefined;

        clauses.reverse().forEach(clauseHolder => {

            let nextNode = ts.factory.createIfStatement(
                ts.factory.createBinaryExpression(
                    switchStatement.expression,
                    ts.factory.createToken(ts.SyntaxKind.EqualsEqualsEqualsToken),
                    clauseHolder.case.expression
                ),

                ts.factory.createBlock(clauseHolder.content),

                topNode ?? defaultNode
            );

            topNode = nextNode;
        });


        if (topNode != undefined) {
            // add 'switch' comment (if not disabled)
            if (!context.config.disableSwitchComments) {
                ts.addSyntheticLeadingComment(
                    topNode,
                    ts.SyntaxKind.SingleLineCommentTrivia,
                    "switch",
                    true
                );
            }

            // go deeper like normal
            return ts.setOriginalNode(topNode, switchStatement);
        }

        throw new Error("Failed to convert switch statement to if else chain, switch statement is empty")
    }

    return switchVisitor;
}


export default switchVisitorFactory;