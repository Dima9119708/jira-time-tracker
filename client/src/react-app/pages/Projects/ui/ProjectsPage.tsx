import { useQuery } from '@tanstack/react-query'
import { axiosInstance } from '../../../shared/config/api/api'
import { Projects } from '../types/types'
import { Badge, Button, Card, Group, Image, Text } from '@mantine/core'
import { AxiosResponse } from 'axios'

const ProjectsPage = () => {
    const { data = [], isFetching } = useQuery({
        queryKey: ['projects'],
        queryFn: () => axiosInstance.get<Projects[]>('/projects'),
        select: (data) => data.data,
    })

    return (
        <>
            {data.map(({ avatarUrls, id, name }) => (
                <Card
                    key={id}
                    className="flex"
                    shadow="sm"
                    padding="lg"
                    radius="md"
                    withBorder
                >
                    <Image
                        src={avatarUrls['48x48']}
                        h={120}
                        w={120}
                        alt="Norway"
                    />

                    <Group
                        justify="space-between"
                        mt="md"
                        mb="xs"
                    >
                        <Text fw={500}>{name}</Text>
                        <Badge
                            color="pink"
                            variant="light"
                        >
                            On Sale
                        </Badge>
                    </Group>

                    <Text
                        size="sm"
                        c="dimmed"
                    >
                        With Fjord Tours you can explore more of the magical fjord landscapes with tours and activities on and around the
                        fjords of Norway
                    </Text>

                    <Button
                        variant="light"
                        color="blue"
                        fullWidth
                        mt="md"
                        radius="md"
                    >
                        Book classic tour now
                    </Button>
                </Card>
            ))}
        </>
    )
}

export default ProjectsPage
