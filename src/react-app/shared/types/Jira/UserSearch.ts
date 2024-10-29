import { AvatarUrls } from 'react-app/shared/types/Jira/CommonTypes'

export type User = {
    accountId: string
    accountType: string
    active: boolean
    avatarUrls: AvatarUrls
    displayName: string
    key: string
    name: string
    self: string
}
