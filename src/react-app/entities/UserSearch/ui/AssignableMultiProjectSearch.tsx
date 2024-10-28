import React, { ReactNode, useState } from 'react'
import DropdownMenu, { DropdownItemCheckbox } from '@atlaskit/dropdown-menu'
import { Box, Flex, Text, xcss } from '@atlaskit/primitives'
import { token } from '@atlaskit/tokens'
import Button from '@atlaskit/button/new'
import ChevronDownIcon from '@atlaskit/icon/glyph/chevron-down'
import Badge from '@atlaskit/badge'
import { useAssignableMultiProjectSearchGET } from 'react-app/entities/UserSearch/lib/useAssignableMultiProjectSearchGET'
import Image from '@atlaskit/image'
import UserAvatarCircleIcon from '@atlaskit/icon/glyph/user-avatar-circle'
import ItemDropdownCheckbox from 'react-app/entities/UserSearch/ui/ItemDropdownCheckbox'
import { JQLBasicDropdownTriggerButton } from 'react-app/shared/components/JQLBasicDropdownTriggerButton'

interface AssignableMultiProjectSearchProps {
    values: string[] | undefined
    projectKeys?: string[]
    onChange: (statuses: string[]) => void
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
