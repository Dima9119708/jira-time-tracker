import { QueryClient } from '@tanstack/react-query'
import { axiosInstance } from '../../../shared/config/api/api'
import { FilterDetails, Filters } from '../types/types'
import { queryGetTasks } from '../model/queryOptions'
import { LoaderFunction } from 'react-router-dom'
import { updateNotKeyIn } from '../../../shared/lib/helpers/updateNotKeyIn'

export const loaderFilters =
    (queryClient: QueryClient): LoaderFunction =>
    async ({ request }) => {
        let jql = ''

        try {
            const resFilters = await axiosInstance.get<Filters>('/filters', {
                params: {
                    filterValue: '___TimeTracking___',
                },
            })
            const keysTasksTracking = new URL(request.url).searchParams.get('keysTaskTracking')

            if (resFilters.data.values.length > 0) {
                const resFilterDetails = await axiosInstance.get<FilterDetails>('/filter-details', {
                    params: { id: resFilters.data.values[0].id },
                })

                const newJQL = updateNotKeyIn(resFilterDetails.data.jql, keysTasksTracking)
                const oldJQL = resFilterDetails.data.jql

                if (oldJQL !== newJQL) {
                    axiosInstance.put<FilterDetails>(
                        '/filter-details',
                        {
                            jql: newJQL,
                        },
                        {
                            params: {
                                id: resFilters.data.values[0].id,
                            },
                        }
                    )
                }

                jql = newJQL
            } else {
                const resFilterDetails = await axiosInstance.post<FilterDetails>('/filter-details', {
                    name: '___TimeTracking___',
                    description: '',
                    jql: keysTasksTracking ? `NOT key in (${keysTasksTracking})` : '',
                })

                jql = resFilterDetails.data.jql
            }

            queryClient.prefetchInfiniteQuery(queryGetTasks(jql))
        } catch (e) {}

        return jql
    }
