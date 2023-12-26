import { SetURLSearchParams } from 'react-router-dom'

export type TaskStatusCategory = 'new' | 'indeterminate' | 'done'

export interface TasksResponse {
    issues: Array<{
        id: string
        fields: {
            summary: string
            status: {
                name: string
                statusCategory: {
                    key: TaskStatusCategory
                }
            }
            timeoriginalestimate: number
            timespent: number
        }
    }>
    maxResults: number
    startAt: number
    total: number
}

export type Task = TasksResponse['issues'][number]

export interface TaskProps {
    id: TasksResponse['issues'][number]['id']
    fields: Task['fields']
    idxPage: number
    idxIssue: number
    setSearchParams: SetURLSearchParams
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

export type WorklogTaskMutation = { taskId: string; timeSpent: string; id?: string }
