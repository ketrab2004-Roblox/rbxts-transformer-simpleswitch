import * as ts from "typescript";
import {} from "ts-expose-internals";

import mainVisitorFactory from "./main_visitor_factory";


export interface TransformerConfig {
    disableSwitchComments?: boolean,
    disableBreakComments?: boolean
}


export class TransformerContext {
    public readonly program: ts.Program;
    public readonly config: TransformerConfig;
    public readonly context: ts.TransformationContext;

    constructor(program: ts.Program, config: TransformerConfig, context: ts.TransformationContext) {
        this.program = program;
        this.config = config;
        this.context = context;
    }
}


export type VisitorFactory<T extends ts.Node = ts.Node> = (context: TransformerContext) => Visitor<T>;
export type Visitor<T extends ts.Node = ts.Node> = (node: T) => ts.Node;
export type StrictVisitor<T extends ts.Node = ts.Node> = (node: T) => T;


/**
 * The starting point of the transformer.
 * Sets up the mainVisitor.
 */
export const main = (program: ts.Program, config?: TransformerConfig): ts.TransformerFactory<ts.SourceFile> => {

    //TODO validate config

    return context => { // transformer factory
        const Context = new TransformerContext(program, config ?? {}, context);

        const visitor = mainVisitorFactory(Context);

        return (sourceFile: ts.SourceFile) => { // transformer
            return visitor(sourceFile) as ts.SourceFile;
        }
    };
}


export default main;