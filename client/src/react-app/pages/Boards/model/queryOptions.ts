import { queryOptions } from '@tanstack/react-query'
import { axiosInstance } from '../../../shared/config/api/api'
import { Boards } from '../types/types'

export const queryGetBoards = (id: string) =>
    queryOptions({
        queryKey: ['boards'],
        queryFn: () =>
            axiosInstance.get<Boards>('/boards', {
                params: {
                    id: id,
                },
            }),
        select: (data) => data.data,
        staleTime: 1000,
    })
