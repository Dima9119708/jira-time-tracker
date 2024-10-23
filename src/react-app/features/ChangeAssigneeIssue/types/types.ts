import { AssignableIssueProps } from 'react-app/entities/UserSearch/types/types'

export interface ChangeAssigneeProps extends Omit<AssignableIssueProps, 'onChange'> {
    queryKey: string
    idxPage?: number
    idxIssue: number
    issueName: string
}
