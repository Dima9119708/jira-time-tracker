import { useInfiniteQuery } from '@tanstack/react-query'
import { queryGetTasks } from '../model/queryOptions'
import Task from './Task'
import { useEffect } from 'react'
import { notifications } from '@mantine/notifications'
import { NOTIFICATION_VARIANT } from '../../../shared/const/notification-variant'

const Tasks = () => {
    const { data, error } = useInfiniteQuery(queryGetTasks())

    useEffect(() => {
        if (error) {
            notifications.show({
                title: `Error loading task`,
                message: error.response?.data.errorMessages.join(', '),
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

export default Tasks
