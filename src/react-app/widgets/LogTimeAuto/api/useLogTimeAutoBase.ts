import { useWorklogCrud } from 'react-app/features/WorklogCrud'
import dayjs from 'dayjs'
import { Issue } from 'react-app/shared/types/Jira/Issues'
import { useCallback, useState } from 'react'

import { useQueryClient } from '@tanstack/react-query'

export const useLogTimeAutoBase = (issueId: Issue['id'], invalidateQueries?: () => string[]) => {
    const [isFetching, setIsFetching] = useState(false)

    const queryClient = useQueryClient()

    const invalidateQueriesAfterSuccess = useCallback(async () => {
        if (typeof invalidateQueries !== 'function') return setIsFetching(false)

        await Promise.all(invalidateQueries().map((queryKey) => queryClient.invalidateQueries({
            queryKey: [queryKey],
        })))

        setIsFetching(false)
    }, [invalidateQueries])

    const { issueWorklogs, worklogPUT, worklogPOST } = useWorklogCrud({
        issueId,
        from: dayjs().startOf('day'),
        to: dayjs().endOf('day'),
        enabledGetWorklogs: false,
        enabledGetIssueWorklogs: false,
        post: {
            onMutate: () => {},
            onSuccess: () => {
                invalidateQueriesAfterSuccess()
            },
            onError: () => {
                setIsFetching(false)
            }
        },
        put: {
            onMutate: () => {},
            onSuccess: () => {
                invalidateQueriesAfterSuccess()
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
