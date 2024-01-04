import { useMutation, useQueryClient } from '@tanstack/react-query'
import { axiosInstance } from '../../../shared/config/api/api'
import AssignableIssue from '../../../entities/AssignableIssue/ui/AssignableIssue'
import { Assignee, IssueResponse, IssuesTrackingResponse } from '../../../pages/Issues/types/types'
import { AxiosError, AxiosResponse } from 'axios'
import { ErrorType } from '../../../shared/types/jiraTypes'
import { InfiniteData } from '@tanstack/react-query/build/modern/index'
import { notifications } from '@mantine/notifications'
import { NOTIFICATION_AUTO_CLOSE, NOTIFICATION_VARIANT } from '../../../shared/const/notifications'
import { produce } from 'immer'
import { ChangeAssigneeProps } from '../types/types'
import { IconCheck } from '@tabler/icons-react'
import { rem } from '@mantine/core'

const ChangeAssigneeIssue = (props: ChangeAssigneeProps) => {
    const { issueKey, idxIssue, issueName, idxPage, assignee, children, queryKey, position = 'bottom-start' } = props

    const queryClient = useQueryClient()

    const { mutate } = useMutation<
        AxiosResponse<Assignee>,
        AxiosError<ErrorType>,
        Assignee,
        { notificationId: string; oldState: InfiniteData<IssueResponse> | IssuesTrackingResponse | undefined; notificationMessage: string }
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

            const notificationId = notifications.show({
                title: 'Assignee changes',
                message: notificationMessage,
                loading: true,
            })

            return {
                oldState: queryClient.getQueryData<InfiniteData<IssueResponse> | IssuesTrackingResponse>([queryKey]),
                notificationId,
                notificationMessage,
            }
        },
        onSuccess: (data, variables, context) => {
            notifications.update({
                id: context!.notificationId,
                autoClose: NOTIFICATION_AUTO_CLOSE,
                loading: false,
                icon: <IconCheck style={{ width: rem(18), height: rem(18) }} />,
                message: context!.notificationMessage,
            })

            //  TODO ????
            // queryClient.invalidateQueries({ queryKey: [queryKey] })
        },
        onError: (error, variables, context) => {
            notifications.hide(context!.notificationId)

            notifications.show({
                title: `Error issue "${issueName}"`,
                message: error.response?.data.errorMessages.join(', '),
                ...NOTIFICATION_VARIANT.ERROR,
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
            children={children}
        />
    )
}

export default ChangeAssigneeIssue
