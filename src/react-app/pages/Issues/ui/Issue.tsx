import React, { memo } from 'react'
import { useQueryClient, InfiniteData } from '@tanstack/react-query'
import { secondsToUIFormat } from '../../../shared/lib/helpers/secondsToUIFormat'
import { ChangeStatusIssue } from '../../../features/ChangeStatusIssue'
import { produce } from 'immer'
import { IssueProps } from '../types/types'
import { IssueResponse } from 'react-app/shared/types/Jira/Issues'
import { useGlobalState } from '../../../shared/lib/hooks/useGlobalState'
import ChangeAssigneeIssue from '../../../features/ChangeAssigneeIssue/ui/ChangeAssigneeIssue'
import { Flex } from '@atlaskit/primitives'
import { IconButton } from '@atlaskit/button/new'
import VidPlayIcon from '@atlaskit/icon/glyph/vid-play'
import { LogTimeButton, LogTimeDialog } from 'react-app/features/LogTime'
import { WatchController } from 'use-global-boolean'
import { ModalTransition } from '@atlaskit/modal-dialog'
import { CardIssueDetailsBadges, CardIssueHeader, CardIssue } from 'react-app/entities/Issues'

const Issue = (props: IssueProps) => {
    const { fields, id, idxPage, idxIssue, issueKey, isLast } = props
    const queryClient = useQueryClient()

    const uniqueNameBoolean = `log time issue ${id}`

    const onPlayTracking = () => {
        useGlobalState.getState().changeIssueIdsSearchParams('add', id)

        queryClient.setQueryData(['tasks tracking'], (old: IssueResponse['issues']): IssueResponse['issues'] => {
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
        <CardIssue
            active={false}
            isLast={isLast}
        >
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

                    <LogTimeButton
                        uniqueNameBoolean={uniqueNameBoolean}
                        issueId={id}
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

            <WatchController name={uniqueNameBoolean}>
                {({ localState }) => {
                    const [open] = localState

                    return (
                        <ModalTransition>
                            {open && (
                                <LogTimeDialog
                                    issueId={id}
                                    uniqueNameBoolean={uniqueNameBoolean}
                                    queryKey="tasks"
                                />
                            )}
                        </ModalTransition>
                    )
                }}
            </WatchController>
        </CardIssue>
    )
}

export default memo(Issue)
