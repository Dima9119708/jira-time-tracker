import React, { memo, useCallback, useMemo } from 'react'
import { useQueryClient, InfiniteData } from '@tanstack/react-query'
import { secondsToUIFormat } from '../../../shared/lib/helpers/secondsToUIFormat'
import { ChangeStatusIssue } from '../../../features/ChangeStatusIssue'
import { produce } from 'immer'
import { IssueResponse } from 'react-app/shared/types/Jira/Issues'
import { useGlobalState } from '../../../shared/lib/hooks/useGlobalState'
import ChangeAssigneeIssue from '../../../features/ChangeAssigneeIssue/ui/ChangeAssigneeIssue'
import { Flex, xcss } from '@atlaskit/primitives'
import { IconButton } from '@atlaskit/button/new'
import VidPlayIcon from '@atlaskit/icon/glyph/vid-play'
import { LogTimeButton } from 'react-app/widgets/LogTime'
import { CardIssueDetailsBadges, CardIssueHeader, CardIssue, useStatusStyles } from 'react-app/entities/Issues'
import { FavoriteIssue, useFavoriteStore } from 'react-app/features/FavoriteIssue'
import { IssueProps } from 'react-app/pages/Issues/types/types'

interface FavoriteIssueProps extends IssueProps {
    queryKey: string
}

const Issue = (props: FavoriteIssueProps) => {
    const { fields, id, issueKey, queryKey } = props
    const queryClient = useQueryClient()
    const isTrackingIssue = useGlobalState((state) => state.issueIdsSearchParams.currentParams.includes(id))

    const invalidateQueries = useCallback(() => {
        return [...useFavoriteStore.getState().favorites.map(({ name }) => `favorite group ${name}`), 'issues tracking']
    }, [queryKey])

    const styles = useStatusStyles(fields)

    const onPlayTracking = async () => {
        await useGlobalState.getState().changeIssueIdsSearchParams('add', id)

        const issues = queryClient.getQueryData<IssueResponse['issues']>([queryKey])

        if (issues) {
            const issue = issues.find((issue) => issue.id === id)

            if (issue) {
                queryClient.setQueryData(['issues tracking'], (old: IssueResponse['issues']): IssueResponse['issues'] => {
                    return produce(old, (draft) => {
                        draft.unshift(issue)
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
    }

    return (
        <CardIssue active={false}>
            <CardIssueHeader
                summary={fields.summary}
                timeoriginalestimate={fields.timeoriginalestimate}
                timespent={fields.timespent}
                duedate={fields.duedate}
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
                gap="space.100"
                wrap="wrap"
            >
                <Flex gap="space.100" wrap="wrap">
                    <ChangeStatusIssue
                        issueId={id}
                        issueName={fields.summary}
                        status={fields.status}
                        queryKeys={invalidateQueries}
                        trigger={fields.status.name}
                        xcss={styles.STATUTES_DROPDOWN_BUTTON}
                    />

                    <ChangeAssigneeIssue
                        assignee={fields.assignee}
                        issueName={fields.summary}
                        issueKey={issueKey}
                        queryKeys={invalidateQueries}
                    />

                    <LogTimeButton
                        issueId={id}
                    />

                    <FavoriteIssue
                        issueId={id}
                        isDeleteGroup={false}
                        isEditGroup={false}
                        isAddNewGroup={false}
                    />
                </Flex>

                <ChangeStatusIssue
                    issueId={id}
                    issueName={fields.summary}
                    status={fields.status}
                    queryKeys={invalidateQueries}
                    position="left"
                    onMutate={() => onPlayTracking()}
                    trigger={(triggerButtonProps) => (
                        <IconButton
                            {...triggerButtonProps}
                            ref={triggerButtonProps.triggerRef}
                            icon={VidPlayIcon}
                            label="Play"
                            isDisabled={isTrackingIssue}
                        />
                    )}
                />
            </Flex>
        </CardIssue>
    )
}

export default memo(Issue)
