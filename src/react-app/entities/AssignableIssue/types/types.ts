import { MenuProps } from '@mantine/core'
import { FunctionComponent, ReactNode } from 'react'
import { Assignee } from '../../../pages/Issues/types/types'

export interface AssignableIssueProps extends Pick<MenuProps, 'position' | 'disabled'> {
    assignee: Assignee | null
    issueKey: string
    onChange: (assignee: Assignee) => void
    children: FunctionComponent<{ ImageComponent: ReactNode; name: string }>
}
