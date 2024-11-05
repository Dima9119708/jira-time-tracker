export enum EnumReasonLoading {
    'add' = 'add',
    'remove' = 'remove',
    'edit' = 'edit',
    'choose' = 'choose',
    'removeFromAllGroups' = 'removeFromAllGroups',
    'empty' = '',
}

export interface FavoriteIssueProps {
    issueId: string
}

export interface FavoriteItemProps extends FavoriteIssueProps {
    name: string
    isGroup: boolean
}
