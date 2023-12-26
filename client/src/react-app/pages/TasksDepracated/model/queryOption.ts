import { queryOptions } from '@tanstack/react-query'
import { axiosInstance } from '../../../shared/config/api/api'
import { TasksResponse } from '../types/types'

export const queryGetTasks = (id: string, keys: string | null) =>
    queryOptions({
        queryKey: ['tasks'],
        queryFn: ({ signal }) =>
            axiosInstance
                .get<TasksResponse>('/tasks', {
                    params: {
                        id,
                        keys,
                    },
                    signal,
                })
                .then((data) => data.data),
        gcTime: 0,
    })

export const queryGetTasksTracking = (id: string, keys: string) =>
    queryOptions({
        queryKey: ['tracking tasks'],
        queryFn: ({ signal }) => {
            if (keys.length) {
                return axiosInstance
                    .get<TasksResponse>('/tracking-tasks', {
                        params: {
                            id,
                            keys,
                        },
                        signal,
                    })
                    .then((data) => data.data)
            }

            return null
        },
        gcTime: 0,
    })
