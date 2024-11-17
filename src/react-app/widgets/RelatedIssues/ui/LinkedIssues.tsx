import React, { memo, useEffect, useMemo } from 'react'
import { Issue, IssueResponse } from 'react-app/shared/types/Jira/Issues'
import { useQuery } from '@tanstack/react-query'
import { axiosInstance } from 'react-app/shared/config/api/api'
import EmptyState from '@atlaskit/empty-state'
import { RelatedIssuesProps, RelatedIssuesQuery } from '../types/types'
import { RenderRelatedIssue } from '../ui/RenderRelatedIssue'
import Heading from '@atlaskit/heading'
import { RelatedIssuesRoot, RelatedIssuesWrap } from 'react-app/entities/Issues'
import { useErrorNotifier } from 'react-app/shared/lib/hooks/useErrorNotifier'

type RelatedIssuesWithType = (RelatedIssuesQuery & { type: string })[]

type QueryResult = [string, RelatedIssuesWithType][]

export const LinkedIssues = memo((props: RelatedIssuesProps) => {
    const { issueId } = props

    const queryKey = useMemo(() => ['linked issues', issueId], [issueId])

    const { data, isLoading, error } = useQuery<QueryResult>({
        queryKey: queryKey,
        queryFn: async (context) => {
            const responseIssue = await axiosInstance.get<Issue>('/issue', {
                params: {
                    id: issueId,
                },
                signal: context.signal,
            })

            const issuelinks = responseIssue.data.fields.issuelinks

            if (issuelinks.length === 0) {
                return []
            }

            const ids = issuelinks.map((issuelink) => {
                return issuelink.inwardIssue?.id || issuelink.outwardIssue?.id
            })

            const responseIssues = await axiosInstance.get<IssueResponse>('/issues', {
                params: {
                    jql: `issue in (${ids.join(',')})`,
                    startAt: 0,
                    maxResults: ids.length,
                },
                signal: context.signal,
            })

            const result = responseIssue.data.fields.issuelinks.reduce<RelatedIssuesWithType>((acc, issuelink) => {
                const issue = responseIssues.data.issues.find((issue) => issue.id === (issuelink.inwardIssue?.id || issuelink.outwardIssue?.id))

                const inwardIssue = issuelink.inwardIssue
                const outwardIssue = issuelink.outwardIssue

                if(issue && outwardIssue) {
                    acc.push({
                        type: issuelink.type.outward,
                        id: outwardIssue.id,
                        issueKey: outwardIssue.key,
                        isRelatedIssuesLoad: false,
                        parentIssue: {
                            key: responseIssue.data.key,
                            summary: responseIssue.data.fields.summary,
                        },
                        fields: {
                            summary: outwardIssue.fields.summary,
                            issuetype: outwardIssue.fields.issuetype,
                            status: outwardIssue.fields.status,
                            priority: outwardIssue.fields.priority,
                            assignee: issue.fields.assignee
                        },
                    })
                }

                if (issue && inwardIssue) {
                    acc.push({
                        type: issuelink.type.inward,
                        id: inwardIssue.id,
                        issueKey: inwardIssue.key,
                        isRelatedIssuesLoad: issue.fields.issuelinks.length > 0,
                        parentIssue: {
                            key: responseIssue.data.key,
                            summary: responseIssue.data.fields.summary,
                        },
                        fields: {
                            summary: inwardIssue.fields.summary,
                            issuetype: inwardIssue.fields.issuetype,
                            status: inwardIssue.fields.status,
                            priority: inwardIssue.fields.priority,
                            assignee: issue.fields.assignee
                        },
                    })
                }

                return acc
            }, [])

            return Object.entries(Object.groupBy(result, (issueLink) => issueLink.type)) as QueryResult
        },
    })

    useErrorNotifier(error)

    return (
        <RelatedIssuesRoot>
            { isLoading && <EmptyState isLoading header="" /> }
            {data?.map(([groupType, issueLinks]) => (
                <>
                    <Heading size="small">{groupType}</Heading>
                    <RelatedIssuesWrap>
                        {issueLinks.map((issueLink) => (
                            <RenderRelatedIssue
                                key={issueLink.id}
                                {...issueLink}
                                queryKey={queryKey}
                                RenderRelatedIssues={LinkedIssues}
                            />
                        ))}
                    </RelatedIssuesWrap>
                </>


            ))}
        </RelatedIssuesRoot>
    )
})
