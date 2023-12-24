import { queryOptions, infiniteQueryOptions } from '@tanstack/react-query'
import { axiosInstance } from '../../../shared/config/api/api'
import { Filters } from '../types/types'
import { TasksResponse } from '../../Tasks/types/types'

export const queryGetFilter = () =>
    queryOptions({
        queryKey: ['filters'],
        queryFn: () => axiosInstance.get<Filters[]>('/filters'),
        select: (data) => data.data,
        staleTime: 1000,
    })

export const queryGetTasks = (jql: string) =>
    infiniteQueryOptions({
        queryKey: ['tasks'],
        queryFn: async (context) => {
            const MAX_RESULTS = 5

            const response = await axiosInstance.get<TasksResponse>('/tasks', {
                params: {
                    jql,
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
    })
