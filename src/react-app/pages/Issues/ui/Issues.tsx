import { useInfiniteQuery } from '@tanstack/react-query'
import { queryGetIssues } from '../model/queryOptions'
import Task from './Issue'
import { useEffect } from 'react'
import { useNotifications } from 'react-app/shared/lib/hooks/useNotifications'

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

    return (
        <>
            {data?.pages.map((page, idxPage) =>
                page.issues.map((task, idxIssue) => (
                    <Task
                        key={task.id}
                        issueKey={task.key}
                        idxPage={idxPage}
                        idxIssue={idxIssue}
                        fields={task.fields}
                        id={task.id}
                    />
                ))
            )}
        </>
    )
}

export default Issues
