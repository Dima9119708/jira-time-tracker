import { useQuery } from '@tanstack/react-query'
import { queryGetBoardColumns } from '../model/queryOption'
import { useParams } from 'react-router-dom'
import { Tabs, Title } from '@mantine/core'
import { useBreadcrumbs } from '../../../shared/ui/Breadcrumbs'
import Tasks from './Tasks'

const TasksPage = () => {
    const params = useParams<{ projectId: string; boardId: string }>()

    const { data, isLoading } = useQuery(queryGetBoardColumns(params.boardId!))

    useBreadcrumbs({
        items: [
            {
                link: '/projects',
                title: 'Projects',
            },
            {
                link: `/boards/${params.projectId}`,
                title: 'Boards',
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

            {!isLoading && (
                <Tabs
                    variant="pills"
                    radius="md"
                    defaultValue={data?.defaultColumn}
                >
                    <Tabs.List mb={15}>
                        {data?.columns.map(({ name }) => (
                            <Tabs.Tab
                                key={name}
                                value={name}
                            >
                                {name}
                            </Tabs.Tab>
                        ))}
                    </Tabs.List>

                    {data?.columns.map(({ name }) => (
                        <Tabs.Panel
                            key={name}
                            value={name}
                        >
                            <Tasks columnName={name} />
                        </Tabs.Panel>
                    ))}
                </Tabs>
            )}
        </>
    )
}

export default TasksPage
