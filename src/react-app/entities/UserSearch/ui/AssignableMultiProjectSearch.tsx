import React, { ReactNode, useState } from 'react'
import DropdownMenu from '@atlaskit/dropdown-menu'
import { useAssignableMultiProjectSearchGET } from 'react-app/entities/UserSearch/api/useAssignableMultiProjectSearchGET'
import ItemDropdownCheckbox from 'react-app/entities/UserSearch/ui/ItemDropdownCheckbox'
import { JQLBasicDropdownTriggerButton } from 'react-app/shared/components/JQLBasicDropdownTriggerButton'
import { Assignee } from 'react-app/shared/types/Jira/Issues'

interface AssignableMultiProjectSearchProps {
    values: Assignee['accountId'][] | undefined
    projectKeys?: string[]
    onChange: (statuses: Assignee['accountId'][]) => void
    elemAfterDropdownItems?: ReactNode
}

const AssignableMultiProjectSearch = (props: AssignableMultiProjectSearchProps) => {
    const { projectKeys = [], values, onChange, elemAfterDropdownItems } = props
    const [opened, setOpened] = useState(false)

    const query = useAssignableMultiProjectSearchGET({
        projectKeys: projectKeys,
        opened: opened && projectKeys?.length > 0,
    })

    return (
        <DropdownMenu
            isLoading={query.isFetching}
            trigger={
                values?.length === 0 || values === undefined
                    ? 'Assignee'
                    : (triggerButtonProps) => (
                          <JQLBasicDropdownTriggerButton
                              title="Assignee"
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
                query.data?.map((user) => {
                    return (
                        <ItemDropdownCheckbox
                            key={user.accountId}
                            values={values}
                            onChange={onChange}
                            user={user}
                        />
                    )
                })}
            {elemAfterDropdownItems}
        </DropdownMenu>
    )
}

export default AssignableMultiProjectSearch
