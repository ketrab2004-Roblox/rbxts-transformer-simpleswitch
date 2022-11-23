import * as ts from "typescript";
import {} from "ts-expose-internals";

import type { VisitorFactory, Visitor } from "./index";

const switchVisitorFactory: VisitorFactory<ts.SwitchStatement> = context => {
    const switchVisitor: Visitor<ts.SwitchStatement> = switchStatement => {

        if (!ts.isSwitchStatement(switchStatement)) {
            throw new Error("Called parseSwitchStatement on a none-switchStatement node");
        }

        const clauses: {case: ts.CaseClause, content: ts.Statement[]}[] = [];
        let defaultClause: {case: ts.DefaultClause, content: ts.Statement[]} | undefined;

        let everyCaseClauseHasABreak = true;
        // go through every case to see if they all use a break statement
        ts.visitEachChild(switchStatement.caseBlock, caseBlock => {

            if (!(ts.isCaseClause(caseBlock) || ts.isDefaultClause(caseBlock))) {
                throw new Error(`Child of CaseBlock is neither a CaseClause nor a DefaultClause`);
            }

            let caseBlockHasABreak = false;
            const currentBlockContent: ts.Statement[] = [];

            // go through every node in this case, to see if one is a break statement
            caseBlock.statements.forEach(node => {

                if (ts.isBreakStatement(node)) {
                    caseBlockHasABreak = true;

                    // only add nodes before the first break to the list (below)
                    return;
                }

                if (!caseBlockHasABreak) {
                    currentBlockContent.push(node);
                }

            }, context);

            // if no break was found, every becomes false
            // if it's already false it won't change
            everyCaseClauseHasABreak &&= caseBlockHasABreak;

            if (everyCaseClauseHasABreak) {
                if (ts.isCaseClause(caseBlock)) {
                    clauses.push({
                        case: caseBlock,
                        content: currentBlockContent
                    })
                } else {
                    if (defaultClause) {
                        throw new Error("SwitchStatement has multiple DefaultClauses");
                    }

                    defaultClause = {
                        case: caseBlock,
                        content: currentBlockContent
                    }
                }
            }

            return caseBlock;
        }, context.context);


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
            // add 'switch' comment
            ts.addSyntheticLeadingComment(
                topNode,
                ts.SyntaxKind.SingleLineCommentTrivia,
                "switch",
                true
            );

            // go deeper like normal
            return ts.setOriginalNode(topNode, switchStatement);
        }

        throw new Error("Failed to convert switch statement to if else chain, switch statement is empty")
    }

    return switchVisitor;
}


export default switchVisitorFactory;