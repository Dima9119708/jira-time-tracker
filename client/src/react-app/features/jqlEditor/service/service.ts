import { axiosInstance } from '../../../shared/config/api/api'
import { JQLAutocompleteResponse, JQLAutocompleteSuggestionsResponse } from '@atlassianlabs/jql-editor-autocomplete-rest'

export const getInitialData = async (url: string) => {
    const response = await axiosInstance.post<JQLAutocompleteResponse>(
        '/autocomplete',
        { includeCollapsedFields: true },
        {
            params: {
                url,
            },
        }
    )

    return {
        jqlFields: response.data.visibleFieldNames,
        jqlFunctions: response.data.visibleFunctionNames,
    }
}

export const getSuggestions = async (url: string) => {
    const response = await axiosInstance.get<JQLAutocompleteSuggestionsResponse>('/autocomplete', {
        params: {
            url,
        },
    })

    return response.data
}
