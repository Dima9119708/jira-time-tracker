import { QueryClient } from '@tanstack/react-query'
import { axiosInstance } from '../../../shared/config/api/api'
import { FilterDetails, Filters } from '../types/types'
import { LoaderFunction } from 'react-router-dom'
import { queryGetTasks, queryGetTasksTracking } from '../model/queryOptions'
import { useGlobalState } from '../../../shared/lib/hooks/useGlobalState'
import { STATIC_FILTER_NAME } from '../../../shared/const'

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

                const newJQL = useGlobalState.getState().updateJQL(resFilterDetails.data.jql)
                const oldJQL = resFilterDetails.data.jql

                if (oldJQL !== newJQL) {
                    axiosInstance
                        .put<FilterDetails>(
                            '/filter-details',
                            {
                                jql: newJQL,
                            },
                            {
                                params: {
                                    id: filterId,
                                },
                            }
                        )
                        .catch(() => {})
                }

                jql = newJQL
            } else {
                const ids = useGlobalState.getState().getSearchParamsIds()

                const resFilterDetails = await axiosInstance.post<FilterDetails>('/filter-details', {
                    name: STATIC_FILTER_NAME,
                    description: '',
                    jql: ids ? `NOT key in (${ids})` : '',
                })

                jql = resFilterDetails.data.jql
            }

            useGlobalState.getState().updateJQL(jql)

            queryClient.prefetchInfiniteQuery(queryGetTasks())
            queryClient.prefetchQuery(queryGetTasksTracking())
        } catch (e) {}

        return true
    }
