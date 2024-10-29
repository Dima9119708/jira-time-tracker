import React, { ReactNode, useState } from 'react'
import DropdownMenu from '@atlaskit/dropdown-menu'
import { useUserSearchGET } from 'react-app/entities/UserSearch/api/useUserSearchGET'
import ItemDropdownCheckbox from 'react-app/entities/UserSearch/ui/ItemDropdownCheckbox'
import { JQLBasicDropdownTriggerButton } from 'react-app/shared/components/JQLBasicDropdownTriggerButton'

interface UserSearchDropdownProps {
    values: string[] | undefined
    onChange: (statuses: string[]) => void
    elemAfterDropdownItems?: ReactNode
}

const UserSearchDropdown = (props: UserSearchDropdownProps) => {
    const { values, onChange, elemAfterDropdownItems } = props
    const [opened, setOpened] = useState(false)

    const query = useUserSearchGET({
        opened: opened,
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

export default UserSearchDropdown
