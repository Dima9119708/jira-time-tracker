import { DropdownMenuProps } from '@atlaskit/dropdown-menu'
import { Assignee } from 'react-app/shared/types/Jira/Issues'

export interface AssignableSearchByIssueDropdownProps {
    assignee: Assignee | null
    issueKey: string
    onChange: (assignee: Assignee) => void
    position?: DropdownMenuProps['placement']
}
