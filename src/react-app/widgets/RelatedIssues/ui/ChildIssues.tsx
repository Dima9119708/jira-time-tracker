import { useQuery } from '@tanstack/react-query'
import { axiosInstance } from 'react-app/shared/config/api/api'
import { Issue, IssueResponse } from 'react-app/shared/types/Jira/Issues'
import { UNASSIGNED_USER } from 'react-app/entities/UserSearch/constants/defaultUser'
import EmptyState from '@atlaskit/empty-state'
import React, { memo, useMemo } from 'react'
import { RenderRelatedIssue } from './RenderRelatedIssue'
import { RelatedIssuesProps, RelatedIssuesQuery } from '../types/types'
import { RelatedIssuesRoot, RelatedIssuesWrap } from 'react-app/entities/Issues'

export const ChildIssues = memo((props: RelatedIssuesProps) => {
    const { issueId } = props

    const queryKey = useMemo(() => ['child issues', issueId], [issueId])

    const { data, isLoading } = useQuery<RelatedIssuesQuery[]>({
        queryKey: queryKey,
        queryFn: async (context) => {
            const responseIssue = await axiosInstance.get<Issue>('/issue', {
                params: {
                    id: issueId,
                },
                signal: context.signal,
            })

            const issuesIds = responseIssue.data.fields.subtasks.map((subtask) => subtask.id)

            if (issuesIds.length === 0) {
                return []
            }

            const responseIssues = await axiosInstance.get<IssueResponse>('/issues', {
                params: {
                    jql: `issue in (${issuesIds.map((id) => id).join(',')})`,
                    startAt: 0,
                    maxResults: issuesIds.length,
                },
                signal: context.signal,
            })

            return issuesIds.reduce<RelatedIssuesQuery[]>((acc, id) => {
                const issue = responseIssues.data.issues.find((issue) => issue.id === id)

                if (issue) {
                    acc.push({
                        id: issue.id,
                        issueKey: issue.key,
                        isRelatedIssuesLoad: issue.fields.subtasks.length > 0,
                        parentIssue: {
                            key: responseIssue.data.key,
                            summary: responseIssue.data.fields.summary,
                        },
                        fields: {
                            summary: issue.fields.summary,
                            issuetype: issue.fields.issuetype,
                            status: issue.fields.status,
                            priority: issue.fields.priority,
                            assignee: issue.fields.assignee
                        },
                    })
                }

                return acc
            }, [])
        },
    })

    return (
        <RelatedIssuesRoot>
            {
                isLoading && <EmptyState isLoading header="" />
            }
            <RelatedIssuesWrap>
                {data?.map((issueLink) => (
                    <RenderRelatedIssue
                        key={issueLink.id}
                        {...issueLink}
                        queryKey={queryKey}
                        RenderRelatedIssues={ChildIssues}
                    />
                ))}
            </RelatedIssuesWrap>

        </RelatedIssuesRoot>
    )
})
