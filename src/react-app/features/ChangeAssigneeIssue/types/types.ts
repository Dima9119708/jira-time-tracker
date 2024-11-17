import { AssignableSearchByIssueDropdownProps } from 'react-app/entities/UserSearch/types/types'

export interface ChangeAssigneeProps extends Omit<AssignableSearchByIssueDropdownProps, 'onChange'> {
    queryKeys: () => string[]
    onSuccess?: () => void
    issueName: string
    issueKey: string
}
