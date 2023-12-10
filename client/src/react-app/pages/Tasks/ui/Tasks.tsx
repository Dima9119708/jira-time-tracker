import { useQuery } from '@tanstack/react-query'
import { axiosInstance } from '../../../shared/config/api/api'
import { useParams } from 'react-router-dom'
import { Card as Mantine_Card, Text, Title } from '@mantine/core'

interface TaskProps {
    columnName: string
}

interface Tasks {
    issues: Array<{
        id: string
        fields: {
            summary: string
            timespent: number
            timeoriginalestimate: number
        }
    }>
}

const Tasks = (props: TaskProps) => {
    const { columnName } = props
    const params = useParams<{ projectId: string; boardId: string }>()

    const { data } = useQuery({
        queryKey: ['tasks', columnName],
        queryFn: () => axiosInstance.get<Tasks>('/tasks', { params: { columnName, id: params.boardId } }),
        select: (data) => data.data,
    })

    return data?.issues.map(({ fields, id }) => (
        <Mantine_Card
            key={id}
            className="flex flex-row items-center cursor-pointer"
            shadow="sm"
            radius="md"
            mb="sm"
            withBorder
            onClick={() => {}}
        >
            <Title order={5}>{fields.summary}</Title>
        </Mantine_Card>
    ))
}

export default Tasks
