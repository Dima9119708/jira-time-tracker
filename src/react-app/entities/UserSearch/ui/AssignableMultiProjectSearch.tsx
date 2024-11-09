import React, { ReactNode, useEffect, useState } from 'react'
import DropdownMenu from '@atlaskit/dropdown-menu'
import { useAssignableMultiProjectSearchGET } from 'react-app/entities/UserSearch/api/useAssignableMultiProjectSearchGET'
import ItemDropdownCheckbox from 'react-app/entities/UserSearch/ui/ItemDropdownCheckbox'
import { JQLBasicDropdownTriggerButton } from 'react-app/shared/components/JQLBasicDropdownTriggerButton'
import { Assignee } from 'react-app/shared/types/Jira/Issues'
import { isActiveUser } from 'react-app/shared/lib/utils/isActiveUser'
import Button from '@atlaskit/button/new'
import { Box, xcss } from '@atlaskit/primitives'

interface AssignableMultiProjectSearchProps {
    values: Assignee['accountId'][] | undefined
    projectKeys?: string[]
    onChange: (statuses: Assignee['accountId'][]) => void
    elemAfterDropdownItems?: ReactNode
}

const AssignableMultiProjectSearch = (props: AssignableMultiProjectSearchProps) => {
    const { projectKeys = [], values, onChange, elemAfterDropdownItems } = props
    const [opened, setOpened] = useState(false)
    const [showAll, setShowAll] = useState(false)

    const query = useAssignableMultiProjectSearchGET({
        projectKeys: projectKeys,
        opened: opened && projectKeys?.length > 0,
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

export default AssignableMultiProjectSearch
