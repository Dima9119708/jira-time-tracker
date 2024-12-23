import { axiosInstance } from '../../../shared/config/api/api'
import { JQLAutocompleteResponse, JQLAutocompleteSuggestionsResponse } from '@atlaskit/jql-editor-autocomplete-rest'

export const getInitialData = async (url: string) => {
    const response = await axiosInstance.post<JQLAutocompleteResponse>(
        '/jql-search',
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
    const response = await axiosInstance.get<JQLAutocompleteSuggestionsResponse>('/jql-search', {
        params: {
            url,
        },
    })

    return response.data
}
