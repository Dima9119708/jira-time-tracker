import { PLUGINS, useGlobalState } from 'react-app/shared/lib/hooks/useGlobalState'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { axiosInstance, axiosInstancePlugin } from 'react-app/shared/config/api/api'
import { convertSecondsToJiraTime } from 'react-app/entities/IssueWorklogs/lib/convertJiraTimeToSeconds'
import dayjs, { Dayjs } from 'dayjs'
import { extractTextFromDoc } from 'react-app/entities/Worklogs/lib/helpers/extractTextFromDoc'
import { Worklog } from 'react-app/entities/Worklogs/api/useWorklogsGET'
import { DATE_FORMAT } from 'react-app/shared/const'
import { MySelf } from 'react-app/shared/types/Jira/MySelf'
import { WorklogResponse } from 'react-app/shared/types/Jira/Worklogs'
import { WorklogsTempoResponse } from 'react-app/shared/types/plugins/Tempo/Worklogs'

export interface UseGetIssueWorklogs {
    issueId: string
    from?: string | Dayjs
    to?: string | Dayjs
    enabled?: boolean
    prefetch?: () => Promise<void>
}

export type IssueWorklogs = Pick<Worklog, 'date' | 'id' | 'timeSpent' | 'description' | 'timeSpentSeconds' | 'author'>

export const useIssueWorklogsGET = ({ issueId, to, from, enabled, prefetch }: UseGetIssueWorklogs) => {
    const queryClient = useQueryClient()

    return useQuery<IssueWorklogs[]>({
        enabled: enabled,
        queryKey: ['issue worklogs', issueId, to, from],
        queryFn: async ({ signal }) => {
            await prefetch?.()

            const pluginName = useGlobalState.getState().settings.plugin

            switch (pluginName) {
                case PLUGINS.TEMPO: {
                    const mySelf = queryClient.getQueryData<MySelf>(['myself'])!

                    const tempoWorklogsResponse = await axiosInstancePlugin.post<WorklogsTempoResponse>(
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
                                useGlobalState.getState().settings.workingDaysPerWeek,
                                useGlobalState.getState().settings.workingHoursPerDay
                            ),
                            timeSpentSeconds: worklog.timeSpentSeconds,
                            description: worklog.description || '==//==',
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
                    const mySelf = queryClient.getQueryData<MySelf>(['myself'])!

                    const jiraIssueWorklogsResponse = await axiosInstance.get<WorklogResponse>('/issue-worklogs', {
                        params: {
                            issueId: issueId,
                        },
                        signal: signal,
                    })

                    const _from = dayjs(from);
                    const _to = dayjs(to);

                    return jiraIssueWorklogsResponse.data.worklogs.reduce((acc, worklog) => {
                        const dateStarted = dayjs(worklog.started);
                        const dateCreated = dayjs(worklog.created);

                        if (worklog.author.accountId === mySelf.accountId) {
                            if (from && to && dateStarted.isSameOrAfter(_from) && dateStarted.isSameOrBefore(_to)) {
                                acc.push({
                                    id: worklog.id,
                                    timeSpent: worklog.timeSpent,
                                    timeSpentSeconds: worklog.timeSpentSeconds,
                                    description: extractTextFromDoc(worklog.comment).trim() || '==//==',
                                    author: {
                                        displayName: mySelf.displayName,
                                        avatarUrls: mySelf.avatarUrls,
                                        accountId: mySelf.accountId,
                                    },
                                    date: dateStarted.format(DATE_FORMAT),
                                    dateCreated
                                })
                            }

                            if (!from && !to) {
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
                                    date: dateStarted.format(DATE_FORMAT),
                                    dateCreated
                                })
                            }
                        }

                        return acc
                    }, [] as (IssueWorklogs & { dateCreated: Dayjs })[])
                        .sort((a, b) => b.dateCreated.isBefore(a.date) ? 1 : -1)
                        .map((worklog) => {
                            return {
                                id: worklog.id,
                                timeSpent: worklog.timeSpent,
                                timeSpentSeconds: worklog.timeSpentSeconds,
                                description: worklog.description,
                                author: {
                                    displayName: mySelf.displayName,
                                    avatarUrls: mySelf.avatarUrls,
                                    accountId: mySelf.accountId,
                                },
                                date: worklog.date,
                            }
                        })
                }
            }
        },
    })
}
