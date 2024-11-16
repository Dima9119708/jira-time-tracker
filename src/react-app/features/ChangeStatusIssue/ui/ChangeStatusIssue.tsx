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
    const { issueId, queryKeys, status, issueName, position, disabled, trigger, onMutate, xcss, onSuccess } = props

    const queryClient = useQueryClient()

    const notify = useNotifications()

    const { mutate, isPending } = useMutation<
        AxiosResponse<Status>,
        AxiosError<ErrorType>,
        Transition,
        { dismissFn: Function; oldStates: Array<[string, InfiniteData<IssueResponse> | IssueResponse['issues']]> | undefined; notificationMessage: string }
    >({
        mutationFn: (variables) =>
            axiosInstance.post('/change-status-task', {
                taskId: issueId,
                transitionId: variables.id,
            }),
        onMutate: async (variables) => {

            const oldStates: Array<[string, InfiniteData<IssueResponse> | IssueResponse['issues']]>  = []

            for (const queryKey of queryKeys()) {
                await queryClient.cancelQueries({ queryKey: [queryKey] })

                const oldState = queryClient.getQueryData<InfiniteData<IssueResponse> | IssueResponse['issues']>([queryKey])

                if (oldState) {
                    queryClient.setQueryData(
                        [queryKey],
                        (old: InfiniteData<IssueResponse> | IssueResponse['issues']): InfiniteData<IssueResponse> | IssueResponse['issues'] => {
                            if (Array.isArray(old)) {
                                return produce(old, (draft) => {
                                    const issue = draft.find(({ id }) => id === issueId)

                                    if (issue) {
                                        issue.fields.status = variables.to
                                    }
                                })
                            } else {
                                return produce(old, (draft) => {
                                    for (const page of draft.pages) {
                                        const issue = page.issues.find(({ id }) => id === issueId);

                                        if (issue) {
                                            issue.fields.status = variables.to;
                                            break;
                                        }
                                    }
                                })
                            }
                        }
                    )

                    oldStates.push([queryKey, oldState])
                }
            }

            if (typeof onMutate === 'function') {
                onMutate(variables)
            }
            const notificationMessage = `from ${status.name} to ${variables.name}`
            const dismissFn = notify.loading({
                title: 'Status changes',
                description: notificationMessage,
            })

            return {
                dismissFn,
                notificationMessage,
                oldStates: oldStates,
            }
        },
        onSuccess: (data, variables, context) => {
            context?.dismissFn()
            notify.success({
                title: 'Status changes',
                description: context!.notificationMessage,
            })

            if (typeof onSuccess === 'function') {
                onSuccess()
            }
        },
        onError: (error, variables, context) => {
            context?.dismissFn()

            notify.error({
                title: `Error issue ${issueName}`,
                description: JSON.stringify(error.response?.data),
            })

            if (Array.isArray(context?.oldStates)) {
                for (const [queryKey, oldState] of context.oldStates) {
                    queryClient.setQueryData(
                        [queryKey],
                        (old: InfiniteData<IssueResponse> | IssueResponse['issues']): InfiniteData<IssueResponse> | IssueResponse['issues'] => {
                            return produce(old, (draft) => {
                                Object.assign(draft, oldState)
                            })
                        }
                    )
                }
            }
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
            xcss={xcss}
            isPending={isPending}
        />
    )
}

export default ChangeStatusIssue
