import { axiosInstance } from '../../../shared/config/api/api'
import { ConfigurationTimeTrackingOptions, FilterDetails, Filters } from '../types/types'
import { LoaderFunction } from 'react-router-dom'
import { useGlobalState } from '../../../shared/lib/hooks/useGlobalState'
import { STATIC_FILTER_NAME } from '../../../shared/const'

export const loaderIssues: LoaderFunction = async () => {
    let jql = ''

    const [resFilters, resConfigTimeTrackingOptions] = await Promise.all([
        axiosInstance.get<Filters>('/filters', {
            params: {
                filterValue: STATIC_FILTER_NAME,
            },
        }),
        axiosInstance.get<ConfigurationTimeTrackingOptions>('/configuration-timetracking'),
    ])

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
    useGlobalState.getState().setWorkHoursPerWeek(resConfigTimeTrackingOptions.data.workingHoursPerDay)

    return true
}
