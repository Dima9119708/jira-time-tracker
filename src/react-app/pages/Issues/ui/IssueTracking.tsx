import React, { memo, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { secondsToUIFormat } from '../../../shared/lib/helpers/secondsToUIFormat'
import { ChangeStatusIssue } from '../../../features/ChangeStatusIssue'
import { IssueProps } from '../types/types'
import { produce } from 'immer'
import { useGlobalState } from '../../../shared/lib/hooks/useGlobalState'
import ChangeAssigneeIssue from '../../../features/ChangeAssigneeIssue/ui/ChangeAssigneeIssue'
import { IconButton } from '@atlaskit/button/new'
import VidPauseIcon from '@atlaskit/icon/glyph/vid-pause'
import { Box, Flex, xcss } from '@atlaskit/primitives'
import SectionMessage from '@atlaskit/section-message'
import { LogTimeButton, LogTimeDialog } from 'react-app/features/LogTime'
import { WatchController } from 'use-global-boolean'
import { ModalTransition } from '@atlaskit/modal-dialog'
import { LogTimeAuto } from 'react-app/features/LogTimeAuto'
import { CardIssueDetailsBadges, CardIssueHeader, CardIssue } from 'react-app/entities/Issues'
import { IssueResponse } from 'react-app/shared/types/Jira/Issues'

const IssueTracking = (props: IssueProps) => {
    const { fields, id, idxIssue, issueKey, isLast } = props
    const queryClient = useQueryClient()
    const [isLoading, setLoading] = useState(false)

    const uniqueNameBoolean = `log time issue tracking ${id}`

    const onStopTracking = async () => {
        setLoading(true)

        await useGlobalState.getState().changeIssueIdsSearchParams('delete', id)

        await queryClient.invalidateQueries({ queryKey: ['tasks'] })

        queryClient.setQueryData(['tasks tracking'], (old: IssueResponse['issues']): IssueResponse['issues'] => {
            return produce(old, (draft) => {
                const idx = draft.findIndex((a) => a.id === id)
                draft.splice(idx, 1)
            })
        })

        setLoading(false)
    }

    return (
        <>
            <CardIssue
                active
                isLast={isLast}
            >
                <LogTimeAuto issueId={id} />

                {!isLoading && fields.status.statusCategory.key !== 'indeterminate' && (
                    <SectionMessage
                        title={`Warning!`}
                        appearance="warning"
                    >
                        This task is not in the "In progress" status please change its status. However, time continues to be logged for it.
                    </SectionMessage>
                )}

                <CardIssueHeader
                    summary={fields.summary}
                    timeoriginalestimate={secondsToUIFormat(fields.timeoriginalestimate)}
                    timespent={secondsToUIFormat(fields.timespent)}
                />

                <CardIssueDetailsBadges
                    issueKey={issueKey}
                    created={fields.created}
                    issueTypeIconUrl={fields.issuetype.iconUrl}
                    issueTypeName={fields.issuetype.name}
                    projectName={fields.project.name}
                    priorityIconUrl={fields.priority.iconUrl}
                    avatarUrl={fields.project.avatarUrls['32x32']}
                    priorityName={fields.priority.name}
                />

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

                        <LogTimeButton
                            uniqueNameBoolean={uniqueNameBoolean}
                            issueId={id}
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
            </CardIssue>

            <WatchController name={uniqueNameBoolean}>
                {({ localState }) => {
                    const [open] = localState

                    return (
                        <ModalTransition>
                            {open && (
                                <LogTimeDialog
                                    uniqueNameBoolean={uniqueNameBoolean}
                                    issueId={id}
                                    queryKey="tasks tracking"
                                />
                            )}
                        </ModalTransition>
                    )
                }}
            </WatchController>

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
