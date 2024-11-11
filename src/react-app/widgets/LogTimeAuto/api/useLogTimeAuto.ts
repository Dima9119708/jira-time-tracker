import { useQueryClient } from '@tanstack/react-query'
import { useCallback, useEffect, useRef } from 'react'
import dayjs from 'dayjs'
import { produce } from 'immer'
import { AxiosError } from 'axios'
import { useGlobalState } from '../../../shared/lib/hooks/useGlobalState'
import { useNotifications } from 'react-app/shared/lib/hooks/useNotifications'
import { TimerRef } from 'react-app/shared/components/Timer/ui/Timer'
import { Issue } from 'react-app/shared/types/Jira/Issues'
import { useWorklogCrud } from 'react-app/features/WorklogCrud'
import { CreateIssueWorklog } from 'react-app/entities/IssueWorklogs/api/useIssueWorklogPOST'

export const useLogTimeAuto = (issueId: string) => {
    const queryClient = useQueryClient()

    const timerRef = useRef<TimerRef>(null)

    const notify = useNotifications()

    const settingTimeSecond = useGlobalState((state) => state.settings.timeLoggingInterval.second)
    const isSystemIdle = useGlobalState((state) => state.isSystemIdle)

    const onMutateQuery = useCallback(() => {
        queryClient.setQueryData(['issues tracking'], (old: Issue[]) => {
            return produce(old, (draft) => {
                const task = draft.find((issue) => issue.id === issueId)

                if (task) {
                    if (task.fields.timespent === null) {
                        task.fields.timespent = 0
                    }
                    task.fields.timespent += settingTimeSecond
                }
            })
        })

        return {
            oldState: queryClient.getQueryData<Issue[]>(['issues tracking']),
        }
    }, [issueId])

    const onError = useCallback((error: AxiosError, variables: CreateIssueWorklog, context: ReturnType<typeof onMutateQuery> | undefined) => {
        queryClient.setQueryData(['issues tracking'], context!.oldState)

        notify.error({
            title: `Error worklog issue`,
            description: JSON.stringify(error.response?.data),
        })
    }, [])

    const { issueWorklogs, worklogPUT, worklogPOST } = useWorklogCrud({
        issueId,
        from: dayjs().startOf('day'),
        to: dayjs().endOf('day'),
        enabledAllNotifications: false,
        enabledGetWorklogs: false,
        enabledGetIssueWorklogs: false,
        post: {
            onMutate: onMutateQuery,
            onError: onError,
        },
        put: {
            onMutate: onMutateQuery,
            onError: onError,
        },
    })

    const intervalTriggerCallback = useCallback(() => {
        issueWorklogs
            .refetch()
            .then((worklogs) => {
                if (worklogs.data && worklogs.data.length > 0) {
                    const worklog = worklogs?.data[0]
                    const worklogSecond = worklog.timeSpentSeconds

                    const timeSpentSeconds = worklogSecond + settingTimeSecond

                    worklogPUT.mutate({
                        issueId: issueId,
                        id: worklog.id,
                        startDate: worklog.date,
                        timeSpentSeconds,
                        timeSpent: '',
                    })
                } else {
                    const timeSpentSeconds = settingTimeSecond

                    worklogPOST.mutate({
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
