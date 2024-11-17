import { AvatarUrls } from 'react-app/shared/types/Jira/CommonTypes'

export interface Filter {
    approximateLastUsed: string | null
    description: string
    editPermissions: Array<{
        id: number
        project?: {
            avatarUrls: AvatarUrls
            deleted?: boolean
            deletedBy?: {
                accountId: string
                accountType: string
                active: boolean
                avatarUrls: AvatarUrls
                displayName: string
                key: string
                name: string
                self: string
            }
            deletedDate?: string
            id: string
            insight?: {
                lastIssueUpdateTime: string
                totalIssueCount: number
            }
            key: string
            name: string
            projectCategory: {
                description: string
                id: string
                name: string
                self: string
            }
            retentionTillDate?: string
            self: string
            simplified: boolean
            style: string
        }
        group?: {
            groupId: string
            name: string
            self: string
        }
        role?: {
            self: string
            name: string
            id: number
            description: string
            actors: Array<{
                actorGroup?: {
                    name: string
                    displayName: string
                    groupId: string
                }
                actorUser?: {
                    accountId: string
                }
                displayName: string
                id: number
                type: string
            }>
            scope: {
                project: {
                    id: string
                    key: string
                    name: string
                }
                type: string
            }
        }
        type: string
    }>
    expand: string
    favourite: boolean
    favouritedCount: number
    id: string
    jql: string
    name: string
    owner: {
        accountId: string
        accountType: string
        active: boolean
        avatarUrls: AvatarUrls
        displayName: string
        key: string
        name: string
        self: string
    }
    searchUrl: string
    self: string
    sharePermissions: Array<{
        id: number
        type: string
        project?: {
            avatarUrls: {
                '16x16': string
                '24x24': string
                '32x32': string
                '48x48': string
            }
            id: string
            insight?: {
                lastIssueUpdateTime: string
                totalIssueCount: number
            }
            key: string
            name: string
            projectCategory: {
                description: string
                id: string
                name: string
                self: string
            }
            self: string
            simplified: boolean
            style: string
        }
    }>
    subscriptions: Array<{
        id: number
        user: {
            accountId: string
            accountType: string
            active: boolean
            applicationRoles: {
                items: any[] // Уточните тип, если известно
                size: number
            }
            avatarUrls: AvatarUrls
            displayName: string
            emailAddress: string
            groups: {
                items: any[] // Уточните тип, если известно
                size: number
            }
            key: string
            name: string
            self: string
            timeZone: string
        }
    }>
    viewUrl: string
}

export type FilterShortType = Pick<Filter, 'jql' | 'description' | 'id'>

export interface FilterResponse {
    isLast: boolean
    maxResults: number
    self: string
    startAt: number
    total: number
    values: Array<Filter>
}
