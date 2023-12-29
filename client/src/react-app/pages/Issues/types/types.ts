export interface Filters {
    values: Array<{
        self: string
        name: string
        id: string
    }>
}

export interface FilterDetails {
    jql: string
}

export type IssueStatusCategory = 'new' | 'indeterminate' | 'done'

export interface Assignee {
    avatarUrls:
        | {
              '16x16': string
              '24x24': string
              '32x32': string
              '48x48': string
          }
        | undefined
    displayName: string
    accountId: string | null
}

export interface IssueResponse {
    issues: Array<{
        id: string
        key: string
        fields: {
            summary: string
            status: {
                id: string
                name: string
                statusCategory: {
                    key: IssueStatusCategory
                }
            }
            project: {
                name: string
                avatarUrls: {
                    '16x16': string
                    '24x24': string
                    '32x32': string
                    '48x48': string
                }
            }
            priority: {
                iconUrl: string
                name: string
            }
            assignee: Assignee | null
            timeoriginalestimate: number
            timespent: number
        }
    }>
    maxResults: number
    startAt: number
    total: number
}

export type Issue = IssueResponse['issues'][number]

export type IssuesTrackingResponse = Issue[]

export type AssignableResponse = Assignee[]

export interface TaskProps {
    id: IssueResponse['issues'][number]['id']
    issueKey: IssueResponse['issues'][number]['key']
    fields: Issue['fields']
    idxPage?: number
    idxIssue: number
}

export interface UseWorklogQuery {
    taskId: string
}

export interface WorklogResponse {
    id: string
    worklogs: Array<{
        id: string
        author: { accountId: string }
        timeSpent: string
        timeSpentSeconds: number
        started: string
    }>
}

export interface MySelfResponse {
    accountId: string
    id: string
}

export type WorklogIssueMutation = { taskId: string; timeSpent: string; id?: string }
