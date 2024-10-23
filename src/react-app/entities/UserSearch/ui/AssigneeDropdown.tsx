import React, { ReactNode, useState } from 'react'
import { useStatusesSearch } from 'react-app/entities/Status'
import DropdownMenu, { DropdownItemCheckbox } from '@atlaskit/dropdown-menu'
import { Box, Flex, Text, xcss } from '@atlaskit/primitives'
import { token } from '@atlaskit/tokens'
import Button from '@atlaskit/button/new'
import ChevronDownIcon from '@atlaskit/icon/glyph/chevron-down'
import Badge from '@atlaskit/badge'
import Lozenge from '@atlaskit/lozenge'
import { useGetAssignableProjectsAndAllUsers } from 'react-app/entities/UserSearch/lib/useGetAssignableProjectsAndAllUsers'
import Image from '@atlaskit/image'
import UserAvatarCircleIcon from '@atlaskit/icon/glyph/user-avatar-circle'

interface AssignableDropdownProps {
    values: string[] | undefined
    projectKeys?: string[]
    onChange: (statuses: string[]) => void
    elemAfterDropdownItems?: ReactNode
}

const AssigneeDropdown = (props: AssignableDropdownProps) => {
    const { projectKeys = [], values, onChange, elemAfterDropdownItems } = props
    const [opened, setOpened] = useState(false)

    const query = useGetAssignableProjectsAndAllUsers({
        projectKeys: projectKeys,
        opened: opened,
    })

    return (
        <DropdownMenu
            isLoading={query.isFetching}
            trigger={
                values?.length === 0 || values === undefined
                    ? 'Assignee'
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
                                  Assignee{' '}
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
                query.data?.map((user) => {
                    return (
                        <DropdownItemCheckbox
                            onClick={() => {
                                if (values === undefined) {
                                    onChange([user.accountId])
                                    return
                                }

                                if (values.includes(user.accountId)) {
                                    onChange(values.filter((value) => value !== user.accountId))
                                } else {
                                    onChange([...values, user.accountId])
                                }
                            }}
                            key={user.accountId}
                            isSelected={values?.includes(user.accountId)}
                            id={user.accountId}
                        >
                            <Flex columnGap="space.050">
                                {user?.avatarUrls?.['48x48'] ? (
                                    <Image
                                        height={20}
                                        width={20}
                                        src={user.avatarUrls['48x48']}
                                        loading="lazy"
                                    />
                                ) : (
                                    <Box
                                        xcss={xcss({
                                            height: '20px',
                                            width: '20px',
                                        })}
                                    >
                                        <UserAvatarCircleIcon label="Unassigned" />
                                    </Box>
                                )}
                                <Text>{user.displayName}</Text>
                            </Flex>
                        </DropdownItemCheckbox>
                    )
                })}
            {elemAfterDropdownItems}
        </DropdownMenu>
    )
}

export default AssigneeDropdown
