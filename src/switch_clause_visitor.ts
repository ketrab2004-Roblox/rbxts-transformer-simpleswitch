import * as ts from "typescript";
import {} from "ts-expose-internals";

import type { TransformerContext } from "./index";
import clause_statements_visitor from "./clause_statements_visitor";

interface ClauseHolder<T extends ts.CaseOrDefaultClause = ts.CaseClause> {
    case: T,
    content: ts.Statement[]
}
interface ClauseVisitorResult {
    clauses: ClauseHolder[],
    defaultClause: ClauseHolder<ts.DefaultClause> | undefined,
    everyCaseClauseHasABreak: boolean
}


/**
 * Goes through each clause in a switch statement using the clauseStatementsVisitor,
 * to see whether each clause escapes and to get all its statements.
 * @returns every clause with it's content, along with a boolean indicating whether every clause escapes.
 */
function clauseVisitor(context: TransformerContext, switchStatement: ts.SwitchStatement): ClauseVisitorResult {
    const toReturn: ClauseVisitorResult = {
        clauses: [],
        defaultClause: undefined,
        everyCaseClauseHasABreak: true
    }

    // go through every clause to see if they all use a break statement
    switchStatement.caseBlock.clauses.forEach(clause => {
        const {hasABreak: clauseHasABreak, statements: currentClauseContent} = clause_statements_visitor(context, clause);

        // if no break was found, every becomes false
        // if it's already false it won't change
        toReturn.everyCaseClauseHasABreak &&= clauseHasABreak;

        if (toReturn.everyCaseClauseHasABreak) {
            if (ts.isCaseClause(clause)) {
                toReturn.clauses.push({
                    case: clause,
                    content: currentClauseContent
                })
            } else {
                if (toReturn.defaultClause) {
                    throw new Error("SwitchStatement has multiple DefaultClauses");
                }

                toReturn.defaultClause = {
                    case: clause,
                    content: currentClauseContent
                }
            }
        }
    });

    return toReturn;
}

export default clauseVisitor;