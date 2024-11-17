import { MutationKey, useMutation, UseMutationOptions } from '@tanstack/react-query'
import { PLUGINS, useGlobalState } from 'react-app/shared/lib/hooks/useGlobalState'
import { axiosInstance, axiosInstancePlugin } from 'react-app/shared/config/api/api'
import dayjs from 'dayjs'
import { DATE_FORMAT } from 'react-app/shared/const'
import { AxiosError, AxiosResponse } from 'axios'
import { queryClient } from 'react-app/app/QueryClientProvide/QueryClientProvide'
import { convertJiraTimeToSeconds, worklogCommentTemplate } from 'react-app/entities/IssueWorklogs'
import { MySelf } from 'react-app/shared/types/Jira/MySelf'

export interface CreateIssueWorklog {
    issueId: string
    startDate?: string
    timeSpent: string
    timeSpentSeconds?: number
    description?: string
}

export interface UseIssueWorklogPOSTProps<MutateReturn> extends  UseMutationOptions<AxiosResponse<CreateIssueWorklog>, AxiosError, CreateIssueWorklog, MutateReturn> {
    prefetch?: () => Promise<void>
}

export const useIssueWorklogPOST = <MutateReturn>(props?: UseIssueWorklogPOSTProps<MutateReturn>) => {
    const workingDaysPerWeek = useGlobalState((state) => state.settings.workingDaysPerWeek)
    const workingHoursPerDay = useGlobalState((state) => state.settings.workingHoursPerDay)

    return useMutation({
        mutationKey: props?.mutationKey,
        mutationFn: async (data: CreateIssueWorklog) => {
            await props?.prefetch?.()

            const pluginName = useGlobalState.getState().settings.plugin

            switch (pluginName) {
                case PLUGINS.TEMPO: {
                    const mySelf = queryClient.getQueryData<MySelf>(['myself'])!

                    return await axiosInstancePlugin.post('/issue-worklog/plugin', {
                        issueId: data.issueId,
                        timeSpentSeconds:
                            data.timeSpentSeconds || convertJiraTimeToSeconds(data.timeSpent, workingDaysPerWeek, workingHoursPerDay),
                        startDate: dayjs(data.startDate).format(DATE_FORMAT),
                        authorAccountId: mySelf.accountId,
                        description: data.description,
                    })
                }

                default: {
                    return await axiosInstance.post('/issue-worklog', {
                        issueId: data.issueId,
                        started: dayjs(data.startDate).format('YYYY-MM-DDTHH:mm:ss.SSSZZ'),
                        timeSpentSeconds:
                            data.timeSpentSeconds || convertJiraTimeToSeconds(data.timeSpent, workingDaysPerWeek, workingHoursPerDay),
                        ...worklogCommentTemplate(data.description || ''),
                    })
                }
            }
        },
        ...props
    })
}
