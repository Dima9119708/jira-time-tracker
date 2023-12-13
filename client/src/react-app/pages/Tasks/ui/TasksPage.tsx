import { Title } from '@mantine/core'
import { useBreadcrumbs } from '../../../shared/ui/Breadcrumbs'
import Tasks from './Tasks'
import { TasksTracking } from './TasksTracking'

const TasksPage = () => {
    useBreadcrumbs({
        items: [
            {
                link: '/projects',
                title: 'Projects',
            },
        ],
    })

    return (
        <>
            <Title
                mb={10}
                order={2}
            >
                Tasks
            </Title>

            <TasksTracking />

            <Tasks />
        </>
    )
}

export default TasksPage
