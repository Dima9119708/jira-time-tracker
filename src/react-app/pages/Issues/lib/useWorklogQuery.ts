import { useQueryClient } from '@tanstack/react-query'
import { useCallback, useEffect, useRef } from 'react'
import dayjs from 'dayjs'
import { produce } from 'immer'
import { IssuesTrackingResponse, UseWorklogQuery } from '../types/types'
import { AxiosError } from 'axios'
import { useGlobalState } from '../../../shared/lib/hooks/useGlobalState'
import { TimerRef } from '../../../features/Timer/ui/Timer'
import { useNotifications } from 'react-app/shared/lib/hooks/useNotifications'
import { useIssueWorklogPOST, useIssueWorklogsGET, useIssueWorklogPUT } from 'react-app/entities/IssueWorklogs'

export const useWorklogQuery = (props: UseWorklogQuery) => {
    const { taskId } = props

    const queryClient = useQueryClient()

    const timerRef = useRef<TimerRef>(null)

    const notify = useNotifications()

    const settingTimeSecond = useGlobalState((state) => state.settings.timeLoggingInterval.second)
    const isSystemIdle = useGlobalState((state) => state.isSystemIdle)

    const onMutateQuery = useCallback(() => {
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
    }, [taskId])

    const onError = useCallback((error: AxiosError, context: ReturnType<typeof onMutateQuery> | undefined) => {
        queryClient.setQueryData(['tasks tracking'], context!.oldState)

        notify.error({
            title: `Error worklog issue`,
            description: JSON.stringify(error.response?.data),
        })
    }, [])

    const issueWorklogPUT = useIssueWorklogPUT({
        onMutate: onMutateQuery,
        onError: (error, variables, context) => {
            onError(error, context)
        },
    })

    const issueWorklogPOST = useIssueWorklogPOST({
        onMutate: onMutateQuery,
        onError: (error, variables, context) => {
            onError(error, context)
        },
    })

    const issueWorklogsGET = useIssueWorklogsGET({
        issueId: taskId,
        to: dayjs().format('YYYY-MM-DD'),
        from: dayjs().format('YYYY-MM-DD'),
        enabled: false,
    })

    const intervalTriggerCallback = useCallback(() => {
        issueWorklogsGET
            .refetch()
            .then((worklogs) => {
                if (worklogs.data && worklogs.data.length > 0) {
                    const worklog = worklogs?.data[0]
                    const worklogSecond = worklog.timeSpentSeconds

                    const timeSpentSeconds = worklogSecond + settingTimeSecond

                    issueWorklogPUT.mutate({
                        issueId: taskId,
                        id: worklog.id,
                        startDate: worklog.date,
                        timeSpentSeconds,
                        timeSpent: '',
                    })
                } else {
                    const timeSpentSeconds = settingTimeSecond

                    issueWorklogPOST.mutate({
                        issueId: taskId,
                        timeSpentSeconds,
                        timeSpent: '',
                    })
                }
            })
            .catch(() => {})
    }, [])

    useEffect(() => {
        return timerRef.current?.setIntervalTrigger(settingTimeSecond, intervalTriggerCallback)
    }, [settingTimeSecond])

    useEffect(() => {
        if (isSystemIdle) {
            timerRef.current?.pause()
        } else {
            timerRef.current?.play()
        }
    }, [isSystemIdle])

    return timerRef
}
