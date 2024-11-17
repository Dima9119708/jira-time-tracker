import { Enabled, InfiniteData, QueryKey, useInfiniteQuery, UseInfiniteQueryOptions } from '@tanstack/react-query'
import { axiosInstance } from 'react-app/shared/config/api/api'
import { IssueResponse } from 'react-app/shared/types/Jira/Issues'
import { AxiosError } from 'axios'
import { ErrorType } from 'react-app/shared/types/Jira/ErrorType'

interface UseIssuesGetProps {
    queryKey?: UseInfiniteQueryOptions['queryKey']
    jql: string | (() => string),
    onFilteringIssues?: (data: IssueResponse) => IssueResponse
    enabled?: Enabled<IssueResponse, AxiosError<ErrorType, any>, InfiniteData<IssueResponse, number>, QueryKey>
    maxResults?: number,
    gcTime?: UseInfiniteQueryOptions['gcTime']
}

export const useIssuesGET = (props: UseIssuesGetProps) => {
    const { queryKey = ['issues'], jql, maxResults = 20, ...queryOptions } = props

    return useInfiniteQuery({
        queryKey: queryKey,
        queryFn: async (context) => {
            const MAX_RESULTS = maxResults

            const response = await axiosInstance.get<IssueResponse>('/issues', {
                params: {
                    jql: typeof jql === 'function' ? jql() : jql,
                    startAt: context.pageParam * MAX_RESULTS,
                    maxResults: MAX_RESULTS,
                },
                signal: context.signal,
            })

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
