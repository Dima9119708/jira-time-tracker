import { RendererProps } from '@atlaskit/renderer'

export interface CommentProps {
    className?: string
    document: RendererProps['document']
    created: string
    displayName: string
    avatarUrl: string
}

export interface CommentsResponse {
    comments: Array<{
        author: {
            avatarUrls: {
                '16x16': string
                '24x24': string
                '32x32': string
                '48x48': string
            }
            displayName: string
            accountId: string
        }
        body: RendererProps['document']
        created: string
        id: string
    }>
    maxResults: number
    startAt: number
    total: number
}

export type Comment = CommentsResponse['comments'][number]
