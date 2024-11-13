import React, { memo, useCallback, useMemo } from 'react'
import { useQueryClient, InfiniteData } from '@tanstack/react-query'
import { secondsToUIFormat } from '../../../shared/lib/helpers/secondsToUIFormat'
import { ChangeStatusIssue } from '../../../features/ChangeStatusIssue'
import { produce } from 'immer'
import { IssueProps } from '../types/types'
import { IssueResponse } from 'react-app/shared/types/Jira/Issues'
import { useGlobalState } from '../../../shared/lib/hooks/useGlobalState'
import ChangeAssigneeIssue from '../../../features/ChangeAssigneeIssue/ui/ChangeAssigneeIssue'
import { Box, Flex, xcss } from '@atlaskit/primitives'
import { IconButton } from '@atlaskit/button/new'
import VidPlayIcon from '@atlaskit/icon/glyph/vid-play'
import { LogTimeButton, LogTimeDialog } from 'react-app/widgets/LogTime'
import { WatchController } from 'use-global-boolean'
import { ModalTransition } from '@atlaskit/modal-dialog'
import { CardIssueDetailsBadges, CardIssueHeader, CardIssue, useStatusStyles } from 'react-app/entities/Issues'
import { FavoriteIssue, useFavoriteStore } from 'react-app/features/FavoriteIssue'
import { Worklog } from 'react-app/shared/types/Jira/Worklogs'
import { LogTimeErrorNotification } from 'react-app/features/PersistLostTime'
import { LogTimeAutoBase } from 'react-app/widgets/LogTimeAuto'

const Issue = (props: IssueProps) => {
    const { fields, id, issueKey } = props
    const queryClient = useQueryClient()

    const uniqueNameBoolean = `log time issue ${id}`

    const queryKeys = useCallback(() => {
        return [...useFavoriteStore.getState().favorites.map(({ name }) => `favorite group ${name}`), 'issues']
    }, [])

    const styles = useStatusStyles(fields)

    const onPlayTracking = () => {
        useGlobalState.getState().changeIssueIdsSearchParams('add', id)

        const issues = queryClient.getQueryData<InfiniteData<IssueResponse>>(['issues'])

        if (issues) {
            queryClient.setQueryData(['issues tracking'], (old: IssueResponse['issues']): IssueResponse['issues'] => {
                return produce(old, (draft) => {
                    for (const page of issues.pages) {
                        const issue = page.issues.find((issue) => issue.id === id)
                        if (issue) {
                            draft.unshift(issue)
                        }
                    }
                })
            })

            queryClient.setQueryData(['issues'], (old: InfiniteData<IssueResponse>): InfiniteData<IssueResponse> => {
                return produce(old, (draft) => {
                    for (const page of draft.pages) {
                        const index = page.issues.findIndex((issue) => issue.id === id)
                        if (index !== -1) {
                            page.issues.splice(index, 1)
                            return
                        }
                    }
                })
            })
        }
    }

    const onSuccessStatusChange = useCallback(() => {
        const statuses = useGlobalState.getState().settings.jqlBasic?.statuses

        if (Array.isArray(statuses)) {
            if (!statuses.includes(fields.status.name)) {
                queryClient.invalidateQueries({ queryKey: ['issues'] })
            }
        }
    }, [fields.status.name])

    const onSuccessAssigneeChange = useCallback(() => {
        const assignees = useGlobalState.getState().settings.jqlBasic?.assignees

        if (Array.isArray(assignees)) {
            if (!assignees.includes(fields.assignee === null ? null : fields.assignee.accountId)) {
                queryClient.invalidateQueries({ queryKey: ['issues'] })
            }
        }
    }, [fields.status.name])

    return (
        <CardIssue active={false}>
            <CardIssueHeader
                summary={fields.summary}
                timeoriginalestimate={secondsToUIFormat(fields.timeoriginalestimate)}
                timespent={secondsToUIFormat(fields.timespent)}
            />

            <LogTimeErrorNotification issueId={id} LogTimeAutoComponent={LogTimeAutoBase} />

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
                        queryKeys={queryKeys}
                        trigger={fields.status.name}
                        xcss={styles.STATUTES_DROPDOWN_BUTTON}
                        onSuccess={onSuccessStatusChange}
                    />

                    <ChangeAssigneeIssue
                        assignee={fields.assignee}
                        issueName={fields.summary}
                        issueKey={issueKey}
                        queryKeys={queryKeys}
                        onSuccess={onSuccessAssigneeChange}
                    />

                    <LogTimeButton issueId={id} />

                    <FavoriteIssue issueId={id} />
                </Flex>

                <ChangeStatusIssue
                    issueId={id}
                    issueName={fields.summary}
                    status={fields.status}
                    queryKeys={queryKeys}
                    position="left"
                    onMutate={() => onPlayTracking()}
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


        </CardIssue>
    )
}

export default memo(Issue)
