import { PLUGINS, useGlobalState } from 'react-app/shared/lib/hooks/useGlobalState'
import { useMutation } from '@tanstack/react-query'
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

export const useIssueWorklogPUT = <MutateReturn>(props?: {
    onMutate?: (variables: PutIssueWorklog) => MutateReturn
    onSuccess?: (data: AxiosResponse<any, any>, variables: PutIssueWorklog, context: MutateReturn | undefined) => void
    onError?: (error: AxiosError, variables: PutIssueWorklog, context: MutateReturn | undefined) => void
}) => {
    const pluginName = useGlobalState((state) => state.settings.plugin)
    const workingDaysPerWeek = useGlobalState((state) => state.workingDaysPerWeek)
    const workingHoursPerDay = useGlobalState((state) => state.workingHoursPerDay)

    return useMutation({
        mutationFn: async (data: PutIssueWorklog) => {
            switch (pluginName) {
                case PLUGINS.TEMPO: {
                    const mySelf = queryClient.getQueryData<MySelf>(['login'])!
                    return await axiosInstancePlugin.put('/issue-worklog/plugin', {
                        id: data.id,
                        startDate: dayjs(data.startDate).format(DATE_FORMAT),
                        authorAccountId: mySelf.accountId,
                        timeSpentSeconds:
                            data.timeSpentSeconds || convertJiraTimeToSeconds(data.timeSpent, workingDaysPerWeek, workingHoursPerDay),
                        ...(data.description && { description: data.description }),
                    })
                }

                default: {
                    return await axiosInstance.put('/issue-worklog', {
                        issueId: data.issueId,
                        id: data.id,
                        started: dayjs(data.startDate).format('YYYY-MM-DDTHH:mm:ss.SSSZZ'),
                        timeSpentSeconds:
                            data.timeSpentSeconds || convertJiraTimeToSeconds(data.timeSpent, workingDaysPerWeek, workingHoursPerDay),
                        ...(data.description && worklogCommentTemplate(data.description ?? '')),
                    })
                }
            }
        },
        onMutate: props?.onMutate,
        onSuccess: props?.onSuccess,
        onError: props?.onError,
    })
}
