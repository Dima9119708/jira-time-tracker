export interface Tasks {
    columnConfig: {
        columns: Array<{
            name: string
        }>
    }
    tasks: {
        issues: Array<{
            id: string
            fields: {
                summary: string
            }
        }>
        maxResults: number
        startAt: number
        total: number
    }
}
