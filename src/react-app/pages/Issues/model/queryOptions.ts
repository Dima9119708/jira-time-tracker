import { queryOptions, infiniteQueryOptions, InfiniteData, QueryKey } from '@tanstack/react-query'
import { axiosInstance } from '../../../shared/config/api/api'
import { Issue, IssueResponse, IssuesTrackingResponse } from '../types/types'
import { useGlobalState } from '../../../shared/lib/hooks/useGlobalState'
import { AxiosError } from 'axios'
import { ErrorType } from '../../../shared/types/jiraTypes'

export const queryGetIssuesTracking = (args: { onReject?: (reject: AxiosError<ErrorType>) => void }) =>
    queryOptions<IssuesTrackingResponse>({
        queryKey: ['tasks tracking'],
        queryFn: async (context) => {
            const tasksIDS = useGlobalState.getState().getIssueIdsSearchParams()

            if (tasksIDS) {
                const responses = await Promise.allSettled(
                    tasksIDS.split(',').map((id) => axiosInstance.get<Issue>('/issue', { params: { id }, signal: context.signal }))
                )

                return responses.reduce<IssuesTrackingResponse>((acc, response) => {
                    if (response.status === 'fulfilled') {
                        acc.push(response.value.data)
                    }

                    if (response.status === 'rejected') {
                        const reject = response.reason as AxiosError<ErrorType>

                        useGlobalState.getState().changeIssueIdsSearchParams('delete', response.reason.config.params.id)

                        if (args.onReject) {
                            args.onReject(reject)
                        }
                    }

                    return acc
                }, [])
            }

            return []
        },
    })

export const queryGetIssues = () =>
    infiniteQueryOptions<IssueResponse, AxiosError<ErrorType>, InfiniteData<IssueResponse>, QueryKey, number>({
        queryKey: ['tasks'],
        queryFn: async (context) => {
            const MAX_RESULTS = 20

            const tasksIDS = useGlobalState.getState().getIssueIdsSearchParams()

            const response = await axiosInstance.get<IssueResponse>('/tasks', {
                params: {
                    jql: useGlobalState.getState().jql,
                    startAt: context.pageParam * MAX_RESULTS,
                    maxResults: MAX_RESULTS,
                },
                signal: context.signal,
            })

            return {
                ...response.data,
                issues: response.data.issues.filter((issue) => !tasksIDS.includes(issue.id)),
            }
        },
        getNextPageParam: (lastPage, allPages, lastPageParam, allPageParams) => {
            if (lastPage.issues.length > 0) {
                return lastPageParam + 1
            } else {
                return null
            }
        },
        initialPageParam: 0,
    })
