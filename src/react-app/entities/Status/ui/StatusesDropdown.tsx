import DropdownMenu, { DropdownItemCheckbox } from '@atlaskit/dropdown-menu'
import { useStatusesSearchGET } from 'react-app/entities/Status'
import Lozenge from '@atlaskit/lozenge'
import React, { ReactNode, useState } from 'react'
import { JQLBasicDropdownTriggerButton } from 'react-app/shared/components/JQLBasicDropdownTriggerButton'

interface StatusesDropdownProps {
    values: string[] | undefined
    projectIds?: string[]
    onChange: (statuses: string[]) => void
    elemAfterDropdownItems?: ReactNode
}

const StatusesDropdown = (props: StatusesDropdownProps) => {
    const { projectIds = [], values, onChange, elemAfterDropdownItems } = props
    const [opened, setOpened] = useState(false)

    const query = useStatusesSearchGET({
        projectIds: projectIds,
        opened: opened,
    })

    return (
        <DropdownMenu
            isLoading={query.isFetching}
            trigger={
                values?.length === 0 || values === undefined
                    ? 'Status'
                    : (triggerButtonProps) => (
                          <JQLBasicDropdownTriggerButton
                              title="Status"
                              values={values}
                              triggerButtonProps={triggerButtonProps}
                          />
                      )
            }
            shouldRenderToParent
            isOpen={opened}
            onOpenChange={() => {
                setOpened(!opened)
            }}
        >
            {!query.isLoading &&
                query.data?.values.map((status) => {
                    const colorNew = (status.statusCategory === 'TODO') && 'default'
                    const colorIndeterminate = status.statusCategory === 'IN_PROGRESS' && 'inprogress'
                    const colorDone = status.statusCategory === 'DONE' && 'success'
                    const appearance = colorNew || colorIndeterminate || colorDone || 'default'

                    return (
                        <DropdownItemCheckbox
                            onClick={() => {
                                if (values === undefined) {
                                    onChange([status.name])
                                    return
                                }

                                if (values.includes(status.name)) {
                                    onChange(values.filter((value) => value !== status.name))
                                } else {
                                    onChange([...values, status.name])
                                }
                            }}
                            key={status.id}
                            isSelected={values?.includes(status.name)}
                            id={status.name}
                        >
                            <Lozenge appearance={appearance}>{status.name}</Lozenge>
                        </DropdownItemCheckbox>
                    )
                })}

            {elemAfterDropdownItems}
        </DropdownMenu>
    )
}

export default StatusesDropdown
