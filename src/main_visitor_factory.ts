import * as ts from "typescript";
import {} from "ts-expose-internals";

import type { VisitorFactory, Visitor } from "./index";
import switchVisitorFactory from "./switch_visitor_factory";


const mainVistorFactory: VisitorFactory = context => {
    const switchVisitor = switchVisitorFactory(context);

    const visitor: Visitor = node => {

        if (ts.isSwitchStatement(node)) {
            node = switchVisitor(node);
        }

        return ts.visitEachChild(node, visitor, context.context);
    };

    return (node => ts.visitEachChild(node, visitor, context.context)) as ts.Transformer<ts.Node>;
}


export default mainVistorFactory;