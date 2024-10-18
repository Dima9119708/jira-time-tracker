import { useMutation, useQueryClient } from '@tanstack/react-query'
import { axiosInstance } from '../../../shared/config/api/api'
import AssignableIssue from '../../../entities/AssignableIssue/ui/AssignableIssue'
import { Assignee, IssueResponse, IssuesTrackingResponse } from '../../../pages/Issues/types/types'
import { AxiosError, AxiosResponse } from 'axios'
import { ErrorType } from '../../../shared/types/jiraTypes'
import { InfiniteData } from '@tanstack/react-query/build/modern/index'
import { produce } from 'immer'
import { ChangeAssigneeProps } from '../types/types'
import { useNotifications } from 'react-app/shared/lib/hooks/useNotifications'

const ChangeAssigneeIssue = (props: ChangeAssigneeProps) => {
    const { issueKey, idxIssue, issueName, idxPage, assignee, queryKey, position = 'bottom-start' } = props

    const queryClient = useQueryClient()

    const notify = useNotifications()

    const { mutate } = useMutation<
        AxiosResponse<Assignee>,
        AxiosError<ErrorType>,
        Assignee,
        { dismissFn: Function; oldState: InfiniteData<IssueResponse> | IssuesTrackingResponse | undefined; notificationMessage: string }
    >({
        mutationFn: (variables) =>
            axiosInstance.put<Assignee>('/issue-assignee', { accountId: variables.accountId }, { params: { id: issueKey } }),
        onMutate: async (variables) => {
            await queryClient.cancelQueries({ queryKey: [queryKey] })

            queryClient.setQueryData(
                [queryKey],
                (old: InfiniteData<IssueResponse> | IssuesTrackingResponse): InfiniteData<IssueResponse> | IssuesTrackingResponse => {
                    if (Array.isArray(old)) {
                        return produce(old, (draft) => {
                            draft[idxIssue].fields.assignee = variables
                        })
                    } else {
                        return produce(old, (draft) => {
                            draft.pages[idxPage!].issues[idxIssue].fields.assignee = variables
                        })
                    }
                }
            )

            const notificationMessage = `from ${assignee?.displayName ?? 'Unassigned'} to ${variables.displayName}`

            const dismissFn = notify.loading({
                title: 'Assignee changes',
                description: notificationMessage,
            })

            return {
                oldState: queryClient.getQueryData<InfiniteData<IssueResponse> | IssuesTrackingResponse>([queryKey]),
                dismissFn,
                notificationMessage,
            }
        },
        onSuccess: (data, variables, context) => {
            context!.dismissFn()
            notify.success({
                title: 'Assignee changes',
                description: context!.notificationMessage,
            })

            //  TODO ????
            // queryClient.invalidateQueries({ queryKey: [queryKey] })
        },
        onError: (error, variables, context) => {
            context!.dismissFn()

            notify.error({
                title: 'Assignee changes',
                description: JSON.stringify(error.response?.data),
            })

            queryClient.setQueryData([queryKey], context!.oldState)
        },
    })

    return (
        <AssignableIssue
            assignee={assignee}
            issueKey={issueKey}
            onChange={mutate}
            position={position}
        />
    )
}

export default ChangeAssigneeIssue
