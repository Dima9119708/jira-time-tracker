import { InfiniteData, useMutation, useQueryClient } from '@tanstack/react-query'
import { axiosInstance } from '../../../shared/config/api/api'
import { produce } from 'immer'
import { AxiosError, AxiosResponse } from 'axios'
import { ErrorType } from '../../../shared/types/Jira/ErrorType'
import { ChangeStatusTaskProps } from '../types/types'
import { useNotifications } from 'react-app/shared/lib/hooks/useNotifications'
import { IssueResponse, Status, Transition } from 'react-app/shared/types/Jira/Issues'
import { StatusesByIssueDropdown } from 'react-app/entities/Issues'

const ChangeStatusIssue = (props: ChangeStatusTaskProps) => {
    const { issueId, queryKey, status, issueName, position, disabled, idxPage, idxIssue, trigger, onChange } = props

    const queryClient = useQueryClient()

    const notify = useNotifications()

    const { mutate } = useMutation<
        AxiosResponse<Status>,
        AxiosError<ErrorType>,
        Transition,
        { dismissFn: Function; oldState: InfiniteData<IssueResponse> | IssueResponse['issues'] | undefined; notificationMessage: string }
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
                (old: InfiniteData<IssueResponse> | IssueResponse['issues']): InfiniteData<IssueResponse> | IssueResponse['issues'] => {
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
                oldState: queryClient.getQueryData<InfiniteData<IssueResponse> | IssueResponse['issues']>([queryKey]),
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
        <StatusesByIssueDropdown
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
