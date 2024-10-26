export interface ConfigurationTimeTrackingOptions {
    workingHoursPerDay: number
    workingDaysPerWeek: number
}

export interface Filters {
    values: Array<{
        self: string
        name: string
        id: string
    }>
}

export interface FilterDetails {
    jql: string
    description: string
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
            issuetype: {
                iconUrl: string
                name: string
            }
            created: string
            assignee: Assignee | null
            timeoriginalestimate: number
            timespent: number
            worklog: WorklogResponse
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

export interface WorklogComment {
    comment?: {
        type: 'doc'
        version: 1
        content: [
            {
                type: 'paragraph'
                content: [
                    {
                        type: 'text'
                        text: string
                    },
                ]
            },
        ]
    }
}

export interface WorklogResponse {
    id: string
    worklogs: Array<{
        id: string
        author: Assignee
        timeSpent: string
        timeSpentSeconds: number
        started: string
        updated: string
        updateAuthor: Assignee
        comment?: WorklogComment['comment']
    }>
}

export interface MySelfResponse {
    accountId: string
    id: string
    displayName: string
    avatarUrls: {
        '16x16': string
        '24x24': string
        '32x32': string
        '48x48': string
    }
}

export interface WorklogIssueMutation extends WorklogComment {
    taskId: string
    timeSpentSeconds?: number
    id?: string
    started?: string
    timeSpent?: string
}

export interface WorklogIssueDelete extends Required<Pick<WorklogIssueMutation, 'id' | 'taskId'>> {}
