import { useQuery } from '@tanstack/react-query'
import { useParams, useSearchParams } from 'react-router-dom'
import { queryGetTasks } from '../model/queryOption'
import Task from './Task'

const Tasks = () => {
    // const params = useParams<{ projectId: string; boardId: string }>()
    // const [searchParams, setSearchParams] = useSearchParams()
    //
    // const { data } = useQuery(queryGetTasks(params.boardId!, searchParams.get('keysTaskTracking')!))
    //
    // return data?.issues.map(({ fields, id }) => (
    //     <Task
    //         key={id}
    //         id={id}
    //         fields={fields}
    //         setSearchParams={setSearchParams}
    //     />
    // ))
}

export default Tasks
