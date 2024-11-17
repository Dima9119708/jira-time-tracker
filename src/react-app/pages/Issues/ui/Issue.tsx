import React, { memo, useCallback } from 'react'
import { ChangeStatusIssue } from '../../../features/ChangeStatusIssue'
import { IssueProps } from '../types/types'
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
    const isTrackingIssue = useGlobalState((state) => state.issueIdsSearchParams.currentParams.includes(id))
    const invalidateQueries = useCallback(() => {
        return ['issues']
    }, [])

    const styles = useStatusStyles(fields)

    const onPlayTracking = async () => {
        await useGlobalState.getState().changeIssueIdsSearchParams('add', id)
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
                    trigger={(triggerButtonProps, isPending) => (
                        <IconButton
                            {...triggerButtonProps}
                            isLoading={isPending}
                            isDisabled={isTrackingIssue}
                            ref={triggerButtonProps.triggerRef}
                            isTooltipDisabled={false}
                            tooltip={{
                                content: isTrackingIssue ? 'Already tracking' : 'Play',
                            }}
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
