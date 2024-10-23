import { WorklogComment } from 'react-app/pages/Issues/types/types'

export const worklogCommentTemplate = (text: string): WorklogComment => ({
    comment: {
        type: 'doc',
        version: 1,
        content: [
            {
                type: 'paragraph',
                content: [
                    {
                        type: 'text',
                        text: text,
                    },
                ],
            },
        ],
    },
})
export const getWorklogComment = (worklog: WorklogComment): string => {
    return worklog.comment?.content?.[0]?.content[0]?.text || ''
}
