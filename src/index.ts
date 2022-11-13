import * as ts from "typescript";
import {} from "ts-expose-internals";


/**
 * Transformer entry point
 */
export default function<T extends ts.Node>(program: ts.Program): ts.TransformerFactory<T>
{
	return (context) => {
		const visit: ts.Visitor = node => {
			if (ts.isSwitchStatement(node)) {
				return [
					// ts.factory.createJSDocText("wowie"),
					node
				]
			}

			return ts.visitEachChild(node, child => visit(child), context);
		};

		return node => ts.visitNode(node, visit);
	}
}
