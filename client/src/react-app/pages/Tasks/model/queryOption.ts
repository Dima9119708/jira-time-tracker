import { queryOptions } from '@tanstack/react-query'
import { axiosInstance } from '../../../shared/config/api/api'
import { Tasks } from '../types/types'

export const queryGetBoardColumns = (id: string) =>
    queryOptions({
        queryKey: ['board columns', id],
        queryFn: () =>
            axiosInstance.get<Tasks>('/board/configuration', {
                params: {
                    id,
                },
            }),
        select: (data) => {
            return {
                defaultColumn: data.data.columnConfig.columns[0].name,
                columns: data.data.columnConfig.columns,
            }
        },
    })
