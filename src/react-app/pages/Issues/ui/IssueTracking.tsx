import React, { memo, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { secondsToUIFormat } from '../lib/dateHelper'
import { ChangeStatusIssue } from '../../../features/ChangeStatusIssue'
import { Timer } from '../../../features/Timer'
import { TaskProps, IssuesTrackingResponse } from '../types/types'
import { produce } from 'immer'
import { useGlobalState } from '../../../shared/lib/hooks/useGlobalState'
import { useWorklogQuery } from '../lib/useWorklogQuery'
import ChangeAssigneeIssue from '../../../features/ChangeAssigneeIssue/ui/ChangeAssigneeIssue'
import { IconButton } from '@atlaskit/button/new'
import VidPauseIcon from '@atlaskit/icon/glyph/vid-pause'
import { Box, Flex, Text, xcss } from '@atlaskit/primitives'
import Badge from '@atlaskit/badge'
import Heading from '@atlaskit/heading'
import SectionMessage from '@atlaskit/section-message'
import Image from '@atlaskit/image'

const IssueTracking = (props: TaskProps) => {
    const { fields, id, idxIssue, issueKey } = props
    const queryClient = useQueryClient()
    const [isLoading, setLoading] = useState(false)

    const timerRef = useWorklogQuery({
        taskId: id,
    })

    const onStopTracking = async () => {
        setLoading(true)

        await useGlobalState.getState().changeIssueIdsSearchParams('delete', id)

        await queryClient.invalidateQueries({ queryKey: ['tasks'] })

        queryClient.setQueryData(['tasks tracking'], (old: IssuesTrackingResponse): IssuesTrackingResponse => {
            return produce(old, (draft) => {
                const idx = draft.findIndex((a) => a.id === id)
                draft.splice(idx, 1)
            })
        })

        setLoading(false)
    }

    return (
        <>
            <Box
                xcss={xcss({
                    display: 'flex',
                    flexDirection: 'column',
                    rowGap: 'space.200',
                    padding: 'space.200',
                    borderRadius: 'border.radius.200',
                    boxShadow: 'elevation.shadow.overflow',
                    backgroundColor: 'color.background.accent.blue.subtlest',
                })}
            >
                <Timer ref={timerRef} />

                {!isLoading && fields.status.statusCategory.key !== 'indeterminate' && (
                    <SectionMessage
                        title={`Warning!`}
                        appearance="warning"
                    >
                        This task is not in the "In progress" status please change its status. However, time continues to be logged for it.
                    </SectionMessage>
                )}

                <Flex justifyContent="space-between">
                    <Heading size="medium">{fields.summary}</Heading>

                    <Badge appearance="primary">
                        <Box
                            as="span"
                            xcss={xcss({ padding: 'space.050' })}
                        >
                            <Box
                                as="span"
                                xcss={xcss({ marginRight: 'space.075' })}
                            >
                                <Text weight="bold">{secondsToUIFormat(fields.timespent)}</Text>
                            </Box>
                            <Box
                                as="span"
                                xcss={xcss({ marginRight: 'space.075' })}
                            >
                                <Text weight="bold">/</Text>
                            </Box>
                            <Box as="span">
                                <Text weight="bold">{secondsToUIFormat(fields.timeoriginalestimate)}</Text>
                            </Box>
                        </Box>
                    </Badge>
                </Flex>

                <Flex
                    gap="space.100"
                    alignItems="center"
                    wrap="wrap"
                >
                    <Badge appearance="default">
                        <Flex
                            xcss={xcss({ padding: 'space.050', textTransform: 'uppercase', alignItems: 'center', columnGap: 'space.075' })}
                        >
                            <Image
                                src={fields.project.avatarUrls['32x32']}
                                height="15px"
                                width="15px"
                            />
                            <Text
                                weight="bold"
                                size="small"
                            >
                                Project: {fields.project.name}
                            </Text>
                        </Flex>
                    </Badge>

                    <Badge appearance="default">
                        <Flex
                            xcss={xcss({ padding: 'space.050', textTransform: 'uppercase', columnGap: 'space.075', alignItems: 'center' })}
                        >
                            <Image
                                src={fields.priority.iconUrl}
                                height="15px"
                                width="15px"
                            />
                            <Text
                                weight="bold"
                                size="small"
                            >
                                priority: {fields.priority.name}
                            </Text>
                        </Flex>
                    </Badge>

                    <Badge appearance="default">
                        <Flex
                            xcss={xcss({ padding: 'space.050', textTransform: 'uppercase', columnGap: 'space.075', alignItems: 'center' })}
                        >
                            <Image
                                src={fields.issuetype.iconUrl}
                                height="15px"
                                width="15px"
                            />
                            <Text
                                weight="bold"
                                size="small"
                            >
                                {fields.issuetype.name} ({issueKey})
                            </Text>
                        </Flex>
                    </Badge>
                </Flex>

                <Flex
                    justifyContent="space-between"
                    alignItems="center"
                    columnGap="space.100"
                >
                    <Flex columnGap="space.200">
                        <ChangeStatusIssue
                            issueId={id}
                            issueName={fields.summary}
                            status={fields.status}
                            idxIssue={idxIssue}
                            queryKey="tasks tracking"
                            trigger={fields.status.name}
                        />

                        <ChangeAssigneeIssue
                            assignee={fields.assignee}
                            issueName={fields.summary}
                            issueKey={issueKey}
                            idxIssue={idxIssue}
                            queryKey="tasks tracking"
                        />
                    </Flex>

                    <ChangeStatusIssue
                        issueId={id}
                        issueName={fields.summary}
                        status={fields.status}
                        idxIssue={idxIssue}
                        queryKey="tasks tracking"
                        onChange={onStopTracking}
                        disabled={fields.status.statusCategory.key === 'done'}
                        trigger={(triggerButtonProps) => (
                            <IconButton
                                {...triggerButtonProps}
                                ref={triggerButtonProps.triggerRef}
                                isLoading={isLoading}
                                icon={VidPauseIcon}
                                label="Stop tracking"
                                {...(fields.status.statusCategory.key === 'done' && { onClick: onStopTracking })}
                            />
                        )}
                    />
                </Flex>
            </Box>

            <Box
                xcss={xcss({
                    height: '5px',
                    width: '100%',
                    backgroundColor: 'color.background.inverse.subtle.hovered',
                    marginTop: 'space.300',
                    marginBottom: 'space.300',
                    borderRadius: 'border.radius.200',
                })}
            />
        </>
    )
}

export default memo(IssueTracking)
