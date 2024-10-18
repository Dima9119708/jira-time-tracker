import { FunctionComponent, ReactElement, ReactNode } from 'react'

import { IssueStatusCategory } from '../../../pages/Issues'
import { Issue } from '../../../pages/Issues/types/types'
import { DropdownMenuProps } from '@atlaskit/dropdown-menu'

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

export interface StatusesTaskProps {
    issueId: string
    onChange: (status: StatusesTaskResponse['transitions'][number]) => void
    trigger: DropdownMenuProps['trigger']
    status: Issue['fields']['status']
    position?: DropdownMenuProps['placement']
    disabled?: boolean
}
