import { queryOptions, infiniteQueryOptions } from '@tanstack/react-query'
import { axiosInstance } from '../../../shared/config/api/api'
import { TasksResponse } from '../types/types'
import { useGlobalState } from '../../../shared/lib/hooks/useGlobalState'

export const queryGetTasksTracking = () =>
    queryOptions({
        queryKey: ['tasks tracking'],
        queryFn: async (context) => {
            const tasksIDS = useGlobalState.getState().getSearchParamsIds()

            if (tasksIDS) {
                const lengthTasks = tasksIDS.split(',').length

                const MAX_RESULTS = lengthTasks + 1

                const response = await axiosInstance.get<TasksResponse>('/tracking-tasks', {
                    params: {
                        jql: `id in (${tasksIDS})`,
                        startAt: 0,
                        maxResults: MAX_RESULTS,
                    },
                    signal: context.signal,
                })

                return response.data
            }

            return {
                issues: [],
            }
        },
    })

export const queryGetTasks = () =>
    infiniteQueryOptions({
        queryKey: ['tasks'],
        queryFn: async (context) => {
            const MAX_RESULTS = 20

            const response = await axiosInstance.get<TasksResponse>('/tasks', {
                params: {
                    jql: useGlobalState.getState().jql,
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
