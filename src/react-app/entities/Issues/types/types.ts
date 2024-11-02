import { DropdownMenuProps } from '@atlaskit/dropdown-menu'
import { Status, Transition } from 'react-app/shared/types/Jira/Issues'
import { xcss } from '@atlaskit/primitives'

export interface StatusesByIssueDropdownProps {
    issueId: string
    onChange: (status: Transition) => void
    trigger: DropdownMenuProps['trigger']
    status: Status
    position?: DropdownMenuProps['placement']
    disabled?: boolean
    xcss?: ReturnType<typeof xcss>
}
