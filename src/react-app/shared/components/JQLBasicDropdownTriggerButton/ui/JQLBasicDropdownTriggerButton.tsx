import { Box, xcss } from '@atlaskit/primitives'
import { token } from '@atlaskit/tokens'
import Button from '@atlaskit/button/new'
import ChevronDownIcon from '@atlaskit/icon/glyph/chevron-down'
import Badge from '@atlaskit/badge'
import React from 'react'
import { CustomTriggerProps } from '@atlaskit/dropdown-menu'

interface MultiDropdownTriggerButtonProps {
    values?: string[] | string
    title: string
    triggerButtonProps: CustomTriggerProps
}

export const JQLBasicDropdownTriggerButton = (props: MultiDropdownTriggerButtonProps) => {
    const { values, title, triggerButtonProps } = props

    const isValueArray = Array.isArray(values) && values?.length > 0
    const isValueString = typeof values === 'string' && values !== ''

    return (
        <Box
            xcss={xcss({
                // @ts-ignore
                ...((isValueArray || isValueString) && {
                    '& > button, & > button:hover': {
                        backgroundColor: token('color.background.selected'),
                        color: token('color.text.selected'),
                    },
                }),
            })}
        >
            <Button
                {...triggerButtonProps}
                ref={triggerButtonProps.triggerRef}
                iconAfter={ChevronDownIcon}
            >
                {typeof values === 'string' && title}
                {isValueArray && (
                    <>
                        {title} <Badge appearance="primary">{values?.length === 1 ? values?.length : `+${values?.length}`}</Badge>
                    </>
                )}
            </Button>
        </Box>
    )
}
