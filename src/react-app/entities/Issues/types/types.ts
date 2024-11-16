import { CustomTriggerProps, DropdownMenuProps } from '@atlaskit/dropdown-menu'
import { Status, Transition } from 'react-app/shared/types/Jira/Issues'
import { xcss } from '@atlaskit/primitives'
import { ReactElement } from 'react'

export interface StatusesByIssueDropdownProps {
    issueId: string
    onChange: (status: Transition) => void
    trigger: string | ((triggerButtonProps: CustomTriggerProps<any>, isPending: boolean) => ReactElement)
    status: Status
    position?: DropdownMenuProps['placement']
    disabled?: boolean
    isPending: boolean
    xcss?: ReturnType<typeof xcss>
}
