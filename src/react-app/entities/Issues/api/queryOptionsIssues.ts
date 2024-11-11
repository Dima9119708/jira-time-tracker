import { queryOptions, infiniteQueryOptions, InfiniteData, QueryKey, UseInfiniteQueryOptions } from '@tanstack/react-query'
import { axiosInstance } from '../../../shared/config/api/api'
import { useGlobalState } from '../../../shared/lib/hooks/useGlobalState'
import { AxiosError } from 'axios'
import { ErrorType } from '../../../shared/types/Jira/ErrorType'
import { IssueResponse, Issue } from 'react-app/shared/types/Jira/Issues'

export const queryGetIssuesTracking = (args: { onReject?: (reject: AxiosError<ErrorType>) => void }) =>
    queryOptions<IssueResponse['issues']>({
        queryKey: ['issues tracking'],
        queryFn: async (context) => {
            const tasksIDS = useGlobalState.getState().getIssueIdsSearchParams()

            if (tasksIDS) {
                const responses = await Promise.allSettled(
                    tasksIDS.split(',').map((id) => axiosInstance.get<Issue>('/issue', { params: { id }, signal: context.signal }))
                )

                return responses.reduce<IssueResponse['issues']>((acc, response) => {
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

interface QueryGetIssuesOptions {
    queryKey?: UseInfiniteQueryOptions['queryKey']
    jql: string,
    onFilteringIssues?: (data: IssueResponse) => IssueResponse
    enabled?: UseInfiniteQueryOptions['enabled']
    maxResults?: number,
    gcTime?: UseInfiniteQueryOptions['gcTime']
}

export const queryGetIssues = (options: QueryGetIssuesOptions) => {
    const { queryKey = ['issues'], onFilteringIssues, jql, maxResults = 20, ...queryOptions } = options

    return infiniteQueryOptions<IssueResponse, AxiosError<ErrorType>, InfiniteData<IssueResponse>, QueryKey, number>({
        queryKey: queryKey,
        queryFn: async (context) => {
            const MAX_RESULTS = maxResults

            const response = await axiosInstance.get<IssueResponse>('/issues', {
                params: {
                    jql: jql,
                    startAt: context.pageParam * MAX_RESULTS,
                    maxResults: MAX_RESULTS,
                },
                signal: context.signal,
            })

            if (typeof onFilteringIssues === 'function') {
                return onFilteringIssues(response.data)
            }

            return response.data
        },
        getNextPageParam: (lastPage, allPages, lastPageParam, allPageParams) => {
            if (lastPage.issues.length > 0) {
                return lastPageParam + 1
            } else {
                return null
            }
        },
        initialPageParam: 0,
        enabled: queryOptions.enabled,
        gcTime: queryOptions.gcTime,
    })
}

