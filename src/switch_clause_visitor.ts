import * as ts from "typescript";
import {} from "ts-expose-internals";

import type { TransformerContext } from "./index";
import clause_statements_visitor from "./switch_clause_statements_visitor";

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

        const {hasABreak: caseBlockHasABreak, statements: currentBlockContent} = clause_statements_visitor(context, caseBlock);

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