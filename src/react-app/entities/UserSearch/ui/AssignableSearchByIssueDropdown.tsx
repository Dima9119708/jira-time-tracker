import React, { useState } from 'react'
import { AssignableSearchByIssueDropdownProps } from '../types/types'
import DropdownMenu, { DropdownItem, DropdownItemGroup } from '@atlaskit/dropdown-menu'
import UserAvatarCircleIcon from '@atlaskit/icon/glyph/user-avatar-circle'
import Image from '@atlaskit/image'
import { Box, xcss } from '@atlaskit/primitives'
import ChevronDownIcon from '@atlaskit/icon/glyph/chevron-down'
import Button from '@atlaskit/button/new'
import { useAssignableSearchByIssueGET } from 'react-app/entities/UserSearch/api/useAssignableSearchByIssueGET'

const AssignableSearchByIssueDropdown = (props: AssignableSearchByIssueDropdownProps) => {
    const { issueKey, assignee, onChange, position = 'bottom-start' } = props
    const [open, setOpen] = useState(false)

    const { data, isLoading } = useAssignableSearchByIssueGET({
        issueKey,
        open,
    })

    return (
        <Box xcss={xcss({ maxWidth: 'size.1000' })}>
            <DropdownMenu
                isLoading={isLoading}
                isOpen={open}
                onOpenChange={() => setOpen(!open)}
                placement={position}
                trigger={(triggerButtonProps) => (
                    <Button
                        {...triggerButtonProps}
                        ref={triggerButtonProps.triggerRef}
                        iconBefore={() =>
                            assignee?.avatarUrls?.['48x48'] ? (
                                <Image
                                    height={20}
                                    width={20}
                                    src={assignee?.avatarUrls?.['48x48']}
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
                            )
                        }
                        iconAfter={ChevronDownIcon}
                    >
                        {assignee?.displayName ?? 'Unassigned'}
                    </Button>
                )}
            >
                <DropdownItemGroup>
                    {!isLoading &&
                        data?.map((user) => {
                            return (
                                <DropdownItem
                                    onClick={() => onChange(user)}
                                    key={user.accountId}
                                    isSelected={user.accountId === (assignee ? assignee.accountId : assignee)}
                                    elemBefore={
                                        user?.avatarUrls?.['48x48'] ? (
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
                                        )
                                    }
                                >
                                    {user.displayName}
                                </DropdownItem>
                            )
                        })}
                </DropdownItemGroup>
            </DropdownMenu>
        </Box>
    )
}

export default AssignableSearchByIssueDropdown
