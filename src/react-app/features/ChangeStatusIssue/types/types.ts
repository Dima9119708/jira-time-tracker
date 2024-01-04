import { StatusesTaskProps } from '../../../entities/StatusesIssue'

export interface ChangeStatusTaskProps extends Omit<StatusesTaskProps, 'onChange'> {
    queryKey: string
    onChange?: () => void
    idxPage?: number
    idxIssue: number
    issueName: string
}
