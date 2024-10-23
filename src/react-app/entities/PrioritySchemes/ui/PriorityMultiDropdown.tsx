import React, { ReactNode, useState } from 'react'
import DropdownMenu, { DropdownItemCheckbox } from '@atlaskit/dropdown-menu'
import { Box, Flex, Text, xcss } from '@atlaskit/primitives'
import { token } from '@atlaskit/tokens'
import Button from '@atlaskit/button/new'
import ChevronDownIcon from '@atlaskit/icon/glyph/chevron-down'
import Badge from '@atlaskit/badge'
import { useGetPrioritySchemes } from 'react-app/entities/PrioritySchemes/lib/useGetPrioritySchemes'
import Image from '@atlaskit/image'
import UserAvatarCircleIcon from '@atlaskit/icon/glyph/user-avatar-circle'

interface PriorityMultiDropdownProps {
    values: string[] | undefined
    projectIds: string[] | undefined
    onChange: (statuses: string[]) => void
    elemAfterDropdownItems?: ReactNode
}

const PriorityMultiDropdown = (props: PriorityMultiDropdownProps) => {
    const { values, onChange, elemAfterDropdownItems, projectIds } = props
    const [opened, setOpened] = useState(false)

    const query = useGetPrioritySchemes({
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
                          <Box
                              xcss={xcss({
                                  // @ts-ignore
                                  '& > button, & > button:hover': {
                                      backgroundColor: token('color.background.selected'),
                                      color: token('color.text.selected'),
                                  },
                              })}
                          >
                              <Button
                                  {...triggerButtonProps}
                                  ref={triggerButtonProps.triggerRef}
                                  iconAfter={ChevronDownIcon}
                              >
                                  Priority{' '}
                                  <Badge appearance="primary">{values?.length === 1 ? values?.length : `+${values?.length}`}</Badge>
                              </Button>
                          </Box>
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
