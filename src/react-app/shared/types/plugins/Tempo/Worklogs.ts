export interface WorklogsTempoResponse {
    self: string
    metadata: {
        count: number
        offset: number
        limit: number
    }
    results: Array<WorklogTempo>
}

export interface WorklogTempo {
    self: string
    tempoWorklogId: number
    issue: {
        self: string
        id: number
    }
    timeSpentSeconds: number
    billableSeconds: number
    startDate: string
    startTime: string
    description: string
    createdAt: string
    updatedAt: string
    author: {
        self: string
        accountId: string
    }
    attributes: {
        self: string
        values: Array<unknown>
    }
}
