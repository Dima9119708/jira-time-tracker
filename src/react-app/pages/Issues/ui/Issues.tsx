import { useInfiniteQuery } from '@tanstack/react-query'
import Issue from './Issue'
import { useEffect } from 'react'
import { useNotifications } from 'react-app/shared/lib/hooks/useNotifications'
import { queryGetIssues } from 'react-app/entities/Issues'
import { useGlobalState } from 'react-app/shared/lib/hooks/useGlobalState'

const Issues = () => {
    const { data, error } = useInfiniteQuery(queryGetIssues({
        jql: useGlobalState.getState().jql,
        onFilteringIssues: (data) => {
            const tasksIDS = useGlobalState.getState().getIssueIdsSearchParams()

            return {
                ...data,
                issues: data.issues.filter((issue) => !tasksIDS.includes(issue.id))
            }
        }
    }))

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
