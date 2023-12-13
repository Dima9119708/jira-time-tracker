import { Badge, Button, Card as Mantine_Card, Group, Title } from '@mantine/core'
import { TaskProps, TasksResponse } from '../types/types'
import React, { memo } from 'react'
import { IconPlayerPlayFilled } from '@tabler/icons-react'
import { useQueryClient } from '@tanstack/react-query'
import { secondsToUIFormat } from '../lib/dateHelper'
import { ChangeStatusTask } from '../../../features/changeStatusTask'

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

            return { keysTaskTracking: string }
        })

        const oldState = queryClient.getQueryData<TasksResponse>(['tasks'])

        const task = oldState!.issues.find((issue) => issue.id === id)!

        queryClient.setQueryData(['tracking tasks'], (old: TasksResponse): TasksResponse => {
            return {
                ...old,
                issues: [task, ...(old ? old.issues : [])],
            }
        })

        queryClient.setQueryData(['tasks'], (old: TasksResponse): TasksResponse => {
            return {
                ...old,
                issues: (old ? old.issues : []).filter((issue) => issue.id !== task.id),
            }
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
                <ChangeStatusTask
                    id={id}
                    queryKey="tasks"
                >
                    <Button
                        variant="outline"
                        size="xs"
                    >
                        {fields.status.name}
                    </Button>
                </ChangeStatusTask>

                <ChangeStatusTask
                    id={id}
                    queryKey="tasks"
                    position="left"
                    onChange={() => onPlayTracking()}
                    disabled={fields.status.statusCategory.key === 'indeterminate'}
                >
                    <IconPlayerPlayFilled
                        className="cursor-pointer [&_path]:fill-[var(--mantine-color-violet-5)]"
                        {...(fields.status.statusCategory.key === 'indeterminate' && { onClick: onPlayTracking })}
                    />
                </ChangeStatusTask>
            </Group>
        </Mantine_Card>
    )
}

export default memo(Task)
