import { QueryClient } from '@tanstack/react-query'
import { electron } from 'react-app/shared/lib/electron/electron'
import { axiosInstance } from 'react-app/shared/config/api/api'
import { filterPOST, filterSearchGET } from 'react-app/entities/Filters'
import { STATIC_FILTER_NAME } from 'react-app/shared/const'
import { ConfigurationTimeTrackingOptions } from 'react-app/shared/types/Jira/TimeTracking'
import {
    useGlobalState,
} from 'react-app/shared/lib/hooks/useGlobalState'
import { redirect } from 'react-router-dom'

export const loaderAuthAppInitial = (queryClient: QueryClient) => async () => {
    try {
        const authData = await electron((methods) => methods.ipcRenderer.invoke('GET_AUTH_DATA'))

        if (authData) {
            await queryClient.fetchQuery({
                queryKey: ['myself'],
                queryFn: async () => {
                    const response = await axiosInstance.get('/myself')

                    return response.data
                },
                gcTime: Infinity,
            })

            let jql = ''

            const resFilters = await filterSearchGET(queryClient, STATIC_FILTER_NAME)

            const [resConfigTimeTrackingOptions] = await Promise.allSettled([
                axiosInstance.get<ConfigurationTimeTrackingOptions>('/configuration-timetracking'),
            ])

            if (resConfigTimeTrackingOptions.status === 'fulfilled') {
                useGlobalState.setState((state) => {
                    state.hasJiraTimeTrackingPermission = true
                    state.settings.workingDaysPerWeek = resConfigTimeTrackingOptions.value.data.workingDaysPerWeek
                    state.settings.workingHoursPerDay = resConfigTimeTrackingOptions.value.data.workingHoursPerDay
                })
            } else {
                if (resConfigTimeTrackingOptions.reason?.response?.status !== 403) {
                    throw new Error(JSON.stringify(resConfigTimeTrackingOptions.reason.response.data))
                }
            }

            if (resFilters.values.length > 0) {
                const filterDetail = resFilters.values[0]

                useGlobalState.getState().setFilterId(filterDetail.id)
                useGlobalState.getState().parseAndSaveSetting(filterDetail.description)

                jql = filterDetail.jql
            } else {
                const resFilterDetails = await filterPOST(queryClient, '', '')

                jql = resFilterDetails.jql
            }

            useGlobalState.getState().updateJQL(jql)
        } else {
            throw new Error()
        }

        return true
    } catch (error) {
        return redirect('auth')
    }
}
