import { StatusesByIssueDropdownProps } from 'react-app/entities/Issues/types/types'

export interface ChangeStatusTaskProps extends Omit<StatusesByIssueDropdownProps, 'onChange'> {
    queryKey: string
    onChange?: () => void
    idxPage?: number
    idxIssue: number
    issueName: string
}
