import { JQLEditorAsync } from '@atlassianlabs/jql-editor'
import { useAutocompleteProvider } from '@atlassianlabs/jql-editor-autocomplete-rest'
import { getInitialData, getSuggestions } from '../service/service'
import { FilterProps } from '../types/types'
import { memo } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { axiosInstance } from '../../../shared/config/api/api'
import { FilterDetails } from '../../../pages/Issues/types/types'
import { useGlobalState } from '../../../shared/lib/hooks/useGlobalState'
import { AxiosError, AxiosResponse } from 'axios'
import { ErrorType } from '../../../shared/types/jiraTypes'
import { useNotifications } from 'react-app/shared/lib/hooks/useNotifications'

const JQLEditor = (props: FilterProps) => {
    const { className } = props
    const queryClient = useQueryClient()
    const query = useGlobalState((state) => state.jql)

    const notify = useNotifications()

    const { mutate, isPending } = useMutation<AxiosResponse<FilterDetails>, AxiosError<ErrorType>, void, Function>({
        mutationFn: () =>
            axiosInstance.put<FilterDetails>(
                '/filter-details',
                {
                    jql: useGlobalState.getState().jql,
                    description: useGlobalState.getState().getSettingsString(),
                },
                {
                    params: {
                        id: useGlobalState.getState().filterId,
                    },
                }
            ),
        onMutate: () => {
            return notify.loading({
                title: 'Searching',
            })
        },
        onSuccess: (data, variables, context) => {
            context?.()
        },
        onError: (error) => {
            notify.error({
                title: `Error loading issue`,
                description: JSON.stringify(error.response?.data),
            })
        },
    })

    const autocompleteProvider = useAutocompleteProvider('autocomplete', getInitialData, getSuggestions)

    return (
        <JQLEditorAsync
            isSearching={isPending}
            analyticsSource={'autocomplete'}
            query={query}
            onSearch={(jql, jast) => {
                if (jast.errors.length === 0 && jast.represents !== useGlobalState.getState().jql) {
                    useGlobalState.getState().updateJQL(jql)
                    mutate()
                }
            }}
            autocompleteProvider={autocompleteProvider}
            locale={'en'}
        />
    )
}

export default memo(JQLEditor)
