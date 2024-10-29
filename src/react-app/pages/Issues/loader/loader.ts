import { axiosInstance } from '../../../shared/config/api/api'
import { LoaderFunction } from 'react-router-dom'
import { useGlobalState } from '../../../shared/lib/hooks/useGlobalState'
import { STATIC_FILTER_NAME } from '../../../shared/const'
import { filterSearchGET, filterPOST } from 'react-app/entities/Filters'
import { queryClient } from 'react-app/app/QueryClientProvide/QueryClientProvide'
import { ConfigurationTimeTrackingOptions } from 'react-app/shared/types/Jira/TimeTracking'

export const loaderIssues: LoaderFunction = async () => {
    let jql = ''

    const [resFilters, resConfigTimeTrackingOptions] = await Promise.all([
        filterSearchGET(queryClient, STATIC_FILTER_NAME),
        axiosInstance.get<ConfigurationTimeTrackingOptions>('/configuration-timetracking'),
    ])

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
    useGlobalState.getState().setWorkingDaysPerWeek(resConfigTimeTrackingOptions.data.workingDaysPerWeek)
    useGlobalState.getState().setWorkingHoursPerWeek(resConfigTimeTrackingOptions.data.workingHoursPerDay)

    return true
}
