import { Badge, Card as Mantine_Card, Group, Title } from '@mantine/core'
import { TaskProps, TasksResponse } from '../types/types'
import { memo } from 'react'
import { IconPlayerPauseFilled } from '@tabler/icons-react'
import { useQueryClient } from '@tanstack/react-query'
import TaskTimer from './TaskTimer'
import StatusTask from './StatusTask'
import { useWorklogQuery } from '../lib/useWorklogQuery'
import { secondsToUIFormat } from '../lib/dateHelper'

const TaskTracking = (props: TaskProps) => {
    const { fields, id, setSearchParams } = props
    const queryClient = useQueryClient()

    const onPlayTracking = () => {
        setSearchParams((prev) => {
            const numbers = prev
                .get('keysTaskTracking')!
                .split(',')
                .map((item) => {
                    return parseInt(item, 10)
                })

            const indexToRemove = numbers.indexOf(Number(id))

            if (indexToRemove !== -1) {
                numbers.splice(indexToRemove, 1)
            }

            const resultString = numbers.join(',')

            queryClient.setQueryData(['tracking tasks'], (old: TasksResponse): TasksResponse => {
                return {
                    ...old,
                    issues: old.issues.filter((issue) => issue.id !== id),
                }
            })

            queryClient.setQueryData(['tasks'], (old: TasksResponse): TasksResponse => {
                return {
                    ...old,
                    issues: [props, ...old.issues],
                }
            })

            return {
                keysTaskTracking: resultString,
            }
        })
    }

    useWorklogQuery({
        taskId: id,
    })

    return (
        <Mantine_Card
            key={id}
            shadow="sm"
            radius="md"
            bg="cyan.1"
            mb="sm"
            withBorder
        >
            <TaskTimer />
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
                    queryKey="tracking tasks"
                />

                <IconPlayerPauseFilled
                    onClick={onPlayTracking}
                    className="cursor-pointer [&_path]:fill-[var(--mantine-color-violet-5)]"
                />
            </Group>
        </Mantine_Card>
    )
}

export default memo(TaskTracking)
