import React, { ReactNode, useState } from 'react'
import DropdownMenu, { DropdownItemCheckbox } from '@atlaskit/dropdown-menu'
import { Flex, Text } from '@atlaskit/primitives'
import { usePrioritySchemesGET } from 'react-app/entities/PrioritySchemes/lib/usePrioritySchemesGET'
import Image from '@atlaskit/image'
import { JQLBasicDropdownTriggerButton } from 'react-app/shared/components/JQLBasicDropdownTriggerButton'

interface PriorityMultiDropdownProps {
    values: string[] | undefined
    projectIds: string[] | undefined
    onChange: (statuses: string[]) => void
    elemAfterDropdownItems?: ReactNode
}

const PriorityMultiDropdown = (props: PriorityMultiDropdownProps) => {
    const { values, onChange, elemAfterDropdownItems, projectIds } = props
    const [opened, setOpened] = useState(false)

    const query = usePrioritySchemesGET({
        opened: opened,
        projectIds,
    })

    return (
        <DropdownMenu
            isLoading={query.isFetching}
            trigger={
                values?.length === 0 || values === undefined
                    ? 'Priority'
                    : (triggerButtonProps) => (
                          <JQLBasicDropdownTriggerButton
                              title="Priority"
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
                query.data?.map((priority) => {
                    return (
                        <DropdownItemCheckbox
                            onClick={() => {
                                if (values === undefined) {
                                    onChange([priority.name])
                                    return
                                }

                                if (values.includes(priority.name)) {
                                    onChange(values.filter((value) => value !== priority.name))
                                } else {
                                    onChange([...values, priority.name])
                                }
                            }}
                            key={priority.id}
                            isSelected={values?.includes(priority.name)}
                            id={priority.name}
                        >
                            <Flex columnGap="space.050">
                                <Image
                                    height={20}
                                    width={20}
                                    src={priority.iconUrl}
                                    loading="lazy"
                                />
                                <Text> {priority.name}</Text>
                            </Flex>
                        </DropdownItemCheckbox>
                    )
                })}

            {elemAfterDropdownItems}
        </DropdownMenu>
    )
}

export default PriorityMultiDropdown
