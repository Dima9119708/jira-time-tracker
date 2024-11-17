import { PLUGINS, useGlobalState } from 'react-app/shared/lib/hooks/useGlobalState'
import { MutationKey, useMutation, UseMutationOptions } from '@tanstack/react-query'
import { axiosInstance, axiosInstancePlugin } from 'react-app/shared/config/api/api'
import dayjs from 'dayjs'
import { DATE_FORMAT } from 'react-app/shared/const'
import { CreateIssueWorklog } from 'react-app/entities/IssueWorklogs/api/useIssueWorklogPOST'
import { AxiosError, AxiosResponse } from 'axios'
import { convertJiraTimeToSeconds, worklogCommentTemplate } from 'react-app/entities/IssueWorklogs'
import { queryClient } from 'react-app/app/QueryClientProvide/QueryClientProvide'
import { MySelf } from 'react-app/shared/types/Jira/MySelf'

export interface PutIssueWorklog extends Partial<CreateIssueWorklog> {
    issueId: string
    id: string
    timeSpent: string
    timeSpentSeconds?: number
    startDate: string
    description?: string
}

export interface UseIssueWorklogPUTProps<MutateReturn> extends UseMutationOptions<AxiosResponse<PutIssueWorklog>, AxiosError, PutIssueWorklog, MutateReturn>{
    prefetch?: () => Promise<void>
}

export const useIssueWorklogPUT = <MutateReturn>(props?: UseIssueWorklogPUTProps<MutateReturn>) => {
    const workingDaysPerWeek = useGlobalState((state) => state.settings.workingDaysPerWeek)
    const workingHoursPerDay = useGlobalState((state) => state.settings.workingHoursPerDay)

    return useMutation({
        mutationFn: async (data: PutIssueWorklog) => {
            await props?.prefetch?.()

            const pluginName = useGlobalState.getState().settings.plugin

            switch (pluginName) {
                case PLUGINS.TEMPO: {
                    const mySelf = queryClient.getQueryData<MySelf>(['myself'])!
                    return await axiosInstancePlugin.put('/issue-worklog/plugin', {
                        id: data.id,
                        startDate: dayjs(data.startDate).format(DATE_FORMAT),
                        authorAccountId: mySelf.accountId,
                        timeSpentSeconds:
                            data.timeSpentSeconds || convertJiraTimeToSeconds(data.timeSpent, workingDaysPerWeek, workingHoursPerDay),
                        ...(data.description !== undefined && { description: data.description }),
                    })
                }

                default: {
                    return await axiosInstance.put('/issue-worklog', {
                        issueId: data.issueId,
                        id: data.id,
                        started: dayjs(data.startDate).format('YYYY-MM-DDTHH:mm:ss.SSSZZ'),
                        timeSpentSeconds:
                            data.timeSpentSeconds || convertJiraTimeToSeconds(data.timeSpent, workingDaysPerWeek, workingHoursPerDay),
                        ...(data.description !== undefined  && worklogCommentTemplate(data.description)),
                    })
                }
            }
        },
        ...props
    })
}
