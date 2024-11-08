import { useQuery, useQueryClient } from '@tanstack/react-query'
import { axiosInstance, axiosInstancePlugin } from 'react-app/shared/config/api/api'

import { PLUGINS, useGlobalState } from 'react-app/shared/lib/hooks/useGlobalState'
import { convertSecondsToJiraTime } from 'react-app/entities/IssueWorklogs/lib/convertJiraTimeToSeconds'
import dayjs, { Dayjs } from 'dayjs'
import { extractTextFromDoc } from '../lib/helpers/extractTextFromDoc'
import { Issue, IssueResponse } from 'react-app/shared/types/Jira/Issues'
import { MySelf } from 'react-app/shared/types/Jira/MySelf'
import { WorklogsTempoResponse } from 'react-app/shared/types/plugins/Tempo/Worklogs'
import { DATE_FORMAT } from 'react-app/shared/const'
import { secondsToUIFormat } from 'react-app/shared/lib/helpers/secondsToUIFormat'

export interface UseGetWorklogsProps {
    from?: string | Dayjs
    to?: string | Dayjs
    prefetch?: () => Promise<void>
}

export type Worklog = {
    id: string
    timeSpent: string
    timeSpentSeconds: number
    issue: {
        icon: string
        summary: string
        id: string
        key: Issue['key']
    }
    project: {
        name: string
        avatarUrl: string
    }
    description: string
    author: Pick<MySelf, 'avatarUrls' | 'displayName' | 'accountId'>
    date: string
}

type QueryResult = Array<[string, Worklog[]]>

export const useWorklogsGET = ({ to, from, prefetch }: UseGetWorklogsProps) => {

    const queryClient = useQueryClient()

    return useQuery<QueryResult>({
        queryKey: ['worklogs', to, from],
        queryFn: async (context) => {
            await prefetch?.()

            const pluginName = useGlobalState.getState().settings.plugin

            switch (pluginName) {
                case PLUGINS.TEMPO: {
                    const mySelf = queryClient.getQueryData<MySelf>(['myself'])!

                    const tempoWorklogsResponse = await axiosInstancePlugin.post<WorklogsTempoResponse>('/worklogs/plugin', {
                        authorIds: [mySelf.accountId],
                        from: dayjs(from).format(DATE_FORMAT),
                        to: dayjs(to).format(DATE_FORMAT),
                    }, {
                        signal: context.signal
                    })

                    const issuesResponse = await Promise.all(
                        tempoWorklogsResponse.data.results.map(({ issue }) =>
                            axiosInstance.get<Issue>('/issue', { params: { id: issue.id }, signal: context.signal })
                        )
                    )

                    const worklogs = tempoWorklogsResponse.data.results.map((worklog) => {
                        const issue = issuesResponse.find((issueResponse) => issueResponse.data.id === `${worklog.issue.id}`)!

                        return {
                            id: worklog.tempoWorklogId.toString(),
                            timeSpent: convertSecondsToJiraTime(
                                worklog.timeSpentSeconds,
                                useGlobalState.getState().settings.workingDaysPerWeek,
                                useGlobalState.getState().settings.workingHoursPerDay
                            ),
                            timeSpentSeconds: worklog.timeSpentSeconds,
                            issue: {
                                icon: issue.data.fields.issuetype.iconUrl,
                                summary: issue.data.fields.summary,
                                id: issue.data.id,
                                key: issue.data.key
                            },
                            project: {
                                name: issue.data.fields.project.name,
                                avatarUrl: issue.data.fields.project.avatarUrls['48x48']
                            },
                            description: worklog.description || '==//==',
                            author: {
                                displayName: mySelf.displayName,
                                avatarUrls: mySelf.avatarUrls,
                                accountId: mySelf.accountId,
                            },
                            date: worklog.startDate,
                        }
                    })

                    return Object.entries(Object.groupBy(worklogs, (worklog) => worklog.project.name)) as QueryResult
                }

                default: {
                    const mySelf = queryClient.getQueryData<MySelf>(['myself'])!

                    const jiraWorklogsResponse = await axiosInstance.post<IssueResponse>('/worklogs', {
                        jql: `worklogDate >= "${dayjs(from).format(DATE_FORMAT)}" AND worklogDate <= "${dayjs(to).format(DATE_FORMAT)}" AND worklogAuthor = currentUser()`,
                        fields: ['summary', 'status', 'issuetype', 'worklog', 'project'],
                    }, {
                        signal: context.signal
                    })

                    const worklogs = jiraWorklogsResponse.data.issues.reduce((acc, issue) => {
                        issue.fields.worklog.worklogs.forEach((worklog) => {
                            const dateStarted = dayjs(worklog.started);

                            if (worklog.author.accountId === mySelf.accountId && dateStarted.isSameOrAfter(from) && dateStarted.isSameOrBefore(to)) {

                                acc.push({
                                    id: worklog.id,
                                    timeSpent: worklog.timeSpent,
                                    timeSpentSeconds: worklog.timeSpentSeconds,
                                    issue: {
                                        icon: issue.fields.issuetype.iconUrl,
                                        summary: issue.fields.summary,
                                        id: issue.id,
                                        key: issue.key
                                    },
                                    project: {
                                        name: issue.fields.project.name,
                                        avatarUrl: issue.fields.project.avatarUrls['48x48']
                                    },
                                    description: extractTextFromDoc(worklog.comment).trim() || '==//==',
                                    author: {
                                        displayName: worklog.author.displayName,
                                        avatarUrls: worklog.author.avatarUrls!,
                                        accountId: worklog.author.accountId,
                                    },
                                    date: dateStarted.format(DATE_FORMAT),
                                })
                            }
                        })

                        return acc
                    }, [] as Worklog[])

                    return Object.entries(Object.groupBy(worklogs, (worklog) => worklog.project.name)) as QueryResult
                }
            }
        },
    })
}
