import { StatusesTask, TStatusTask } from '../../../entities/StatusesTask'
import { memo } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { axiosInstance } from '../../../shared/config/api/api'
import { TasksResponse } from '../types/types'
import { produce } from 'immer'

interface StatusTaskProps {
    id: string
    name: string
    queryKey: string
}

const StatusTask = (props: StatusTaskProps) => {
    const { name, id, queryKey } = props

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

            queryClient.setQueryData([queryKey], (old: TasksResponse): TasksResponse => {
                const newTask = produce(old.issues, (draft) => {
                    const idx = draft.findIndex((value) => value.id === id)
                    draft[idx].fields.status.name = variables.name
                })

                return {
                    ...old,
                    issues: newTask,
                }
            })

            return {
                oldState,
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [queryKey] })
        },
        onError: (error, variables, context) => {
            queryClient.setQueryData([queryKey], context!.oldState)
        },
    })

    return (
        <StatusesTask
            id={id}
            value={name}
            onChange={(status: TStatusTask) => mutate(status)}
        />
    )
}

export default memo(StatusTask)
