import { PLUGINS, useGlobalState } from 'react-app/shared/lib/hooks/useGlobalState'
import { MutationKey, useMutation, UseMutationOptions } from '@tanstack/react-query'
import { axiosInstance, axiosInstancePlugin } from 'react-app/shared/config/api/api'
import { AxiosError, AxiosResponse } from 'axios'
import { CreateIssueWorklog } from 'react-app/entities/IssueWorklogs/api/useIssueWorklogPOST'

export interface DeleteIssueWorklog extends Partial<CreateIssueWorklog> {
    issueId: string
    id: string
    customFields?: {
        isRefetchWorklogsAfterDelete?: boolean
    }
}

export interface UseIssueWorklogDELETE<MutateReturn>  extends UseMutationOptions<AxiosResponse<DeleteIssueWorklog>, AxiosError, DeleteIssueWorklog, MutateReturn> {
    prefetch?: () => Promise<void>
}

export const useIssueWorklogDELETE = <MutateReturn>(props?: UseIssueWorklogDELETE<MutateReturn>) => {

    return useMutation({
        mutationFn: async (data: DeleteIssueWorklog) => {
            await props?.prefetch?.()

            const pluginName = useGlobalState.getState().settings.plugin

            switch (pluginName) {
                case PLUGINS.TEMPO: {
                    return await axiosInstancePlugin.delete('/issue-worklog/plugin', {
                        params: {
                            id: data.id,
                        },
                    })
                }

                default: {
                    return await axiosInstance.delete('/issue-worklog', {
                        params: {
                            issueId: data.issueId,
                            id: data.id,
                        },
                    })
                }
            }
        },
        ...props
    })
}
