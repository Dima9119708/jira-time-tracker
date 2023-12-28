import { useQuery } from '@tanstack/react-query'
import { queryGetTasksTracking } from '../model/queryOptions'
import { useSearchParams } from 'react-router-dom'
import TaskTracking from './TaskTracking'

const TasksTracking = () => {
    const { data } = useQuery(queryGetTasksTracking())

    return (
        <>
            {data?.map((task, idxIssue) => (
                <TaskTracking
                    key={task.id}
                    idxIssue={idxIssue}
                    fields={task.fields}
                    id={task.id}
                />
            ))}
        </>
    )
}

export default TasksTracking
