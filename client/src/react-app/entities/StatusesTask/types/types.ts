import { ReactNode } from 'react'
import { MenuProps } from '@mantine/core'

import { TaskStatusCategory } from '../../../pages/Tasks'

export interface StatusesTaskResponse {
    transitions: Array<{
        name: string
        id: string
        to: {
            name: string
            statusCategory: {
                key: TaskStatusCategory
            }
        }
    }>
}

export type TStatusTask = StatusesTaskResponse['transitions'][number]

export interface StatusesTaskProps extends Pick<MenuProps, 'position' | 'disabled'> {
    id: string
    onChange: (status: StatusesTaskResponse['transitions'][number]) => void
    children: ReactNode
}
