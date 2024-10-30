import { useQuery, useQueryClient } from '@tanstack/react-query'
import { axiosInstance, axiosInstancePlugin } from 'react-app/shared/config/api/api'

import { PLUGINS, useGlobalState } from 'react-app/shared/lib/hooks/useGlobalState'
import { convertSecondsToJiraTime } from 'react-app/entities/IssueWorklogs/lib/convertJiraTimeToSeconds'
import dayjs from 'dayjs'
import { extractTextFromDoc } from '../lib/helpers/extractTextFromDoc'
import { Issue, IssueResponse } from 'react-app/shared/types/Jira/Issues'
import { MySelf } from 'react-app/shared/types/Jira/MySelf'
import { WorklogsTempoResponse } from 'react-app/shared/types/plugins/Tempo/Worklogs'

export interface UseGetWorklogsProps {
    from?: string
    to?: string
}

export type Worklog = {
    id: string
    timeSpent: string
    timeSpentSeconds: number
    issue: {
        icon: string
        summary: string
        id: string
    }
    project: {
        name: string
    }
    description: string
    author: Pick<MySelf, 'avatarUrls' | 'displayName' | 'accountId'>
    date: string
}

type QueryResult = Array<[string, Worklog[]]>

export const useWorklogsGET = ({ to, from }: UseGetWorklogsProps) => {
    const pluginName = useGlobalState((state) => state.settings.plugin)

    const queryClient = useQueryClient()

    return useQuery<QueryResult>({
        queryKey: ['worklogs', pluginName, to, from],
        queryFn: async () => {
            switch (pluginName) {
                case PLUGINS.TEMPO: {
                    const mySelf = queryClient.getQueryData<MySelf>(['myself'])!

                    const tempoWorklogsResponse = await axiosInstancePlugin.post<WorklogsTempoResponse>('/worklogs/plugin', {
                        authorIds: [mySelf.accountId],
                        from: from,
                        to: to,
                    })

                    const issuesResponse = await Promise.all(
                        tempoWorklogsResponse.data.results.map(({ issue }) =>
                            axiosInstance.get<Issue>('/issue', { params: { id: issue.id } })
                        )
                    )

                    const worklogs = tempoWorklogsResponse.data.results.map((worklog) => {
                        const issue = issuesResponse.find((issueResponse) => issueResponse.data.id === `${worklog.issue.id}`)!

                        return {
                            id: worklog.tempoWorklogId.toString(),
                            timeSpent: convertSecondsToJiraTime(
                                worklog.timeSpentSeconds,
                                useGlobalState.getState().workingDaysPerWeek,
                                useGlobalState.getState().workingHoursPerDay
                            ),
                            timeSpentSeconds: worklog.timeSpentSeconds,
                            issue: {
                                icon: issue.data.fields.issuetype.iconUrl,
                                summary: issue.data.fields.summary,
                                id: issue.data.id,
                            },
                            project: {
                                name: issue.data.fields.project.name,
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
                        jql: `worklogDate >= "${from}" AND worklogDate <= "${to}" AND worklogAuthor = currentUser()`,
                        fields: ['summary', 'status', 'issuetype', 'worklog'],
                    })

                    const worklogs = jiraWorklogsResponse.data.issues.reduce((acc, issue) => {
                        issue.fields.worklog.worklogs.forEach((worklog) => {
                            const dateStarted = dayjs(worklog.started).format('YYYY-MM-DD')

                            if (worklog.author.accountId === mySelf.accountId && dateStarted === from) {
                                acc.push({
                                    id: worklog.id,
                                    timeSpent: worklog.timeSpent,
                                    timeSpentSeconds: worklog.timeSpentSeconds,
                                    issue: {
                                        icon: issue.fields.issuetype.iconUrl,
                                        summary: issue.fields.summary,
                                        id: issue.id,
                                    },
                                    project: {
                                        name: issue.fields.project.name,
                                    },
                                    description: extractTextFromDoc(worklog.comment) || '==//==',
                                    author: {
                                        displayName: worklog.author.displayName,
                                        avatarUrls: worklog.author.avatarUrls!,
                                        accountId: worklog.author.accountId,
                                    },
                                    date: dateStarted,
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
