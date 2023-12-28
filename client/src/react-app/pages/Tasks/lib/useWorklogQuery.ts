import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { axiosInstance } from '../../../shared/config/api/api'
import dayjs from 'dayjs'
import { secondsToJiraFormat } from './dateHelper'
import { produce } from 'immer'
import { MySelfResponse, TasksTrackingResponse, UseWorklogQuery, WorklogResponse, WorklogTaskMutation } from '../types/types'
import { AxiosError, AxiosResponse } from 'axios'
import { ErrorType } from '../../../shared/types/jiraTypes'
import { notifications } from '@mantine/notifications'
import { NOTIFICATION_VARIANT } from '../../../shared/const/notification-variant'

const TIME_WORKLOG = 60000
const TIMESPENT = 60

export const useWorklogQuery = (props: UseWorklogQuery) => {
    const { taskId } = props
    const [enabled, setEnabled] = useState(false)

    const queryClient = useQueryClient()

    const mutation = useMutation<AxiosResponse<WorklogTaskMutation>, AxiosError<ErrorType>, WorklogTaskMutation>({
        mutationFn: (variables) => {
            if (variables.id) return axiosInstance.put<WorklogTaskMutation>('/worklog-task', variables)
            else return axiosInstance.post<WorklogTaskMutation>('/worklog-task', variables)
        },
        onMutate: () => {
            queryClient.setQueryData(['tasks tracking'], (old: TasksTrackingResponse): TasksTrackingResponse => {
                return produce(old, (draft) => {
                    const task = draft.find((issue) => issue.id === taskId)

                    if (task) {
                        task.fields.timespent += TIMESPENT
                    }
                })
            })
        },
    })

    const worklogQuery = useQuery<unknown, AxiosError<ErrorType>>({
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

                const timeSpent = secondsToJiraFormat(worklogSecond + TIMESPENT)

                if (myFirstWorklogToday) {
                    mutation.mutate({
                        taskId,
                        timeSpent,
                        id: myFirstWorklogToday.id,
                    })
                } else {
                    mutation.mutate({
                        taskId,
                        timeSpent,
                    })
                }
            }

            return true
        },
        refetchInterval: TIME_WORKLOG,
        refetchOnWindowFocus: false,
        gcTime: 0,
        enabled: enabled,
        notifyOnChangeProps: ['error'],
    })

    useEffect(() => {
        const timer = setTimeout(() => {
            setEnabled(true)
        }, TIME_WORKLOG)

        return () => clearTimeout(timer)
    }, [])

    useEffect(() => {
        if (worklogQuery.error) {
            notifications.show({
                title: `Error worklog issue`,
                message: worklogQuery.error.response?.data.errorMessages.join(', '),
                ...NOTIFICATION_VARIANT.ERROR,
            })
        }
    }, [worklogQuery])

    useEffect(() => {
        if (mutation.error) {
            notifications.show({
                title: `Error worklog issue`,
                message: mutation.error.response?.data.errorMessages.join(', '),
                ...NOTIFICATION_VARIANT.ERROR,
            })
        }
    }, [mutation.error])
}
