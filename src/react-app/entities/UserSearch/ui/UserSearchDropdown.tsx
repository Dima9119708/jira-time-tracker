import React, { ReactNode, useEffect, useState } from 'react'
import DropdownMenu from '@atlaskit/dropdown-menu'
import { useUserSearchGET } from 'react-app/entities/UserSearch/api/useUserSearchGET'
import ItemDropdownCheckbox from 'react-app/entities/UserSearch/ui/ItemDropdownCheckbox'
import { JQLBasicDropdownTriggerButton } from 'react-app/shared/components/JQLBasicDropdownTriggerButton'
import { Assignee } from 'react-app/shared/types/Jira/Issues'
import { isActiveUser } from 'react-app/entities/UserSearch/lib/isActiveUser'
import Button from '@atlaskit/button/new'
import { Box, xcss } from '@atlaskit/primitives'

interface UserSearchDropdownProps {
    values: Assignee['accountId'][] | undefined
    onChange: (statuses: Assignee['accountId'][]) => void
    elemAfterDropdownItems?: ReactNode
}

const UserSearchDropdown = (props: UserSearchDropdownProps) => {
    const { values, onChange, elemAfterDropdownItems } = props
    const [opened, setOpened] = useState(false)
    const [showAll, setShowAll] = useState(false)

    const query = useUserSearchGET({
        opened: opened,
    })

    const data = showAll ? query.data : query.data?.filter(isActiveUser)

    useEffect(() => () => {
        setShowAll(false)
    }, [])

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
                data?.map((user) => {
                    return (
                        <ItemDropdownCheckbox
                            key={user.accountId}
                            values={values}
                            onChange={onChange}
                            user={user}
                        />
                    )
                })}
            <Button
                shouldFitContainer
                onClick={() => setShowAll((prevState) => !prevState)}
            >
                { showAll ? 'Hide' : 'Show all' }
            </Button>

            <Box xcss={xcss({ marginBottom: 'space.100' })} />

            {elemAfterDropdownItems}
        </DropdownMenu>
    )
}

export default UserSearchDropdown
