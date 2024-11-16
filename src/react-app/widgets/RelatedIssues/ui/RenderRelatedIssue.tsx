import React, { FC, memo, useCallback, useMemo, useState } from 'react'
import { Issue } from 'react-app/shared/types/Jira/Issues'
import RelatedIssues, { RelatedIssuesNestedWrap } from 'react-app/entities/Issues/ui/RelatedIssues'
import Tooltip from '@atlaskit/tooltip'
import ChevronUpIcon from '@atlaskit/icon/glyph/chevron-up'
import ChevronDownIcon from '@atlaskit/icon/glyph/chevron-down'
import Image from '@atlaskit/image'
import Avatar from '@atlaskit/avatar'
import Lozenge from '@atlaskit/lozenge'
import { IconButton } from '@atlaskit/button/new'
import VidPlayIcon from '@atlaskit/icon/glyph/vid-play'
import { RelatedIssuesQuery } from '../types/types'
import { useGlobalState } from 'react-app/shared/lib/hooks/useGlobalState'
import { ChangeStatusIssue } from 'react-app/features/ChangeStatusIssue'
import { QueryKey, useQueryClient } from '@tanstack/react-query'
import { token } from '@atlaskit/tokens'

export const RenderRelatedIssue = memo(
    (props: RelatedIssuesQuery & { RenderRelatedIssues: FC<{ issueId: Issue['id'] }>; queryKey: QueryKey }) => {
        const { isRelatedIssuesLoad, parentIssue, id, issueKey, fields, RenderRelatedIssues, queryKey } = props
        const [isOpenRelatedIssues, setIsOpenRelatedIssues] = useState(false)
        const isTrackingIssue = useGlobalState((state) => state.issueIdsSearchParams.currentParams.includes(id))
        const queryClient = useQueryClient()

        const colorNew = fields.status.statusCategory.key === 'new' && 'default'
        const colorIndeterminate = fields.status.statusCategory.key === 'indeterminate' && 'inprogress'
        const colorDone = fields.status.statusCategory.key === 'done' && 'success'

        const appearance = colorNew || colorIndeterminate || colorDone || 'default'

        const indexIssue = useMemo(
            () => queryClient.getQueryData<RelatedIssuesQuery[]>(queryKey)?.findIndex((issue) => issue.id === id),
            [queryKey]
        )
        console.log('indexIssue =>', indexIssue)
        const isDone = useMemo(() => fields.status.statusCategory.key === 'done', [fields.status.statusCategory.key])
        const textDecorationLineThrough = useMemo(() => (isDone ? { textDecoration: 'line-through' } : {}), [isDone])

        const onMutate = useCallback(async () => {
            await useGlobalState.getState().changeIssueIdsSearchParams('add', id)
        }, [id])

        const onSuccess = useCallback(() => {
            queryClient.invalidateQueries()
        }, [])

        return (
            <>
                <RelatedIssues
                    iconSlot={
                        isRelatedIssuesLoad && (
                            <div
                                onClick={() => setIsOpenRelatedIssues(!isOpenRelatedIssues)}
                                style={{ cursor: 'pointer' }}
                            >
                                {isOpenRelatedIssues ? <ChevronUpIcon label="" /> : <ChevronDownIcon label="" />}
                            </div>
                        )
                    }
                    typeSlot={
                        <Tooltip content={fields.issuetype.name}>
                            {(triggerProps) => (
                                <div
                                    {...triggerProps}
                                    style={{ display: 'flex' }}
                                >
                                    <Image src={fields.issuetype.iconUrl} />
                                </div>
                            )}
                        </Tooltip>
                    }
                    keySlot={<span style={textDecorationLineThrough}>{issueKey}</span>}
                    summarySlot={fields.summary}
                    prioritySlot={
                        <Tooltip content={fields.priority.name}>
                            {(triggerProps) => (
                                <div
                                    {...triggerProps}
                                    style={{ display: 'flex' }}
                                >
                                    <Image
                                        src={fields.priority.iconUrl}
                                        width="20px"
                                        height="20px"
                                    />
                                </div>
                            )}
                        </Tooltip>
                    }
                    assigneeSlot={
                        <Tooltip content={fields.assignee?.displayName}>
                            {(triggerProps) => (
                                <div {...triggerProps}>
                                    <Avatar
                                        name={fields.assignee?.displayName}
                                        src={fields.assignee?.avatarUrls['24x24']}
                                        size="small"
                                    />
                                </div>
                            )}
                        </Tooltip>
                    }
                    statusSlot={<Lozenge appearance={appearance}>{fields.status.name}</Lozenge>}
                    playerSlot={
                        <ChangeStatusIssue
                            issueId={id}
                            issueName={fields.summary}
                            status={fields.status}
                            queryKeys={() => []}
                            position="left"
                            onMutate={onMutate}
                            onSuccess={onSuccess}
                            trigger={(triggerButtonProps, isPending) => (
                                <IconButton
                                    {...triggerButtonProps}
                                    ref={triggerButtonProps.triggerRef}
                                    isDisabled={isTrackingIssue}
                                    isLoading={isPending}
                                    icon={VidPlayIcon}
                                    label="Play"
                                    spacing="compact"
                                />
                            )}
                        />
                    }
                />

                {isOpenRelatedIssues && (
                    <RelatedIssuesNestedWrap marginLeft={`calc(${token('space.250')} + ${(indexIssue || 0) + 1}px)`}>
                        <RenderRelatedIssues issueId={id} />
                    </RelatedIssuesNestedWrap>
                )}
            </>
        )
    }
)
