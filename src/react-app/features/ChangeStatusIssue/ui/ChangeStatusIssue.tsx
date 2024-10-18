import { InfiniteData, useMutation, useQueryClient } from '@tanstack/react-query'
import { StatusesIssue, TStatusTask } from '../../../entities/StatusesIssue'
import { axiosInstance } from '../../../shared/config/api/api'
import { produce } from 'immer'
import { IssueResponse, IssuesTrackingResponse } from '../../../pages/Issues/types/types'
import { AxiosError, AxiosResponse } from 'axios'
import { ErrorType } from '../../../shared/types/jiraTypes'
import { ChangeStatusTaskProps } from '../types/types'
import { useNotifications } from 'react-app/shared/lib/hooks/useNotifications'

const ChangeStatusIssue = (props: ChangeStatusTaskProps) => {
    const { issueId, queryKey, status, issueName, position, disabled, idxPage, idxIssue, trigger, onChange } = props

    const queryClient = useQueryClient()

    const notify = useNotifications()

    const { mutate } = useMutation<
        AxiosResponse<TStatusTask>,
        AxiosError<ErrorType>,
        TStatusTask,
        { dismissFn: Function; oldState: InfiniteData<IssueResponse> | IssuesTrackingResponse | undefined; notificationMessage: string }
    >({
        mutationFn: (variables) =>
            axiosInstance.post('/change-status-task', {
                taskId: issueId,
                transitionId: variables.id,
            }),
        onMutate: async (variables) => {
            await queryClient.cancelQueries({ queryKey: [queryKey] })

            queryClient.setQueryData(
                [queryKey],
                (old: InfiniteData<IssueResponse> | IssuesTrackingResponse): InfiniteData<IssueResponse> | IssuesTrackingResponse => {
                    if (Array.isArray(old)) {
                        return produce(old, (draft) => {
                            draft[idxIssue].fields.status = variables.to
                        })
                    } else {
                        return produce(old, (draft) => {
                            draft.pages[idxPage!].issues[idxIssue].fields.status = variables.to
                        })
                    }
                }
            )

            if (typeof onChange === 'function') {
                onChange()
            }
            const notificationMessage = `from ${status.name} to ${variables.name}`
            const dismissFn = notify.loading({
                title: 'Status changes',
                description: notificationMessage,
            })

            return {
                dismissFn,
                notificationMessage,
                oldState: queryClient.getQueryData<InfiniteData<IssueResponse> | IssuesTrackingResponse>([queryKey]),
            }
        },
        onSuccess: (data, variables, context) => {
            context?.dismissFn()
            notify.success({
                title: 'Status changes',
                description: context!.notificationMessage,
            })

            // TODO => ???
            // queryClient.invalidateQueries({ queryKey: [queryKey] })
        },
        onError: (error, variables, context) => {
            context?.dismissFn()

            notify.error({
                title: `Error issue ${issueName}`,
                description: JSON.stringify(error.response?.data),
            })

            queryClient.setQueryData([queryKey], context!.oldState)
        },
    })

    return (
        <StatusesIssue
            issueId={issueId}
            status={status}
            position={position}
            disabled={disabled}
            onChange={(status) => mutate(status)}
            trigger={trigger}
        />
    )
}

export default ChangeStatusIssue
