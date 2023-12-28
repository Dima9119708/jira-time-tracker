import { ActionIcon, Alert, Badge, Button, Card as Mantine_Card, Group, Loader, Title } from '@mantine/core'
import React, { memo, useState } from 'react'
import { IconAlertTriangle, IconPlayerPauseFilled } from '@tabler/icons-react'
import { useQueryClient } from '@tanstack/react-query'
import { secondsToUIFormat } from '../lib/dateHelper'
import { ChangeStatusTask } from '../../../features/ChangeStatusTask'
import { Timer } from '../../../features/Timer'
import { TaskProps, TasksTrackingResponse } from '../types/types'
import { produce } from 'immer'
import { useGlobalState } from '../../../shared/lib/hooks/useGlobalState'
import { useWorklogQuery } from '../lib/useWorklogQuery'

const TaskTracking = (props: TaskProps) => {
    const { fields, id, idxIssue } = props
    const queryClient = useQueryClient()
    const [isLoading, setLoading] = useState(false)

    useWorklogQuery({
        taskId: id,
    })

    const onPlayTracking = async () => {
        useGlobalState.getState().changeIssueIdsSearchParams('delete', id)

        setLoading(true)

        await queryClient.cancelQueries({ queryKey: ['tasks'] })
        await queryClient.invalidateQueries({ queryKey: ['tasks'] })

        queryClient.setQueryData(['tasks tracking'], (old: TasksTrackingResponse): TasksTrackingResponse => {
            return produce(old, (draft) => {
                draft.splice(idxIssue, 1)
            })
        })

        setLoading(false)
    }

    return (
        <Mantine_Card
            key={id}
            shadow="sm"
            radius="md"
            bg="teal.0"
            mb="sm"
            withBorder
        >
            <Timer />
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
                    idxIssue={idxIssue}
                    queryKey="tasks tracking"
                >
                    <Button
                        variant="outline"
                        size="xs"
                    >
                        {fields.status.name}
                    </Button>
                </ChangeStatusTask>

                {isLoading ? (
                    <Loader size="sm" />
                ) : (
                    <ActionIcon variant="light">
                        <IconPlayerPauseFilled
                            onClick={onPlayTracking}
                            className="cursor-pointer [&_path]:fill-[var(--mantine-color-violet-5)]"
                        />
                    </ActionIcon>
                )}
            </Group>
        </Mantine_Card>
    )
}

export default memo(TaskTracking)
