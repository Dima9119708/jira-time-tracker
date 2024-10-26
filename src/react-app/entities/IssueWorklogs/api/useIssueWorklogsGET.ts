import { PLUGINS, useGlobalState } from 'react-app/shared/lib/hooks/useGlobalState'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { MySelfResponse } from 'react-app/pages/Issues/types/types'
import { axiosInstance, axiosInstancePlugin } from 'react-app/shared/config/api/api'
import { convertSecondsToJiraTime } from 'react-app/entities/IssueWorklogs/lib/convertJiraTimeToSeconds'
import dayjs from 'dayjs'
import { extractTextFromDoc } from 'react-app/entities/Worklogs/lib/helpers/extractTextFromDoc'
import { Worklog, WorklogsTempoPluginResponse } from 'react-app/entities/Worklogs/api/useGetWorklogs'
import { data } from 'autoprefixer'
import { DATE_FORMAT } from 'react-app/shared/const'

interface UseGetIssueWorklogs {
    issueId: string
    from?: string
    to?: string
    enabled?: boolean
}

interface IssueWorklogsJiraResponse {
    maxResults: number
    startAt: number
    total: number
    worklogs: {
        author: {
            accountId: string
            active: boolean
            displayName: string
            self: string
        }
        comment: {
            type: string
            version: number
            content: {
                type: string
                text?: string
                content?: {
                    type: string
                    text?: string
                }[]
            }[]
        }
        id: string
        issueId: string
        self: string
        started: string
        timeSpent: string
        timeSpentSeconds: number
        updateAuthor: {
            accountId: string
            active: boolean
            displayName: string
            self: string
        }
        updated: string
        visibility: {
            identifier: string
            type: string
            value: string
        }
    }[]
}

type IssueWorklogs = Pick<Worklog, 'date' | 'id' | 'timeSpent' | 'description' | 'timeSpentSeconds' | 'author'>

export const useIssueWorklogsGET = ({ issueId, to, from, enabled }: UseGetIssueWorklogs) => {
    const pluginName = useGlobalState((state) => state.settings.plugin)

    const queryClient = useQueryClient()

    return useQuery<IssueWorklogs[]>({
        enabled: enabled,
        queryKey: ['issue worklogs', pluginName, issueId],
        queryFn: async ({ signal }) => {
            switch (pluginName) {
                case PLUGINS.TEMPO: {
                    const mySelf = queryClient.getQueryData<MySelfResponse>(['login'])!

                    const tempoWorklogsResponse = await axiosInstancePlugin.post<WorklogsTempoPluginResponse>(
                        '/worklogs/plugin',
                        {
                            issueIds: [issueId],
                            authorIds: [mySelf.accountId],
                            orderBy: [
                                {
                                    field: 'START_DATE_TIME',
                                    order: 'DESC',
                                },
                            ],
                            ...(from && { from: dayjs(from).format(DATE_FORMAT) }),
                            ...(to && { to: dayjs(to).format(DATE_FORMAT) }),
                        },
                        {
                            signal: signal,
                        }
                    )

                    return tempoWorklogsResponse.data.results.map((worklog) => {
                        return {
                            id: worklog.tempoWorklogId.toString(),
                            timeSpent: convertSecondsToJiraTime(
                                worklog.timeSpentSeconds,
                                useGlobalState.getState().workingDaysPerWeek,
                                useGlobalState.getState().workingHoursPerDay
                            ),
                            timeSpentSeconds: worklog.timeSpentSeconds,
                            description: worklog.description,
                            author: {
                                displayName: mySelf.displayName,
                                avatarUrls: mySelf.avatarUrls,
                                accountId: mySelf.accountId,
                            },
                            date: worklog.startDate,
                        }
                    })
                }

                default: {
                    const mySelf = queryClient.getQueryData<MySelfResponse>(['login'])!

                    const jiraIssueWorklogsResponse = await axiosInstance.get<IssueWorklogsJiraResponse>('/issue-worklogs', {
                        params: {
                            issueId: issueId,
                            ...(from && { startedAfter: dayjs(from).valueOf() }),
                            ...(to && { startedBefore: dayjs(to).valueOf() }),
                        },
                        signal: signal,
                    })

                    return jiraIssueWorklogsResponse.data.worklogs.reduce((acc, worklog) => {
                        const dateStarted = dayjs(worklog.started).format('YYYY-MM-DD')

                        if (worklog.author.accountId === mySelf.accountId) {
                            acc.push({
                                id: worklog.id,
                                timeSpent: worklog.timeSpent,
                                timeSpentSeconds: worklog.timeSpentSeconds,
                                description: extractTextFromDoc(worklog.comment),
                                author: {
                                    displayName: mySelf.displayName,
                                    avatarUrls: mySelf.avatarUrls,
                                    accountId: mySelf.accountId,
                                },
                                date: dateStarted,
                            })
                        }

                        return acc
                    }, [] as IssueWorklogs[])
                }
            }
        },
    })
}
