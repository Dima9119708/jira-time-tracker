import { Jast, JastBuilder, Operand, OrderByDirection, walkAST } from '@atlaskit/jql-ast'

type OrderBy = string[]

export const getValueFromJql = <Result>(jql: string, fieldName: string | OrderBy, defaultValue?: Result) => {
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

                        if ('values' in operand) {
                            // @ts-ignore
                            resolve(operand.values.reduce((acc, operand) => {
                                if ('value' in operand) {
                                    // @ts-ignore
                                    acc.push(operand.value)
                                }

                                return acc
                            }, []))
                        }
                    }
                },
                enterOrderBy: (orderBy) => {
                    if (Array.isArray(fieldName)) {
                        const _orderBy = fieldName.reduce((acc, name) => {
                            const orderByField = orderBy.fields.find((field) => field.field.text === name)

                            if (orderByField) {
                                acc.push((orderByField.direction as OrderByDirection).value)
                            }

                            return acc
                        }, [] as string[])

                        // @ts-ignore
                        resolve(_orderBy)
                    }
                },
                exitQuery: () => {
                    // @ts-ignore
                    resolve(defaultValue)
                }
            },
            myJast
        )
    })
}
