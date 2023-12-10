import { useQuery } from '@tanstack/react-query'
import { queryGetBoards } from '../model/queryOptions'
import { useNavigate, useParams } from 'react-router-dom'
import { Text, Title } from '@mantine/core'
import { Card as Mantine_Card } from '@mantine/core'
import { useBreadcrumbs } from '../../../shared/ui/Breadcrumbs'

const BoardsPage = () => {
    const params = useParams<{ projectId: string }>()
    const navigate = useNavigate()

    const { data = { values: [] } } = useQuery(queryGetBoards(params.projectId!))

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
                Boards
            </Title>
            {data.values.map(({ id, name }) => (
                <Mantine_Card
                    key={id}
                    className="flex flex-row items-center cursor-pointer"
                    shadow="sm"
                    radius="md"
                    mb="sm"
                    withBorder
                    h={60}
                    onClick={() => navigate(`/tasks/${params.projectId}/${id}`)}
                >
                    <Text
                        fw={500}
                        fz="sm"
                    >
                        {name}
                    </Text>
                </Mantine_Card>
            ))}
        </>
    )
}

export default BoardsPage
