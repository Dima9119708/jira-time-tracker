import { Alert, Badge, Button, Card as Mantine_Card, Group, Popover, Title, Text } from '@mantine/core'
import { TaskProps, TasksResponse } from '../types/types'
import React, { memo } from 'react'
import { IconAlertTriangle, IconInfoCircle, IconPlayerPauseFilled } from '@tabler/icons-react'
import { useQueryClient } from '@tanstack/react-query'
import TaskTimer from './TaskTimer'
import { secondsToUIFormat } from '../lib/dateHelper'
import { ChangeStatusTask } from '../../../features/changeStatusTask'

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

    // useWorklogQuery({
    //     taskId: id,
    // })

    return (
        <Mantine_Card
            key={id}
            shadow="sm"
            radius="md"
            bg="teal.0"
            mb="sm"
            withBorder
        >
            <TaskTimer />
            <Group
                mb={10}
                justify="space-between"
            >
                {fields.status.statusCategory.key !== 'indeterminate' && (
                    <Alert
                        className="w-[100%]"
                        variant="light"
                        color="red"
                        title={'Warning!'}
                        icon={<IconAlertTriangle />}
                    >
                        This task is not in the "In progress" status please change its status. However, time continues to be logged for it.
                    </Alert>
                )}
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
                <ChangeStatusTask
                    id={id}
                    queryKey="tracking tasks"
                >
                    <Button
                        variant="outline"
                        size="xs"
                    >
                        {fields.status.name}
                    </Button>
                </ChangeStatusTask>

                <IconPlayerPauseFilled
                    onClick={onPlayTracking}
                    className="cursor-pointer [&_path]:fill-[var(--mantine-color-violet-5)]"
                />
            </Group>
        </Mantine_Card>
    )
}

export default memo(TaskTracking)
