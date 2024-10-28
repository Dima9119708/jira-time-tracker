import { axiosInstance } from 'react-app/shared/config/api/api'
import { QueryClient } from '@tanstack/react-query'
import { STATIC_FILTER_NAME } from 'react-app/shared/const'
import { Filter } from 'react-app/shared/types/Filter'

export const filterPOST = async (queryClient: QueryClient, description: Filter['description'], jql: Filter['jql']) => {
    return await queryClient.fetchQuery<Filter>({
        queryKey: ['filter'],
        queryFn: async () => {
            const response = await axiosInstance.post<Filter>('/filter', {
                params: {
                    name: STATIC_FILTER_NAME,
                    description: description,
                    jql: jql,
                },
            })

            return response.data
        },
    })
}
