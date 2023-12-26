import { JQLEditorProps } from '@atlassianlabs/jql-editor/dist/types/ui/types'

export interface FilterProps {
    className?: string
    onSearch: JQLEditorProps['onSearch']
    query: JQLEditorProps['query']
}
