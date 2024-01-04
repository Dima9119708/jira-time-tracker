import { Badge, Button, Card as Mantine_Card, Group, Image, Title } from '@mantine/core'
import React, { memo } from 'react'
import { IconPlayerPlayFilled, IconUser, IconUserSquare } from '@tabler/icons-react'
import { useQueryClient, InfiniteData } from '@tanstack/react-query'
import { secondsToUIFormat } from '../lib/dateHelper'
import { ChangeStatusIssue } from '../../../features/ChangeStatusIssue'
import { produce } from 'immer'
import { TaskProps, IssueResponse, IssuesTrackingResponse } from '../types/types'
import { useGlobalState } from '../../../shared/lib/hooks/useGlobalState'
import ChangeAssigneeIssue from '../../../features/ChangeAssigneeIssue/ui/ChangeAssigneeIssue'

const Issue = (props: TaskProps) => {
    const { fields, id, idxPage, idxIssue, issueKey } = props
    const queryClient = useQueryClient()

    const onPlayTracking = () => {
        useGlobalState.getState().changeIssueIdsSearchParams('add', id)

        queryClient.setQueryData(['tasks tracking'], (old: IssuesTrackingResponse): IssuesTrackingResponse => {
            const tasks = queryClient.getQueryData<InfiniteData<IssueResponse>>(['tasks'])

            return produce(old, (draft) => {
                if (tasks) {
                    draft.unshift(tasks.pages[idxPage!].issues[idxIssue])
                }
            })
        })

        queryClient.setQueryData(['tasks'], (old: InfiniteData<IssueResponse>): InfiniteData<IssueResponse> => {
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
                    </ChangeStatusIssue>

                    <ChangeAssigneeIssue
                        assignee={fields.assignee}
                        issueName={fields.summary}
                        issueKey={issueKey}
                        idxPage={idxPage}
                        idxIssue={idxIssue}
                        queryKey="tasks"
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

                <ChangeStatusIssue
                    issueId={id}
                    issueName={fields.summary}
                    status={fields.status}
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
                </ChangeStatusIssue>
            </Group>
        </Mantine_Card>
    )
}

export default memo(Issue)
