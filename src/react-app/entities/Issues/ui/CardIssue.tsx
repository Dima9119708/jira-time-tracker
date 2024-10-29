import { Box, Flex, Text, xcss } from '@atlaskit/primitives'
import React, { memo, ReactNode } from 'react'

interface CardIssueProps {
    children: ReactNode
    active: boolean
    isLast: boolean
}

const styles = {
    card: ({ active, isLast }: Omit<CardIssueProps, 'children'>) =>
        xcss({
            display: 'flex',
            flexDirection: 'column',
            rowGap: 'space.200',
            padding: 'space.200',
            borderRadius: 'border.radius.200',
            boxShadow: 'elevation.shadow.overflow',
            backgroundColor: active ? 'color.background.accent.blue.subtlest' : 'color.background.input',
            ...(!isLast && { marginBottom: 'space.250' }),
        }),
}

const CardIssue = (props: CardIssueProps) => {
    const { children, active, isLast } = props

    return <Box xcss={styles.card({ active, isLast })}>{children}</Box>
}

export default memo(CardIssue)
