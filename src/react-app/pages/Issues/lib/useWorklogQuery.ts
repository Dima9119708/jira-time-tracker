import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useRef } from 'react'
import { axiosInstance } from '../../../shared/config/api/api'
import dayjs from 'dayjs'
import { produce } from 'immer'
import { IssuesTrackingResponse, MySelfResponse, UseWorklogQuery, WorklogIssueMutation, WorklogResponse } from '../types/types'
import { AxiosError, AxiosResponse } from 'axios'
import { ErrorType } from '../../../shared/types/jiraTypes'
import { notifications } from '@mantine/notifications'
import { NOTIFICATION_VARIANT } from '../../../shared/const/notifications'
import { useGlobalState } from '../../../shared/lib/hooks/useGlobalState'
import { TimerRef } from '../../../features/Timer/ui/Timer'

export const useWorklogQuery = (props: UseWorklogQuery) => {
    const { taskId } = props

    const queryClient = useQueryClient()

    const timerRef = useRef<TimerRef>(null)

    const settingTimeSecond = useGlobalState((state) => state.settings.timeLoggingInterval.second)
    const isSystemIdle = useGlobalState((state) => state.isSystemIdle)

    const mutation = useMutation<
        AxiosResponse<WorklogIssueMutation>,
        AxiosError<ErrorType>,
        WorklogIssueMutation,
        { oldState: IssuesTrackingResponse | undefined }
    >({
        mutationFn: (variables) => {
            if (variables.id) return axiosInstance.put<WorklogIssueMutation>('/worklog-task', variables)
            else return axiosInstance.post<WorklogIssueMutation>('/worklog-task', variables)
        },
        onMutate: () => {
            queryClient.setQueryData(['tasks tracking'], (old: IssuesTrackingResponse): IssuesTrackingResponse => {
                return produce(old, (draft) => {
                    const task = draft.find((issue) => issue.id === taskId)

                    if (task) {
                        task.fields.timespent += settingTimeSecond
                    }
                })
            })

            return {
                oldState: queryClient.getQueryData(['tasks tracking']),
            }
        },
        onError: (error, variables, context) => {
            queryClient.setQueryData(['tasks tracking'], context!.oldState)

            notifications.show({
                title: `Error worklog issue`,
                message: error.response?.data?.errorMessages?.join(', '),
                ...NOTIFICATION_VARIANT.ERROR,
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

                const timeSpentSeconds = worklogSecond + settingTimeSecond

                if (myFirstWorklogToday) {
                    mutation.mutate({
                        taskId,
                        timeSpentSeconds,
                        id: myFirstWorklogToday.id,
                    })
                } else {
                    mutation.mutate({
                        taskId,
                        timeSpentSeconds,
                    })
                }
            }

            return true
        },
        gcTime: 0,
        enabled: false,
        notifyOnChangeProps: ['error'],
    })

    useEffect(() => {
        return timerRef.current?.setIntervalTrigger(settingTimeSecond, worklogQuery.refetch)!
    }, [settingTimeSecond])

    useEffect(() => {
        if (isSystemIdle) {
            timerRef.current?.pause()
        } else {
            timerRef.current?.play()
        }
    }, [isSystemIdle])

    useEffect(() => {
        if (worklogQuery.error) {
            notifications.show({
                title: `Error worklog issue`,
                message: worklogQuery.error.response?.data?.errorMessages?.join(', '),
                ...NOTIFICATION_VARIANT.ERROR,
            })
        }
    }, [worklogQuery])

    return timerRef
}
