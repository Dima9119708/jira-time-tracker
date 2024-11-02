import { JQLEditorAsync } from '@atlaskit/jql-editor';
import { useAutocompleteProvider } from '@atlaskit/jql-editor-autocomplete-rest';
import { getInitialData, getSuggestions } from '../service/service'
import { memo } from 'react'
import { useGlobalState } from '../../../shared/lib/hooks/useGlobalState'
import { useFilterPUT } from 'react-app/entities/Filters'
import { useQueryClient } from '@tanstack/react-query'

import { CharStreams, CommonTokenStream } from 'antlr4ts';
import { JQLLexer, JQLParser } from '@atlaskit/jql-parser';

// Create the lexer and parser
const jqlText = "project = JQL";
const charStream = CharStreams.fromString(jqlText);
const lexer = new JQLLexer(charStream);
const tokenStream = new CommonTokenStream(lexer);
const parser = new JQLParser(tokenStream);

// Parse the input, where jqlQuery is the entry point
const parsedJQLTree = parser.jqlQuery();
console.log('parsedJQLTree =>', parsedJQLTree)
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
                    })
                }
            }}
            autocompleteProvider={autocompleteProvider}
            locale={'en'}
        />
    )
}

export default memo(JQLEditor)
