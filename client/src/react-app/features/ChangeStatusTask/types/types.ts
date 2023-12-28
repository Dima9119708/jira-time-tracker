import { StatusesTaskProps } from '../../../entities/StatusesTask'

export interface ChangeStatusTaskProps extends Omit<StatusesTaskProps, 'onChange'> {
    queryKey: string
    onChange?: () => void
    idxPage?: number
    idxIssue: number
}
