import { axiosInstance } from 'react-app/shared/config/api/api'
import { QueryClient } from '@tanstack/react-query'
import { STATIC_FILTER_NAME } from 'react-app/shared/const'
import { FilterResponse } from 'react-app/shared/types/Jira/Filter'

export const filterSearchGET = async (queryClient: QueryClient, filterValue: string) => {
    return await queryClient.fetchQuery<FilterResponse>({
        queryKey: ['filter search', filterValue],
        queryFn: async () => {
            const response = await axiosInstance.get<FilterResponse>('/filter/search', {
                params: {
                    filterName: STATIC_FILTER_NAME,
                    expand: 'jql,description',
                },
            })

            return response.data
        },
    })
}
