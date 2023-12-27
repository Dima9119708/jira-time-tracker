import { Title } from '@mantine/core'
import LoadMore from './LoadMore'
import { Filter } from '../../../features/JQLEditor'
import TasksTracking from './TasksTracking'
import Tasks from './Tasks'

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
