import React, { memo, useCallback } from 'react'
import { useQueryClient, InfiniteData } from '@tanstack/react-query'
import { ChangeStatusIssue } from '../../../features/ChangeStatusIssue'
import { produce } from 'immer'
import { IssueProps } from '../types/types'
import { IssueResponse } from 'react-app/shared/types/Jira/Issues'
import { useGlobalState } from '../../../shared/lib/hooks/useGlobalState'
import ChangeAssigneeIssue from '../../../features/ChangeAssigneeIssue/ui/ChangeAssigneeIssue'
import { Flex } from '@atlaskit/primitives'
import { IconButton } from '@atlaskit/button/new'
import VidPlayIcon from '@atlaskit/icon/glyph/vid-play'
import { LogTimeButton } from 'react-app/widgets/LogTime'
import { CardIssueDetailsBadges, CardIssueHeader, CardIssue, useStatusStyles, IssueActivityFeedUIButtons } from 'react-app/entities/Issues'
import { FavoriteIssue } from 'react-app/features/FavoriteIssue'
import { LogTimeErrorNotification } from 'react-app/features/PersistLostTime'
import { LogTimeAutoBase } from 'react-app/widgets/LogTimeAuto'
import { ChildIssues, LinkedIssues } from 'react-app/widgets/RelatedIssues'

const Issue = (props: IssueProps) => {
    const { fields, id, issueKey } = props
    const queryClient = useQueryClient()

    const invalidateQueries = useCallback(() => {
        return ['issues']
    }, [])

    const styles = useStatusStyles(fields)

    const onPlayTracking = async () => {
        await useGlobalState.getState().changeIssueIdsSearchParams('add', id)

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

    return (
        <CardIssue active={false}>
            <CardIssueHeader fields={fields} />

            <LogTimeErrorNotification
                issueId={id}
                LogTimeAutoComponent={LogTimeAutoBase}
                invalidateQueries={invalidateQueries}
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
                <Flex
                    gap="space.100"
                    wrap="wrap"
                >
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

                    <LogTimeButton issueId={id} />

                    <FavoriteIssue issueId={id} />
                </Flex>

                <ChangeStatusIssue
                    issueId={id}
                    issueName={fields.summary}
                    status={fields.status}
                    queryKeys={invalidateQueries}
                    position="left"
                    onMutate={onPlayTracking}
                    disabled={false}
                    trigger={(triggerButtonProps) => (
                        <IconButton
                            {...triggerButtonProps}
                            ref={triggerButtonProps.triggerRef}
                            icon={VidPlayIcon}
                            label="Play"
                        />
                    )}
                />
            </Flex>

            <IssueActivityFeedUIButtons
                isShowLinkedIssues={fields.issuelinks.length > 0}
                isShowChildIssues={fields.subtasks.length > 0}
                countChildIssues={fields.subtasks.length}
                countLinkedIssues={fields.issuelinks.length}
            >
                {({ activityFeed }) => {
                    if (activityFeed === 'Linked issues') {
                        return <LinkedIssues issueId={id} />
                    }

                    if (activityFeed === 'Child issues') {
                        return <ChildIssues issueId={id} />
                    }

                    return null
                }}
            </IssueActivityFeedUIButtons>
        </CardIssue>
    )
}

export default memo(Issue)
