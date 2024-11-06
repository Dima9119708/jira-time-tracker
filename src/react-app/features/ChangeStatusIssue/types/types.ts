import { StatusesByIssueDropdownProps } from 'react-app/entities/Issues/types/types'

export interface ChangeStatusTaskProps extends Omit<StatusesByIssueDropdownProps, 'onChange'> {
    queryKeys: () => string[]
    onMutate?: () => void
    onSuccess?: () => void
    issueName: string
}
