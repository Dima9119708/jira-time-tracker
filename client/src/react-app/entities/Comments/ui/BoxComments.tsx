import React, { FunctionComponent } from 'react'
import { Box } from '@mantine/core'

interface BoxCommentsProps {
    open: boolean
    children: FunctionComponent<{ open: boolean }>
}

const BoxComments = (props: BoxCommentsProps) => {
    const { open, children } = props

    return (
        open && (
            <Box
                pt={15}
                mih={500}
                mah={500}
                className="overflow-y-auto"
            >
                {children({ open })}
            </Box>
        )
    )
}

export default BoxComments
