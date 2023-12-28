import { InfiniteData, useMutation, useQueryClient } from '@tanstack/react-query'
import { StatusesTask, TStatusTask } from '../../../entities/StatusesTask'
import { axiosInstance } from '../../../shared/config/api/api'
import { produce } from 'immer'
import { TasksResponse, TasksTrackingResponse } from '../../../pages/Tasks/types/types'
import { AxiosError, AxiosResponse } from 'axios'
import { ErrorType } from '../../../shared/types/jiraTypes'
import { notifications } from '@mantine/notifications'
import { NOTIFICATION_VARIANT } from '../../../shared/const/notification-variant'
import { ChangeStatusTaskProps } from '../types/types'

const ChangeStatusTask = (props: ChangeStatusTaskProps) => {
    const { id, queryKey, children, position, disabled, idxPage, idxIssue, onChange } = props

    const queryClient = useQueryClient()

    const { mutate } = useMutation<AxiosResponse<TStatusTask>, AxiosError<ErrorType>, TStatusTask, TasksResponse | undefined>({
        mutationFn: (variables) =>
            axiosInstance.post('/change-status-task', {
                taskId: id,
                transitionId: variables.id,
            }),
        onMutate: async (variables) => {
            await queryClient.cancelQueries({ queryKey: [queryKey] })

            queryClient.setQueryData(
                [queryKey],
                (old: InfiniteData<TasksResponse> | TasksTrackingResponse): InfiniteData<TasksResponse> | TasksTrackingResponse => {
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

            return queryClient.getQueryData<TasksResponse>([queryKey])
        },
        onError: (error, variables, context) => {
            notifications.show({
                title: `Error issue ${id}`,
                message: error.response?.data.errorMessages.join(', '),
                ...NOTIFICATION_VARIANT.ERROR,
            })

            queryClient.setQueryData([queryKey], context)
        },
    })

    return (
        <StatusesTask
            id={id}
            position={position}
            disabled={disabled}
            onChange={(status) => mutate(status)}
        >
            {children}
        </StatusesTask>
    )
}

export default ChangeStatusTask
