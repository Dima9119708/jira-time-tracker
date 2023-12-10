import { queryOptions } from '@tanstack/react-query'
import { axiosInstance } from '../../../shared/config/api/api'
import { Projects } from '../types/types'

export const queryGetProjects = () =>
    queryOptions({
        queryKey: ['projects'],
        queryFn: () => axiosInstance.get<Projects[]>('/projects'),
        select: (data) => data.data,
        staleTime: 1000,
    })
