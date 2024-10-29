import { useInfiniteQuery } from '@tanstack/react-query'
import Issue from './Issue'
import { useEffect } from 'react'
import { useNotifications } from 'react-app/shared/lib/hooks/useNotifications'
import { queryGetIssues } from 'react-app/entities/Issues'

const Issues = () => {
    const { data, error } = useInfiniteQuery(queryGetIssues())

    const notify = useNotifications()

    useEffect(() => {
        if (error) {
            notify.error({
                title: `Error loading task`,
                description: JSON.stringify(error.response?.data),
            })
        }
    }, [error])

    return data?.pages.map((page, idxPage) =>
        page.issues.map((task, idxIssue) => (
            <Issue
                key={task.id}
                issueKey={task.key}
                idxPage={idxPage}
                idxIssue={idxIssue}
                fields={task.fields}
                id={task.id}
                isLast={idxPage + idxIssue === idxPage + (page.issues.length - 1)}
            />
        ))
    )
}

export default Issues
