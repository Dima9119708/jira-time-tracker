import { useMutation } from '@tanstack/react-query'
import { PLUGINS, useGlobalState } from 'react-app/shared/lib/hooks/useGlobalState'
import { axiosInstance, axiosInstancePlugin } from 'react-app/shared/config/api/api'
import dayjs from 'dayjs'
import { DATE_FORMAT } from 'react-app/shared/const'
import { AxiosError, AxiosResponse } from 'axios'
import { MySelfResponse } from 'react-app/pages/Issues/types/types'
import { queryClient } from 'react-app/app/QueryClientProvide/QueryClientProvide'
import { convertJiraTimeToSeconds, worklogCommentTemplate } from 'react-app/entities/IssueWorklogs'

export interface CreateIssueWorklog {
    issueId: string
    startDate?: string
    timeSpent: string
    timeSpentSeconds?: number
    description?: string
}

export const useIssueWorklogPOST = <MutateReturn>(props?: {
    onMutate?: (variables: CreateIssueWorklog) => MutateReturn
    onSuccess?: (data: AxiosResponse<any, any>, variables: CreateIssueWorklog, context: MutateReturn | undefined) => void
    onError?: (error: AxiosError, variables: CreateIssueWorklog, context: MutateReturn | undefined) => void
}) => {
    const pluginName = useGlobalState((state) => state.settings.plugin)
    const workingDaysPerWeek = useGlobalState((state) => state.workingDaysPerWeek)
    const workingHoursPerDay = useGlobalState((state) => state.workingHoursPerDay)

    return useMutation({
        mutationFn: async (data: CreateIssueWorklog) => {
            switch (pluginName) {
                case PLUGINS.TEMPO: {
                    const mySelf = queryClient.getQueryData<MySelfResponse>(['login'])!

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
        onMutate: props?.onMutate,
        onSuccess: props?.onSuccess,
        onError: props?.onError,
    })
}
