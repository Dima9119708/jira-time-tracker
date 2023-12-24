import { useInfiniteQuery } from '@tanstack/react-query'
import { queryGetTasks } from '../model/queryOptions'
import { Title } from '@mantine/core'
import LoadMore from './LoadMore'
import Task from '../../Tasks/ui/Task'
import { useSearchParams } from 'react-router-dom'

const FiltersPage = () => {
    const [, setSearchParams] = useSearchParams()
    const { data } = useInfiniteQuery(queryGetTasks(''))

    return (
        <>
            <Title
                mb={10}
                order={2}
            >
                Tasks
            </Title>

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

            <LoadMore />
        </>
    )
}

export default FiltersPage
