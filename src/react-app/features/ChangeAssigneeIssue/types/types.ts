import { AssignableIssueProps } from '../../../entities/AssignableIssue/types/types'

export interface ChangeAssigneeProps extends Omit<AssignableIssueProps, 'onChange'> {
    queryKey: string
    idxPage?: number
    idxIssue: number
    issueName: string
}
