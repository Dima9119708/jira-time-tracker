import { JQLEditorAsync } from '@atlassianlabs/jql-editor'
import { useAutocompleteProvider } from '@atlassianlabs/jql-editor-autocomplete-rest'
import { getInitialData, getSuggestions } from '../service/service'
import { cn } from '../../../shared/lib/classNames '
import { FilterProps } from '../types/types'
import { memo } from 'react'
import { updateNotKeyIn } from '../../../shared/lib/helpers/updateNotKeyIn'

const JQLEditor = (props: FilterProps) => {
    const { className, onSearch, query } = props

    const autocompleteProvider = useAutocompleteProvider('autocomplete', getInitialData, getSuggestions)

    return (
        <div className={cn('mb-[1.5rem] [&_div_div:nth-child(1)]:bg-[var(--mantine-color-default)]', className)}>
            <JQLEditorAsync
                analyticsSource={'autocomplete'}
                query={query}
                onSearch={(jql, jast) => {
                    if (onSearch && jast.errors.length === 0) {
                        const keysTasksTracking = new URL(document.URL).searchParams.get('keysTaskTracking')
                        const newJQL = updateNotKeyIn(jql, keysTasksTracking)

                        onSearch(newJQL, jast)
                    }
                }}
                autocompleteProvider={autocompleteProvider}
                locale={'en'}
            />
        </div>
    )
}

export default memo(JQLEditor)
