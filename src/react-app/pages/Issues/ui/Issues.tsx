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

    return data?.pages.map((page) =>
        page.issues.map((task) => (
            <Issue
                key={task.id}
                issueKey={task.key}
                fields={task.fields}
                id={task.id}
            />
        ))
    )
}

export default Issues
