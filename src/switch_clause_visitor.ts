import * as ts from "typescript";
import {} from "ts-expose-internals";

import type { TransformerContext } from "./index";

interface ClauseHolder<T extends ts.CaseClause | ts.DefaultClause = ts.CaseClause> {
    case: T,
    content: ts.Statement[]
}
interface ClauseVisitorResult {
    clauses: ClauseHolder[],
    defaultClause: ClauseHolder<ts.DefaultClause> | undefined,
    everyCaseClauseHasABreak: boolean
}


function clauseVisitor(context: TransformerContext, switchStatement: ts.SwitchStatement): ClauseVisitorResult {
    const toReturn: ClauseVisitorResult = {
        clauses: [],
        defaultClause: undefined,
        everyCaseClauseHasABreak: true
    }

    // go through every clause to see if they all use a break statement
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

                if (!context.config.disableBreakComments) {
                    // create empty statement, because .addSyntheticTrailingComment() doesn't work
                    const lastNode = ts.factory.createEmptyStatement();

                    ts.addSyntheticLeadingComment(
                        lastNode,
                        ts.SyntaxKind.SingleLineCommentTrivia,
                        "break",
                        true
                    );

                    currentBlockContent.push(lastNode);
                }

                // only add nodes before the first break to the list (below)
                return;
            }

            if (!caseBlockHasABreak) {
                currentBlockContent.push(node);
            }

        }, context);

        // if no break was found, every becomes false
        // if it's already false it won't change
        toReturn.everyCaseClauseHasABreak &&= caseBlockHasABreak;

        if (toReturn.everyCaseClauseHasABreak) {
            if (ts.isCaseClause(caseBlock)) {
                toReturn.clauses.push({
                    case: caseBlock,
                    content: currentBlockContent
                })
            } else {
                if (toReturn.defaultClause) {
                    throw new Error("SwitchStatement has multiple DefaultClauses");
                }

                toReturn.defaultClause = {
                    case: caseBlock,
                    content: currentBlockContent
                }
            }
        }

        return caseBlock;
    }, context.context);

    return toReturn;
}

export default clauseVisitor;