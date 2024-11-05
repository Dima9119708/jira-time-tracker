import { Jast, JastBuilder, Operand, walkAST } from '@atlaskit/jql-ast'

export const getValueFromJql = <Result>(jql: string, fieldName: string) => {
    const myJast: Jast = new JastBuilder().build(jql)

    return new Promise<Result>((resolve, reject) => {
        walkAST(
            {
                exitTerminalClause: (terminalClause) => {
                    if (terminalClause.field.text === fieldName) {
                        const operand = terminalClause.operand as Operand

                        if ('value' in operand) {
                            // @ts-ignore
                            resolve(operand.value)
                        }
                    }
                },
            },
            myJast
        )
    })
}
