import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { axiosInstance } from '../../../shared/config/api/api'
import dayjs from 'dayjs'
import { secondsToJiraFormat } from './dateHelper'
import { produce } from 'immer'
import { MySelfResponse, IssuesTrackingResponse, UseWorklogQuery, WorklogResponse, WorklogIssueMutation } from '../types/types'
import { AxiosError, AxiosResponse } from 'axios'
import { ErrorType } from '../../../shared/types/jiraTypes'
import { notifications } from '@mantine/notifications'
import { NOTIFICATION_VARIANT } from '../../../shared/const/notifications'
import { useGlobalState } from '../../../shared/lib/hooks/useGlobalState'

export const useWorklogQuery = (props: UseWorklogQuery) => {
    const { taskId } = props
    const [enabled, setEnabled] = useState(false)

    const queryClient = useQueryClient()

    const second = useGlobalState((state) => state.settings.timeLoggingIntervalSecond)
    const millisecond = useGlobalState((state) => state.settings.timeLoggingIntervalMillisecond)

    const mutation = useMutation<AxiosResponse<WorklogIssueMutation>, AxiosError<ErrorType>, WorklogIssueMutation>({
        mutationFn: (variables) => {
            if (variables.id) return axiosInstance.put<WorklogIssueMutation>('/worklog-task', variables)
            else return axiosInstance.post<WorklogIssueMutation>('/worklog-task', variables)
        },
        onMutate: () => {
            queryClient.setQueryData(['tasks tracking'], (old: IssuesTrackingResponse): IssuesTrackingResponse => {
                return produce(old, (draft) => {
                    const task = draft.find((issue) => issue.id === taskId)

                    if (task) {
                        task.fields.timespent += second
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

                const timeSpent = secondsToJiraFormat(worklogSecond + second)

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
        refetchInterval: millisecond,
        refetchOnWindowFocus: false,
        gcTime: 0,
        enabled: enabled,
        notifyOnChangeProps: ['error'],
    })

    useEffect(() => {
        const timer = setTimeout(() => {
            setEnabled(true)
        }, millisecond)

        return () => clearTimeout(timer)
    }, [millisecond])

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
