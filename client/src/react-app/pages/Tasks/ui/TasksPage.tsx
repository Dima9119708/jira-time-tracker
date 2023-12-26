import { useInfiniteQuery } from '@tanstack/react-query'
import { queryGetTasks } from '../model/queryOptions'
import { Title } from '@mantine/core'
import LoadMore from './LoadMore'
import Task from '../../TasksDepracated/ui/Task'
import { useLoaderData, useSearchParams } from 'react-router-dom'
import { Filter } from '../../../features/jqlEditor'

const TasksPage = () => {
    const JQLString = useLoaderData() as string
    const [, setSearchParams] = useSearchParams()

    const { data } = useInfiniteQuery(queryGetTasks(JQLString))

    return (
        <>
            <Title
                mb={10}
                order={2}
            >
                Tasks
            </Title>

            <Filter
                query={JQLString}
                onSearch={() => {}}
            />

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

export default TasksPage
