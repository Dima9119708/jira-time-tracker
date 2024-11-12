import { JQLEditorAsync } from '@atlaskit/jql-editor';
import { useAutocompleteProvider } from '@atlaskit/jql-editor-autocomplete-rest';
import { getInitialData, getSuggestions } from '../service/service'
import { memo } from 'react'
import { useGlobalState } from '../../../shared/lib/hooks/useGlobalState'
import { useFilterPUT } from 'react-app/entities/Filters'
import { useQueryClient } from '@tanstack/react-query'

const JQLEditor = () => {
    const query = useGlobalState((state) => state.jql)

    const queryClient = useQueryClient()

    const filterPUT = useFilterPUT({
        titleLoading: 'Searching',
        titleSuccess: '',
        titleError: 'Filter update error',
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['issues'],
            })
        },
    })

    const autocompleteProvider = useAutocompleteProvider('autocomplete', getInitialData, getSuggestions)

    return (
        <JQLEditorAsync
            isSearching={false}
            analyticsSource={'autocomplete'}
            query={query}
            onSearch={(jql, jast) => {
                if (jast.errors.length === 0 && jast.represents !== useGlobalState.getState().jql) {
                    filterPUT.mutate({
                        jql,
                        settings: {
                            jqlUISearchModeSwitcher: 'jql',
                            jqlBasic: null,
                        }
                    })
                }
            }}
            autocompleteProvider={autocompleteProvider}
            locale={'en'}
        />
    )
}

export default memo(JQLEditor)
