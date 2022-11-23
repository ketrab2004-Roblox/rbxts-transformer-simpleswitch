import * as ts from "typescript";
import {} from "ts-expose-internals";

import type { VisitorFactory, Visitor } from "./index";
import switch_clause_visitor from "./switch_clause_visitor";


const switchVisitorFactory: VisitorFactory<ts.SwitchStatement> = context => {
    const switchVisitor: Visitor<ts.SwitchStatement> = switchStatement => {

        if (!ts.isSwitchStatement(switchStatement)) {
            throw new Error("Called parseSwitchStatement on a none-switchStatement node");
        }

        // parse each clause, to see if it can be converted to ifs
        // and to get the statement contents of each clause
        const {everyCaseClauseHasABreak, clauses, defaultClause} = switch_clause_visitor(context, switchStatement);

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