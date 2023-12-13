import { Badge, Card as Mantine_Card, Group, Title } from '@mantine/core'
import { TaskProps, TasksResponse } from '../types/types'
import { memo } from 'react'
import { IconPlayerPlayFilled } from '@tabler/icons-react'
import { useQueryClient } from '@tanstack/react-query'
import StatusTask from './StatusTask'
import { secondsToUIFormat } from '../lib/dateHelper'

const Task = (props: TaskProps) => {
    const { fields, id, setSearchParams } = props
    const queryClient = useQueryClient()

    const onPlayTracking = () => {
        setSearchParams((prev) => {
            let string = id

            for (const value of prev.values()) {
                if (value) {
                    string += `,${value}`
                }
            }

            queryClient.setQueryData(['tracking tasks'], (old: TasksResponse): TasksResponse => {
                return {
                    ...old,
                    issues: [props, ...(old ? old.issues : [])],
                }
            })

            queryClient.setQueryData(['tasks'], (old: TasksResponse): TasksResponse => {
                return {
                    ...old,
                    issues: (old ? old.issues : []).filter((issue) => issue.id !== props.id),
                }
            })

            return { keysTaskTracking: string }
        })
    }

    return (
        <Mantine_Card
            key={id}
            shadow="sm"
            radius="md"
            mb="sm"
            withBorder
        >
            <Group
                mb={10}
                justify="space-between"
            >
                <Title order={5}>{fields.summary}</Title>

                <Badge
                    color="blue"
                    className="flex-row"
                >
                    <span className="mr-[0.5rem]">{secondsToUIFormat(fields.timespent)}</span>
                    <span className="mr-[0.5rem]">/</span>
                    <span>{secondsToUIFormat(fields.timeoriginalestimate)}</span>
                </Badge>
            </Group>

            <Group justify="space-between">
                <StatusTask
                    id={id}
                    name={fields.status.name}
                    queryKey="tasks"
                />

                <IconPlayerPlayFilled
                    onClick={onPlayTracking}
                    className="cursor-pointer [&_path]:fill-[var(--mantine-color-violet-5)]"
                />
            </Group>
        </Mantine_Card>
    )
}

export default memo(Task)
