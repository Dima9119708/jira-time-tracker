import React, { memo } from 'react'
import { useQueryClient, InfiniteData } from '@tanstack/react-query'
import { secondsToUIFormat } from '../lib/dateHelper'
import { ChangeStatusIssue } from '../../../features/ChangeStatusIssue'
import { produce } from 'immer'
import { TaskProps, IssueResponse, IssuesTrackingResponse } from '../types/types'
import { useGlobalState } from '../../../shared/lib/hooks/useGlobalState'
import ChangeAssigneeIssue from '../../../features/ChangeAssigneeIssue/ui/ChangeAssigneeIssue'
import { Box, Flex, xcss, Text } from '@atlaskit/primitives'
import Heading from '@atlaskit/heading'
import Badge from '@atlaskit/badge'
import Image from '@atlaskit/image'
import { IconButton } from '@atlaskit/button/new'
import VidPlayIcon from '@atlaskit/icon/glyph/vid-play'

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
        <Box
            xcss={xcss({
                display: 'flex',
                flexDirection: 'column',
                rowGap: 'space.200',
                padding: 'space.200',
                borderRadius: 'border.radius.200',
                boxShadow: 'elevation.shadow.overflow',
                backgroundColor: 'color.background.input',
                marginBottom: 'space.250',
            })}
        >
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
                    <Flex xcss={xcss({ padding: 'space.050', textTransform: 'uppercase', alignItems: 'center', columnGap: 'space.075' })}>
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
                    <Flex xcss={xcss({ padding: 'space.050', textTransform: 'uppercase', columnGap: 'space.075', alignItems: 'center' })}>
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
                    <Flex xcss={xcss({ padding: 'space.050', textTransform: 'uppercase', columnGap: 'space.075', alignItems: 'center' })}>
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
                columnGap="space.100"
            >
                <Flex columnGap="space.200">
                    <ChangeStatusIssue
                        issueId={id}
                        issueName={fields.summary}
                        status={fields.status}
                        idxPage={idxPage}
                        idxIssue={idxIssue}
                        queryKey="tasks"
                        trigger={fields.status.name}
                    />

                    <ChangeAssigneeIssue
                        assignee={fields.assignee}
                        issueName={fields.summary}
                        issueKey={issueKey}
                        idxPage={idxPage}
                        idxIssue={idxIssue}
                        queryKey="tasks"
                    />
                </Flex>

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
                    trigger={(triggerButtonProps) => (
                        <IconButton
                            {...triggerButtonProps}
                            ref={triggerButtonProps.triggerRef}
                            icon={VidPlayIcon}
                            label="Play"
                            {...(fields.status.statusCategory.key === 'indeterminate' && { onClick: onPlayTracking })}
                        />
                    )}
                />
            </Flex>
        </Box>
    )
}

export default memo(Issue)
