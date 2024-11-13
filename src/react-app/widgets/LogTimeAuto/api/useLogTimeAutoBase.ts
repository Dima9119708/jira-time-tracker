import { useWorklogCrud } from 'react-app/features/WorklogCrud'
import dayjs from 'dayjs'
import { Issue, IssueResponse } from 'react-app/shared/types/Jira/Issues'
import { useCallback, useState } from 'react'
import { useGlobalState } from 'react-app/shared/lib/hooks/useGlobalState'
import { useQueryClient } from '@tanstack/react-query'

export const useLogTimeAutoBase = (issueId: Issue['id']) => {
    const [isFetching, setIsFetching] = useState(false)

    const queryClient = useQueryClient()

    const invalidateQueries = useCallback(async () => {
        await Promise.all([
            queryClient.invalidateQueries({
                queryKey: ['issues'],
            }),
            queryClient.invalidateQueries({
                queryKey: ['issues tracking'],
            }),
            ...useGlobalState.getState().settings.favorites.map(({ name }) => {
                return queryClient.invalidateQueries({
                    queryKey: [`favorite group ${name}`],
                })
            }),
        ])

        setIsFetching(false)
    }, [])

    const { issueWorklogs, worklogPUT, worklogPOST } = useWorklogCrud({
        issueId,
        from: dayjs().startOf('day'),
        to: dayjs().endOf('day'),
        enabledGetWorklogs: false,
        enabledGetIssueWorklogs: false,
        post: {
            onMutate: () => {},
            onSuccess: () => {
                invalidateQueries()
            },
            onError: () => {
                setIsFetching(false)
            }
        },
        put: {
            onMutate: () => {},
            onSuccess: () => {
                invalidateQueries()
            },
            onError: () => {
                setIsFetching(false)
            }
        }
    })

    const onLogTime = useCallback(async (timeSpentSeconds: number) => {
        const worklogs = await issueWorklogs.refetch()

        setIsFetching(true)

        if (worklogs.data && worklogs.data.length > 0) {
            const worklog = worklogs?.data[0]
            const worklogSecond = worklog.timeSpentSeconds

            const newTimeSpentSeconds = worklogSecond + timeSpentSeconds

            worklogPUT.mutate({
                issueId: issueId,
                id: worklog.id,
                startDate: worklog.date,
                timeSpentSeconds: newTimeSpentSeconds,
                timeSpent: '',
                description: worklog.description,
            })
        } else {
            worklogPOST.mutate({
                issueId: issueId,
                timeSpentSeconds: timeSpentSeconds,
                timeSpent: '',
            })
        }
    }, [])

    return {
        onLogTime,
        isLoading: issueWorklogs.isFetching || isFetching,
        isMutationSuccess: !isFetching && (worklogPUT.isSuccess || worklogPOST.isSuccess),
    }
}
