import { StatusesByIssueDropdownProps } from 'react-app/entities/Issues/types/types'
import { Transition } from 'react-app/shared/types/Jira/Issues'

export interface ChangeStatusTaskProps extends Omit<StatusesByIssueDropdownProps, 'onChange' | 'isPending'> {
    queryKeys: () => string[]
    onMutate?: (transition: Transition) => void | Promise<void>
    onSuccess?: () => void | Promise<void>
    issueName: string
}
