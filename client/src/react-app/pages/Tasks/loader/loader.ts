import { QueryClient } from '@tanstack/react-query'
import { axiosInstance } from '../../../shared/config/api/api'
import { FilterDetails, Filters } from '../types/types'
import { LoaderFunction } from 'react-router-dom'
import { queryGetTasks, queryGetTasksTracking } from '../model/queryOptions'
import { useGlobalState } from '../../../shared/lib/hooks/useGlobalState'
import { STATIC_FILTER_NAME } from '../../../shared/const'
import { AxiosError } from 'axios'
import { notifications } from '@mantine/notifications'
import { NOTIFICATION_VARIANT } from '../../../shared/const/notification-variant'

export const loaderTasks =
    (queryClient: QueryClient): LoaderFunction =>
    async () => {
        let jql = ''

        try {
            const resFilters = await axiosInstance.get<Filters>('/filters', {
                params: {
                    filterValue: STATIC_FILTER_NAME,
                },
            })

            if (resFilters.data.values.length > 0) {
                const filterId = resFilters.data.values[0].id

                const resFilterDetails = await axiosInstance.get<FilterDetails>('/filter-details', {
                    params: { id: filterId },
                })

                useGlobalState.getState().setFilterId(filterId)

                jql = resFilterDetails.data.jql
            } else {
                const resFilterDetails = await axiosInstance.post<FilterDetails>('/filter-details', {
                    name: STATIC_FILTER_NAME,
                    description: '',
                    jql: '',
                })

                jql = resFilterDetails.data.jql
            }

            useGlobalState.getState().updateJQL(jql)

            queryClient.prefetchInfiniteQuery(queryGetTasks())
            queryClient.prefetchQuery(queryGetTasksTracking())
        } catch (error) {
            if (error instanceof AxiosError) {
                notifications.show({
                    title: `When the page loads`,
                    message: error.response?.data.errorMessages.join(', '),
                    ...NOTIFICATION_VARIANT.ERROR,
                })
            }
        }

        return true
    }
