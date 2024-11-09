import { AvatarUrls } from 'react-app/shared/types/Jira/CommonTypes'

export interface WorklogResponse {
    maxResults: number
    startAt: number
    total: number
    worklogs: Worklog[]
}

export interface Worklog {
    author: {
        accountId: string
        active: boolean
        displayName: string
        avatarUrls: AvatarUrls
        self: string
    }
    comment: {
        type: string
        version: number
        content: {
            type: string
            content: {
                type: string
                text: string
            }[]
        }[]
    }
    id: string
    issueId: string
    self: string
    started: string
    created: string
    timeSpent: string
    timeSpentSeconds: number
    updateAuthor: {
        accountId: string
        active: boolean
        displayName: string
        self: string
    }
    updated: string
    visibility: {
        identifier: string
        type: string
        value: string
    }
}
