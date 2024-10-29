import React from 'react'
import { Flex, Box, Text, xcss } from '@atlaskit/primitives'
import Image from '@atlaskit/image'
import UserAvatarCircleIcon from '@atlaskit/icon/glyph/user-avatar-circle'
import { User } from 'react-app/shared/types/Jira/UserSearch'
import { DropdownItemCheckbox } from '@atlaskit/dropdown-menu'

interface AssigneeDropdownItemProps {
    user: User
    values: string[] | undefined
    onChange: (newValues: string[]) => void
}

const ItemDropdownCheckbox: React.FC<AssigneeDropdownItemProps> = ({ user, values, onChange }) => {
    const handleClick = () => {
        if (values === undefined) {
            onChange([user.accountId])
            return
        }

        if (values.includes(user.accountId)) {
            onChange(values.filter((value) => value !== user.accountId))
        } else {
            onChange([...values, user.accountId])
        }
    }

    return (
        <DropdownItemCheckbox
            onClick={handleClick}
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
}

export default ItemDropdownCheckbox
