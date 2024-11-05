import { useState } from 'react'
import { Box, xcss } from '@atlaskit/primitives'
import InlineEdit from '@atlaskit/inline-edit'
import Textfield from '@atlaskit/textfield'
import Heading from '@atlaskit/heading'
import { IconButton } from '@atlaskit/button/new'
import CheckIcon from '@atlaskit/icon/glyph/check'
import EditFilledIcon from '@atlaskit/icon/glyph/edit-filled'
import TrashIcon from '@atlaskit/icon/glyph/trash'
import { EnumReasonLoading, useFavoriteControl } from 'react-app/features/FavoriteIssue'

import { FavoriteItemProps } from 'react-app/features/FavoriteIssue/types/types'

export const FavoriteItem = ({ name, isGroup, issueId }: FavoriteItemProps) => {
    const [value, setValue] = useState(name)
    const [isEdit, setIsEdit] = useState(false)

    const { reasonLoading, onAddGroup, onRemoveGroup, onEditGroup } = useFavoriteControl()

    return (
        <>
            <Box xcss={xcss({ flex: 1 })}>
                <InlineEdit
                    isEditing={isEdit}
                    defaultValue={value}
                    editButtonLabel={value}
                    editView={({ errorMessage, ...fieldProps }) => (
                        <Textfield
                            {...fieldProps}
                            autoFocus
                        />
                    )}
                    readView={() => (
                        <Box xcss={xcss({ maxWidth: '200px', wordBreak: 'break-all' })}>
                            <Heading size="small">{value}</Heading>
                        </Box>
                    )}
                    onConfirm={(value) => {
                        if (!value) return
                        if (value === name) return

                        onEditGroup(name, value)
                        setValue(value)
                        setIsEdit((prevState) => !prevState)
                    }}
                    onCancel={() => setIsEdit((prevState) => !prevState)}
                />
            </Box>

            <IconButton
                appearance={isGroup ? 'primary' : 'subtle'}
                icon={CheckIcon}
                label="choose"
                isDisabled={reasonLoading === EnumReasonLoading.edit || reasonLoading === EnumReasonLoading.remove}
                isLoading={reasonLoading === EnumReasonLoading.choose}
                onClick={() => onAddGroup(name, issueId)}
            />

            <IconButton
                appearance="subtle"
                icon={EditFilledIcon}
                label="edit"
                isDisabled={reasonLoading === EnumReasonLoading.choose || reasonLoading === EnumReasonLoading.remove}
                isLoading={reasonLoading === EnumReasonLoading.edit}
                onClick={() => setIsEdit((prevState) => !prevState)}
            />
            <IconButton
                appearance="default"
                icon={TrashIcon}
                isDisabled={reasonLoading === EnumReasonLoading.choose || reasonLoading === EnumReasonLoading.edit}
                label="remove group"
                isLoading={reasonLoading === EnumReasonLoading.remove}
                onClick={() => onRemoveGroup(name)}
            />
        </>
    )
}
