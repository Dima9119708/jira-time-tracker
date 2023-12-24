import { useMutation, useQueryClient, InfiniteData } from '@tanstack/react-query'
import { StatusesTask, TStatusTask } from '../../../entities/StatusesTask'
import { axiosInstance } from '../../../shared/config/api/api'
import { TasksResponse } from '../../../pages/Tasks/types/types'
import { produce } from 'immer'
import { StatusesTaskProps } from '../../../entities/StatusesTask'

interface ChangeStatusTaskProps extends Omit<StatusesTaskProps, 'onChange'> {
    queryKey: string
    onChange?: () => void
    idxPage: number
    idxIssue: number
}

const ChangeStatusTask = (props: ChangeStatusTaskProps) => {
    const { id, queryKey, children, position, disabled, idxPage, idxIssue, onChange } = props

    const queryClient = useQueryClient()

    const { mutate } = useMutation({
        mutationFn: (variables: TStatusTask) =>
            axiosInstance.post('/change-status-task', {
                taskId: id,
                transitionId: variables.id,
            }),
        onMutate: async (variables) => {
            await queryClient.cancelQueries({ queryKey: [queryKey] })

            const oldState = queryClient.getQueryData<TasksResponse>([queryKey])

            queryClient.setQueryData([queryKey], (old: InfiniteData<TasksResponse>): InfiniteData<TasksResponse> => {
                return produce(old, (draft) => {
                    draft.pages[idxPage].issues[idxIssue].fields.status = variables.to
                })
            })

            if (typeof onChange === 'function') {
                onChange()
            }

            return {
                oldState,
            }
        },
        onError: (error, variables, context) => {
            queryClient.setQueryData([queryKey], context!.oldState)
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
