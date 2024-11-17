import { AvatarUrls } from 'react-app/shared/types/Jira/CommonTypes'

export interface ApplicationRoles {
    items: any[]
    size: number
}

export interface Groups {
    items: any[]
    size: number
}

export interface MySelf {
    accountId: string
    accountType: string
    active: boolean
    applicationRoles: ApplicationRoles
    avatarUrls: AvatarUrls
    displayName: string
    emailAddress: string
    groups: Groups
    key: string
    name: string
    self: string
    timeZone: string
}
