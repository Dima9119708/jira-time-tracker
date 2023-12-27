import { useInfiniteQuery } from '@tanstack/react-query'
import { queryGetTasks } from '../model/queryOptions'
import { useSearchParams } from 'react-router-dom'
import Task from './Task'

const TasksTracking = () => {
    const [, setSearchParams] = useSearchParams()

    const { data } = useInfiniteQuery(queryGetTasks())

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
                        setSearchParams={setSearchParams}
                    />
                ))
            )}
        </>
    )
}

export default TasksTracking
