import { useQueryClient } from '@tanstack/react-query'
import { useCallback, useEffect, useRef } from 'react'
import dayjs from 'dayjs'
import { produce } from 'immer'
import { AxiosError } from 'axios'
import { useGlobalState } from '../../../shared/lib/hooks/useGlobalState'
import { useNotifications } from 'react-app/shared/lib/hooks/useNotifications'
import { useIssueWorklogPOST, useIssueWorklogsGET, useIssueWorklogPUT } from 'react-app/entities/IssueWorklogs'
import { TimerRef } from 'react-app/shared/components/Timer/ui/Timer'

export const useLogTimeAuto = (issueId: string) => {
    const queryClient = useQueryClient()

    const timerRef = useRef<TimerRef>(null)

    const notify = useNotifications()

    const settingTimeSecond = useGlobalState((state) => state.settings.timeLoggingInterval.second)
    const isSystemIdle = useGlobalState((state) => state.isSystemIdle)

    const onMutateQuery = useCallback(() => {
        queryClient.setQueryData(['tasks tracking'], (old) => {
            return produce(old, (draft: any) => {
                const task = draft.find((issue: any) => issue.id === issueId)

                if (task) {
                    task.fields.timespent += settingTimeSecond
                }
            })
        })

        return {
            oldState: queryClient.getQueryData(['tasks tracking']),
        }
    }, [issueId])

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
        issueId: issueId,
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
                        issueId: issueId,
                        id: worklog.id,
                        startDate: worklog.date,
                        timeSpentSeconds,
                        timeSpent: '',
                    })
                } else {
                    const timeSpentSeconds = settingTimeSecond

                    issueWorklogPOST.mutate({
                        issueId: issueId,
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
