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
import { LogTimeButton, LogTimeDialog } from 'react-app/features/LogTime'
import { WatchController } from 'use-global-boolean'
import { ModalTransition } from '@atlaskit/modal-dialog'
import { CardIssueDetailsBadges, CardIssueHeader, CardIssue } from 'react-app/entities/Issues'
import { FavoriteIssue, useFavoriteStore } from 'react-app/features/FavoriteIssue'
import { IssueProps } from 'react-app/pages/Issues/types/types'
import { token } from '@atlaskit/tokens'

interface FavoriteIssueProps extends  IssueProps{
    queryKey: string
}

const Issue = (props: FavoriteIssueProps) => {
    const { fields, id, issueKey, queryKey } = props
    const queryClient = useQueryClient()
    const isTrackingIssue =  useGlobalState((state) => state.issueIdsSearchParams.currentParams.includes(id))

    const uniqueNameBoolean = `favorite log time issue ${id}`

    const queryKeys = useCallback(() => {
        return [
            ...useFavoriteStore.getState().favorites.map(({ name }) => `favorite group ${name}`),
            'issues tracking',
            'issues'
        ]
    }, [queryKey])

    const styles = useMemo(() => {
        const colorNew = fields.status.statusCategory.key === 'new' && 'default'
        const colorIndeterminate = fields.status.statusCategory.key === 'indeterminate' && 'primary'
        const colorDone = fields.status.statusCategory.key === 'done' && 'subtle'

        return {
            STATUTES_DROPDOWN_BUTTON: xcss({
                // @ts-ignore
                '& > button': {
                    fontWeight: token('font.weight.semibold'),
                    ...(colorNew && {
                        backgroundColor: token('color.background.neutral'),
                        color: token('color.text'),
                    }),
                    ...(colorIndeterminate && {
                        backgroundColor: token('color.background.information.bold'),
                        color: token('color.text.inverse'),
                    }),
                    ...(colorDone && {
                        backgroundColor: token('color.chart.success.bold'),
                        color: token('color.text.inverse'),
                    }),
                },
                '& > button:hover': {
                    ...(colorNew && {
                        backgroundColor: token('color.background.neutral.hovered'),
                        color: token('color.text'),
                    }),
                    ...(colorIndeterminate && {
                        backgroundColor: token('color.background.information.bold.hovered'),
                        color: token('color.text.inverse'),
                    }),
                    ...(colorDone && {
                        backgroundColor: token('color.chart.success.bold.hovered'),
                        color: token('color.text.inverse'),
                    }),
                },
            })
        }
    }, [fields.status.name])

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
            }
        }
    }

    return (
        <CardIssue
            active={false}
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
                        queryKeys={queryKeys}
                        trigger={fields.status.name}
                        xcss={styles.STATUTES_DROPDOWN_BUTTON}
                    />

                    <ChangeAssigneeIssue
                        assignee={fields.assignee}
                        issueName={fields.summary}
                        issueKey={issueKey}
                        queryKeys={queryKeys}
                    />

                    <LogTimeButton
                        uniqueNameBoolean={uniqueNameBoolean}
                        issueId={id}
                    />

                    <FavoriteIssue issueId={id} />
                </Flex>

                <ChangeStatusIssue
                    issueId={id}
                    issueName={fields.summary}
                    status={fields.status}
                    queryKeys={queryKeys}
                    position="left"
                    onChange={() => onPlayTracking()}
                    disabled={fields.status.statusCategory.key === 'indeterminate'}
                    trigger={(triggerButtonProps) => (
                        <IconButton
                            {...triggerButtonProps}
                            ref={triggerButtonProps.triggerRef}
                            icon={VidPlayIcon}
                            label="Play"
                            isDisabled={isTrackingIssue}
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
                                    queryKey="issues"
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