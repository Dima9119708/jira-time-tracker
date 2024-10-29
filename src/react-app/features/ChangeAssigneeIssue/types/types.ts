import { AssignableSearchByIssueDropdownProps } from 'react-app/entities/UserSearch/types/types'

export interface ChangeAssigneeProps extends Omit<AssignableSearchByIssueDropdownProps, 'onChange'> {
    queryKey: string
    idxPage?: number
    idxIssue: number
    issueName: string
}
