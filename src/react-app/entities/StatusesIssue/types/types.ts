import { ReactNode } from 'react'
import { MenuProps } from '@mantine/core'

import { IssueStatusCategory } from '../../../pages/Issues'
import { Issue } from '../../../pages/Issues/types/types'

export interface StatusesTaskResponse {
    transitions: Array<{
        name: string
        id: string
        to: {
            id: string
            name: string
            statusCategory: {
                key: IssueStatusCategory
            }
        }
    }>
}

export type TStatusTask = StatusesTaskResponse['transitions'][number]

export interface StatusesTaskProps extends Pick<MenuProps, 'position' | 'disabled'> {
    issueId: string
    onChange: (status: StatusesTaskResponse['transitions'][number]) => void
    children: ReactNode
    status: Issue['fields']['status']
}
