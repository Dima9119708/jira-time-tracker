import { Box, Grid, xcss } from '@atlaskit/primitives'
import React, { ReactNode } from 'react'
import Tooltip from '@atlaskit/tooltip'
import Issue16Icon from '@atlaskit/icon-object/glyph/issue/16'
import { token } from '@atlaskit/tokens'

interface RelatedIssueCardProps {
    iconSlot: ReactNode
    // parentIssueSlot: ReactNode
    typeSlot: ReactNode
    keySlot: ReactNode
    summarySlot: ReactNode
    statusSlot: ReactNode
    assigneeSlot: ReactNode
    prioritySlot: ReactNode
    playerSlot: ReactNode
    onClick?: () => void
}

const styles = {
    root: xcss({
        display: 'flex',
        flexDirection: 'column',
        gap: 'space.100',
        paddingTop: 'space.100',
        paddingBottom: 'space.100',
    }),
    issuesWrap: xcss({
        boxShadow: 'elevation.shadow.raised',
        borderRadius: 'border.radius.100',
    }),
    wrap: xcss({
        display: 'grid',
        gridTemplateColumns: '20px auto auto 1fr auto auto auto auto',
        alignItems: 'center',
        padding: 'space.100',
        columnGap: 'space.100',
        rowGap: 'space.100',
        borderBottomWidth: 'border.width',
        borderBottomStyle: 'solid',
        borderBottomColor: 'color.border',

        // @ts-ignore
        '&:last-child': {
            borderBottom: 'none',
        },
    }),
    element: xcss({}),
    key: xcss({
        color: 'color.text.accent.blue',
    }),
    fullWidth: xcss({
        gridColumn: '1 / -1',
    }),
    summary: xcss({
        paddingRight: 'space.100',
        paddingLeft: 'space.100',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
    }),
}

export const RelatedIssuesWrap = (props: { children: ReactNode }) => {
    return <Box xcss={styles.issuesWrap}>{props.children}</Box>
}

export const RelatedIssuesRoot = (props: { children: ReactNode }) => {
    return <Box xcss={styles.root}>{props.children}</Box>
}

export const RelatedIssuesNestedWrap = (props: { children: ReactNode; marginLeft: string }) => {
    return (
        <div
            style={{
                paddingLeft: props.marginLeft,
                paddingRight: token('space.100'),
                borderBottomStyle: 'solid',
                borderBottomWidth: token('border.width'),
                borderBottomColor: token('color.border'),
            }}
        >
            {props.children}
        </div>
    )
}

const RelatedIssues = (props: RelatedIssueCardProps) => {
    const { iconSlot, typeSlot, keySlot, playerSlot, prioritySlot, summarySlot, statusSlot, assigneeSlot } = props

    return (
        <Box xcss={styles.wrap}>
            <Box xcss={styles.element}>{iconSlot}</Box>
            <Box xcss={styles.element}>{typeSlot}</Box>
            <Box xcss={styles.key}>{keySlot}</Box>
            <Box xcss={styles.summary}>{summarySlot}</Box>
            <Box xcss={styles.element}>{prioritySlot}</Box>
            <Box xcss={styles.element}>{assigneeSlot}</Box>
            <Box xcss={styles.element}>{statusSlot}</Box>
            <Box xcss={styles.element}>{playerSlot}</Box>
        </Box>
    )
}

export default RelatedIssues
