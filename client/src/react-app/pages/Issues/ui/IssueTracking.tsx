import { ActionIcon, Alert, Badge, Button, Card as Mantine_Card, Group, Image, Loader, Title } from '@mantine/core'
import React, { memo, useState } from 'react'
import { IconAlertTriangle, IconArrowBigDownFilled, IconPlayerPauseFilled } from '@tabler/icons-react'
import { useQueryClient } from '@tanstack/react-query'
import { secondsToUIFormat } from '../lib/dateHelper'
import { ChangeStatusIssue } from '../../../features/ChangeStatusIssue'
import { Timer } from '../../../features/Timer'
import { TaskProps, IssuesTrackingResponse } from '../types/types'
import { produce } from 'immer'
import { useGlobalState } from '../../../shared/lib/hooks/useGlobalState'
import { useWorklogQuery } from '../lib/useWorklogQuery'
import ChangeAssigneeIssue from '../../../features/ChangeAssigneeIssue/ui/ChangeAssigneeIssue'

const IssueTracking = (props: TaskProps) => {
    const { fields, id, idxIssue, issueKey } = props
    const queryClient = useQueryClient()
    const [isLoading, setLoading] = useState(false)

    useWorklogQuery({
        taskId: id,
    })

    const onStopTracking = async () => {
        useGlobalState.getState().changeIssueIdsSearchParams('delete', id)

        setLoading(true)

        await queryClient.invalidateQueries({ queryKey: ['tasks'] })

        setLoading(false)

        queryClient.setQueryData(['tasks tracking'], (old: IssuesTrackingResponse): IssuesTrackingResponse => {
            return produce(old, (draft) => {
                const idx = draft.findIndex((a) => a.id === id)
                draft.splice(idx, 1)
            })
        })
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

            <Group mb={10}>
                <Badge
                    size="md"
                    variant="light"
                    leftSection={
                        <Image
                            height={18}
                            width={18}
                            loading="lazy"
                            className="rounded"
                            src={fields.project.avatarUrls['32x32']}
                        />
                    }
                >
                    Project: {fields.project.name}
                </Badge>
                <Badge
                    variant="light"
                    leftSection={
                        <Image
                            height={18}
                            width={18}
                            loading="lazy"
                            className="rounded"
                            src={fields.priority.iconUrl}
                        />
                    }
                >
                    priority: {fields.priority.name}
                </Badge>
                <Badge variant="light">key: {issueKey}</Badge>
            </Group>

            <Group justify="space-between">
                <Group>
                    <ChangeStatusIssue
                        issueId={id}
                        issueName={fields.summary}
                        status={fields.status}
                        idxIssue={idxIssue}
                        queryKey="tasks tracking"
                    >
                        <Button
                            variant="outline"
                            size="xs"
                        >
                            {fields.status.name}
                        </Button>
                    </ChangeStatusIssue>

                    <ChangeAssigneeIssue
                        assignee={fields.assignee}
                        issueName={fields.summary}
                        issueKey={issueKey}
                        idxIssue={idxIssue}
                        queryKey="tasks tracking"
                    >
                        {({ name, ImageComponent }) => (
                            <Button
                                variant="outline"
                                size="xs"
                                leftSection={ImageComponent}
                            >
                                {name}
                            </Button>
                        )}
                    </ChangeAssigneeIssue>
                </Group>

                {isLoading ? (
                    <Loader size="sm" />
                ) : (
                    <ActionIcon
                        variant="light"
                        onClick={onStopTracking}
                    >
                        <IconPlayerPauseFilled className="cursor-pointer [&_path]:fill-[var(--mantine-color-violet-5)]" />
                    </ActionIcon>
                )}
            </Group>
        </Mantine_Card>
    )
}

export default memo(IssueTracking)
