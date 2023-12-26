import { useParams, useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { queryGetTasksTracking } from '../model/queryOption'
import TaskTracking from './TaskTracking'

export const TasksTracking = () => {
    // const params = useParams<{ boardId: string }>()
    // const [searchParams, setSearchParams] = useSearchParams()
    //
    // const { data } = useQuery(queryGetTasksTracking(params.boardId!, searchParams.get('keysTaskTracking')!))
    //
    // return data?.issues.map(({ fields, id }) => (
    //     <TaskTracking
    //         key={id}
    //         id={id}
    //         fields={fields}
    //         setSearchParams={setSearchParams}
    //     />
    // ))
}
