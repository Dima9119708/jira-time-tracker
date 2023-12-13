import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { axiosInstance } from '../../../shared/config/api/api'
import dayjs from 'dayjs'
import { MySelfResponse, TasksResponse, UseWorklogQuery, WorklogResponse, WorklogTaskMutation } from '../types/types'
import { secondsToJiraFormat } from './dateHelper'
import { produce } from 'immer'

export const useWorklogQuery = (props: UseWorklogQuery) => {
    const { taskId } = props
    const [enabled, setEnabled] = useState(false)

    const queryClient = useQueryClient()

    const { mutate } = useMutation({
        mutationFn: (variables: WorklogTaskMutation) => {
            if (variables.id) return axiosInstance.put<{ id: string }>('/worklog-task', variables)
            else return axiosInstance.post<{ id: string }>('/worklog-task', variables)
        },
        onMutate: () => {
            queryClient.setQueryData(['tracking tasks'], (old: TasksResponse): TasksResponse => {
                return produce(old, (draft) => {
                    const task = draft.issues.find((issue) => issue.id === taskId)

                    if (task) {
                        task.fields.timespent += 60
                    }
                })
            })
        },
    })

    useQuery({
        queryKey: ['worklog', taskId],
        queryFn: async () => {
            const response = await axiosInstance.get<WorklogResponse>('/worklog-task', {
                params: { id: taskId },
            })

            const mySelf = queryClient.getQueryData<MySelfResponse>(['login'])

            if (!!mySelf) {
                const myFirstWorklogToday = response.data.worklogs.find((worklog) => {
                    if (worklog.author.accountId == mySelf.accountId) {
                        return dayjs(worklog.started).isToday()
                    }

                    return false
                })

                const worklogSecond = myFirstWorklogToday?.timeSpentSeconds ?? 0

                const timeSpent = secondsToJiraFormat(worklogSecond + 60)

                if (myFirstWorklogToday) {
                    mutate({
                        taskId,
                        timeSpent,
                        id: myFirstWorklogToday.id,
                    })
                } else {
                    mutate({
                        taskId,
                        timeSpent,
                    })
                }
            }
        },
        refetchInterval: 60000,
        refetchOnWindowFocus: false,
        gcTime: 0,
        enabled: enabled,
        notifyOnChangeProps: [],
    })

    useEffect(() => {
        const timer = setTimeout(() => {
            setEnabled(true)
        }, 60000)

        return () => clearTimeout(timer)
    }, [])
}
