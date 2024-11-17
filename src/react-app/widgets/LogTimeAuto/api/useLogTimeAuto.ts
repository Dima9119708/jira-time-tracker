import { onlineManager, useQueryClient } from '@tanstack/react-query'
import { useCallback, useEffect, useRef, useSyncExternalStore } from 'react'
import dayjs from 'dayjs'
import { produce } from 'immer'
import { AxiosError } from 'axios'
import { useGlobalState } from '../../../shared/lib/hooks/useGlobalState'
import { useNotifications } from 'react-app/shared/lib/hooks/useNotifications'
import { TimerRef } from 'react-app/shared/components/Timer'
import { Issue, IssueResponse } from 'react-app/shared/types/Jira/Issues'
import { useWorklogCrud } from 'react-app/features/WorklogCrud'
import { CreateIssueWorklog } from 'react-app/entities/IssueWorklogs/api/useIssueWorklogPOST'
import { useFavoriteStore } from 'react-app/features/FavoriteIssue'
import { InfiniteData } from '@tanstack/react-query/build/modern/index'
import { usePersistLostTime } from 'react-app/features/PersistLostTime/model/usePersistLostTime'

export const useLogTimeAuto = (issueId: string) => {
    const queryClient = useQueryClient()

    const timerRef = useRef<TimerRef>(null)
    const prevCurrentOnlineState = useRef<boolean[]>([])

    const { add } = usePersistLostTime(issueId)

    const isOnline = useSyncExternalStore(
        (onStoreChange) => onlineManager.subscribe(onStoreChange),
        () => onlineManager.isOnline()
    )

    const settingTimeSecond = useGlobalState((state) => state.settings.timeLoggingInterval.second)
    const isTimeLoggingPaused = useGlobalState((state) => state.isTimeLoggingPaused)
    const isIdleWithInsufficientActivity = useGlobalState((state) => state.isIdleWithInsufficientActivity)

    const queryKeys = useCallback(() => {
        return [...useFavoriteStore.getState().favorites.map(({ name }) => `favorite group ${name}`), 'issues tracking']
    }, [])

    const onMutateQuery = useCallback(
        (variables: CreateIssueWorklog) => {
            const oldStates: Array<[string, InfiniteData<IssueResponse> | IssueResponse['issues']]> = []


            for (const queryKey of queryKeys()) {
                const oldState = queryClient.getQueryData<IssueResponse['issues']>([queryKey])

                if (oldState) {
                    queryClient.setQueryData([queryKey], (old: IssueResponse['issues']): IssueResponse['issues'] => {
                        return produce(old, (issues) => {
                            for (const issue of issues) {
                                const findIssue = issue.id === variables.issueId

                                if (findIssue) {
                                    if (issue.fields.timespent === null) {
                                        issue.fields.timespent = 0
                                    }
                                    issue.fields.timespent += settingTimeSecond

                                    break
                                }
                            }
                        })
                    })

                    oldStates.push([queryKey, oldState])
                }
            }

            return oldStates
        },
        [issueId]
    )

    const onError = useCallback(
        (error: AxiosError, variables: CreateIssueWorklog, context: ReturnType<typeof onMutateQuery> | undefined) => {
            if (Array.isArray(context)) {
                for (const [queryKey, oldState] of context) {
                    queryClient.setQueryData([queryKey], (old: IssueResponse['issues']): IssueResponse['issues'] => {
                        return produce(old, (draft) => {
                            Object.assign(draft, oldState)
                        })
                    })
                }
            }
        },
        []
    )

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

    useEffect(() => {
        if (worklogPUT.error !== null || worklogPOST.error !== null) {
            add(settingTimeSecond)
        }
    }, [worklogPUT.error, worklogPOST.error, settingTimeSecond])

    const intervalTriggerCallback = useCallback(async () => {
       await issueWorklogs
            .refetch()
            .then((worklogs) => {
                if (worklogs.error !== null) return add(settingTimeSecond)

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
                        description: worklog.description,
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
    }, [settingTimeSecond])

    useEffect(() => {
        return timerRef.current?.setIntervalTrigger(settingTimeSecond, intervalTriggerCallback)
    }, [settingTimeSecond])

    useEffect(() => {
        if (!isOnline || isTimeLoggingPaused) {
            timerRef.current?.pause()
        } else {
            if (!prevCurrentOnlineState.current[0] && isIdleWithInsufficientActivity) {
                timerRef.current?.pause()
            } else {
                timerRef.current?.play()
            }
        }

        return () => {
            if (prevCurrentOnlineState.current.length > 1) {
                prevCurrentOnlineState.current.splice(0, 1)
            }

            if (prevCurrentOnlineState.current.length === 0) {
                prevCurrentOnlineState.current.push(isOnline, isOnline)
            } else {
                prevCurrentOnlineState.current.push(isOnline)
            }
        }

    }, [isTimeLoggingPaused, isOnline, isIdleWithInsufficientActivity])

    return timerRef
}
