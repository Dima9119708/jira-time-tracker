import { Badge, Button, Card as Mantine_Card, Group, Title } from '@mantine/core'
import React, { memo } from 'react'
import { IconPlayerPlayFilled } from '@tabler/icons-react'
import { useQueryClient, InfiniteData } from '@tanstack/react-query'
import { secondsToUIFormat } from '../lib/dateHelper'
import { ChangeStatusTask } from '../../../features/ChangeStatusTask'
import { produce } from 'immer'
import { TaskProps, TasksResponse } from '../types/types'
import { useGlobalState } from '../../../shared/lib/hooks/useGlobalState'

const Task = (props: TaskProps) => {
    const { fields, id, setSearchParams, idxPage, idxIssue } = props
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

        useGlobalState.getState().updateJQL()

        queryClient.setQueryData(['tasks tracking'], (old: TasksResponse): TasksResponse => {
            const tasks = queryClient.getQueryData<InfiniteData<TasksResponse>>(['tasks'])

            return produce(old, (draft) => {
                if (tasks) {
                    draft.issues.unshift(tasks.pages[idxPage!].issues[idxIssue])
                }
            })
        })

        queryClient.setQueryData(['tasks'], (old: InfiniteData<TasksResponse>): InfiniteData<TasksResponse> => {
            return produce(old, (draft) => {
                draft.pages[idxPage!].issues.splice(idxIssue, 1)
            })
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
                    idxPage={idxPage}
                    idxIssue={idxIssue}
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
                    idxPage={idxPage}
                    idxIssue={idxIssue}
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
