export const updateNotKeyIn = (jql: string, value: string | null) => {
    if (value) {
        const notKeyInClause = `NOT key in (${value})`

        if (jql.includes('NOT key in')) {
            return jql.replace(/NOT\skey\s+in\s+\(\d+(,\s*\d+)*\)/, notKeyInClause).trim()
        } else if (jql.trim().length > 0) {
            return `${notKeyInClause} AND ${jql.trim()}`
        } else {
            return notKeyInClause
        }
    } else {
        return jql
            .replace(/NOT\skey\s+in\s+\(\d+(,\s*\d+)*\)\s*AND/g, '')
            .replace(/NOT\skey\s+in\s+\(\d+(,\s*\d+)*\)/g, '')
            .trim()
    }
}
