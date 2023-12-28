import { Title } from '@mantine/core'
import LoadMore from './LoadMore'
import { Filter } from '../../../features/Filter'
import TasksTracking from './TasksTracking'
import Tasks from './Tasks'
import { useSearchParams } from 'react-router-dom'
import { useGlobalState } from '../../../shared/lib/hooks/useGlobalState'
import { useEffect } from 'react'

const TasksPage = () => {
    return (
        <>
            <Title
                mb={10}
                order={2}
            >
                Tasks
            </Title>

            <Filter />

            <TasksTracking />

            <Tasks />

            <LoadMore />
        </>
    )
}

export default TasksPage
