import { useInfiniteQuery } from '@tanstack/react-query'
import { queryGetIssues } from '../model/queryOptions'
import Task from './Issue'
import { useEffect } from 'react'
import { notifications } from '@mantine/notifications'
import { NOTIFICATION_VARIANT } from '../../../shared/const/notifications'

const Issues = () => {
    const { data, error } = useInfiniteQuery(queryGetIssues())

    useEffect(() => {
        if (error) {
            notifications.show({
                title: `Error loading task`,
                message: JSON.stringify(error.response?.data),
                ...NOTIFICATION_VARIANT.ERROR,
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
