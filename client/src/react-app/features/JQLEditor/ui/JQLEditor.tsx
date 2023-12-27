import { JQLEditorAsync } from '@atlassianlabs/jql-editor'
import { useAutocompleteProvider } from '@atlassianlabs/jql-editor-autocomplete-rest'
import { getInitialData, getSuggestions } from '../service/service'
import { cn } from '../../../shared/lib/classNames '
import { FilterProps } from '../types/types'
import { memo } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { axiosInstance } from '../../../shared/config/api/api'
import { FilterDetails } from '../../../pages/Tasks/types/types'
import { useGlobalState } from '../../../shared/lib/hooks/useGlobalState'

const JQLEditor = (props: FilterProps) => {
    const { className } = props
    const queryClient = useQueryClient()
    const query = useGlobalState((state) => state.jql)

    const { mutate, isPending } = useMutation({
        mutationFn: () =>
            axiosInstance.put<FilterDetails>(
                '/filter-details',
                {
                    jql: useGlobalState.getState().jql,
                },
                {
                    params: {
                        id: useGlobalState.getState().filterId,
                    },
                }
            ),
        onMutate: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] })
        },
    })

    const autocompleteProvider = useAutocompleteProvider('autocomplete', getInitialData, getSuggestions)

    return (
        <div className={cn('mb-[1.5rem] [&_div_div:nth-child(1)]:bg-[var(--mantine-color-default)]', className)}>
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
        </div>
    )
}

export default memo(JQLEditor)
