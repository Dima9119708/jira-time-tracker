import { Box, Flex, Text, xcss } from '@atlaskit/primitives'
import React, { memo, ReactNode, useMemo } from 'react'
import { getRandomElementFromArray } from 'react-app/shared/lib/utils/getRandomElementFromArray'
import { tokensMap } from '@atlaskit/primitives/dist/types/xcss/xcss'

interface CardIssueProps {
    children: ReactNode
    active: boolean
}

const BORDER_COLORS: (keyof typeof tokensMap['borderColor'])[] = [
    'color.border.accent.lime',
    'color.border.accent.orange',
    'color.border.accent.yellow',
    'color.border.accent.green',
    'color.border.accent.teal',
    'color.border.accent.blue',
    'color.border.accent.purple',
]

const styles = {
    card: ({ active, borderColor }: Omit<CardIssueProps, 'children'> & { borderColor: (keyof typeof tokensMap['borderColor']) | undefined }) =>
        xcss({
            display: 'flex',
            flexDirection: 'column',
            rowGap: 'space.200',
            padding: 'space.200',
            borderRadius: 'border.radius.200',
            boxShadow: 'elevation.shadow.overflow',
            backgroundColor: 'color.background.input',
            ...active && {
                borderWidth:  'border.width.outline',
                borderStyle: 'solid',
                borderColor: borderColor,
            },
            marginBottom: 'space.250',
            // @ts-ignore
            '&:last-child': {
                marginBottom: 0
            }
        }),
}

const CardIssue = (props: CardIssueProps) => {
    const { children, active } = props

    const borderColor = useMemo(() => {
        if (active) {
            return getRandomElementFromArray(BORDER_COLORS)
        }
    }, [active])

    return <Box xcss={styles.card({ active, borderColor })}>{children}</Box>
}

export default memo(CardIssue)
