import { Worklog } from 'react-app/shared/types/Jira/Worklogs'

export const worklogCommentTemplate = (text: string): Pick<Worklog, 'comment'> => ({
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
export const getWorklogComment = (worklog: Pick<Worklog, 'comment'>): string => {
    return worklog.comment?.content?.[0]?.content[0]?.text || ''
}
