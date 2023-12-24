import { QueryClient } from '@tanstack/react-query'
import { axiosInstance } from '../../../shared/config/api/api'
import { FilterDetails, Filters } from '../types/types'
import { queryGetTasks } from '../model/queryOptions'

export const loaderFilters = (queryClient: QueryClient) => async () => {
    try {
        const resFilters = await axiosInstance.get<Filters>('/filters')

        let jql = ''

        if (resFilters.data.values.length > 0) {
            const resFilterDetails = await axiosInstance.get<FilterDetails>('/filter-details', {
                params: { id: resFilters.data.values[0].id },
            })

            jql = resFilterDetails.data.jql
        } else {
            const resFilterDetails = await axiosInstance.post<FilterDetails>('/filter-details', {
                name: 'TimeTracking___',
                description: '',
                jql: '',
            })

            jql = resFilterDetails.data.jql
        }

        queryClient.prefetchInfiniteQuery(queryGetTasks(jql))
    } catch (e) {}

    return true
}
