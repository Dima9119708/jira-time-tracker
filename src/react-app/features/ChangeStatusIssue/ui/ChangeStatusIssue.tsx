import { InfiniteData, useMutation, useQueryClient } from '@tanstack/react-query'
import { StatusesIssue, TStatusTask } from '../../../entities/StatusesIssue'
import { axiosInstance } from '../../../shared/config/api/api'
import { produce } from 'immer'
import { IssueResponse, IssuesTrackingResponse } from '../../../pages/Issues/types/types'
import { AxiosError, AxiosResponse } from 'axios'
import { ErrorType } from '../../../shared/types/jiraTypes'
import { notifications } from '@mantine/notifications'
import { NOTIFICATION_AUTO_CLOSE, NOTIFICATION_VARIANT } from '../../../shared/const/notifications'
import { ChangeStatusTaskProps } from '../types/types'
import { IconCheck } from '@tabler/icons-react'
import { rem } from '@mantine/core'

const ChangeStatusIssue = (props: ChangeStatusTaskProps) => {
    const { issueId, queryKey, children, status, issueName, position, disabled, idxPage, idxIssue, onChange } = props

    const queryClient = useQueryClient()

    const { mutate } = useMutation<
        AxiosResponse<TStatusTask>,
        AxiosError<ErrorType>,
        TStatusTask,
        { notificationId: string; oldState: InfiniteData<IssueResponse> | IssuesTrackingResponse | undefined; notificationMessage: string }
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
            const notificationId = notifications.show({
                title: 'Status changes',
                message: notificationMessage,
                loading: true,
            })

            return {
                notificationId,
                notificationMessage,
                oldState: queryClient.getQueryData<InfiniteData<IssueResponse> | IssuesTrackingResponse>([queryKey]),
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

            // TODO => ???
            // queryClient.invalidateQueries({ queryKey: [queryKey] })
        },
        onError: (error, variables, context) => {
            notifications.hide(context!.notificationId)

            notifications.show({
                title: `Error issue ${issueName}`,
                message: JSON.stringify(error.response?.data),
                ...NOTIFICATION_VARIANT.ERROR,
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
        >
            {children}
        </StatusesIssue>
    )
}

export default ChangeStatusIssue
