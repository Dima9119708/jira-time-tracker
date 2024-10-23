import { Assignee } from '../../../pages/Issues/types/types'
import { DropdownMenuProps } from '@atlaskit/dropdown-menu'

export interface AssignableIssueProps {
    assignee: Assignee | null
    issueKey: string
    onChange: (assignee: Assignee) => void
    position?: DropdownMenuProps['placement']
}
