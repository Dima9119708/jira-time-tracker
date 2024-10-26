import { PLUGINS, useGlobalState } from 'react-app/shared/lib/hooks/useGlobalState'
import { useMutation } from '@tanstack/react-query'
import { axiosInstance, axiosInstancePlugin } from 'react-app/shared/config/api/api'
import { AxiosError, AxiosResponse } from 'axios'
import { CreateIssueWorklog } from 'react-app/entities/IssueWorklogs/api/useIssueWorklogPOST'

export interface DeleteIssueWorklog extends Partial<CreateIssueWorklog> {
    issueId: string
    id: string
}

export const useIssueWorklogDELETE = <MutateReturn>(props?: {
    onMutate?: (variables: DeleteIssueWorklog) => MutateReturn
    onSuccess: (data: AxiosResponse<any, any>, variables: DeleteIssueWorklog, context: MutateReturn | undefined) => void
    onError: (error: AxiosError, variables: DeleteIssueWorklog, context: MutateReturn | undefined) => void
}) => {
    const pluginName = useGlobalState((state) => state.settings.plugin)

    return useMutation({
        mutationFn: async (data: DeleteIssueWorklog) => {
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
        onMutate: props?.onMutate,
        onSuccess: props?.onSuccess,
        onError: props?.onError,
    })
}
