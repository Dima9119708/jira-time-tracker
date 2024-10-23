import { Box, xcss } from '@atlaskit/primitives'
import { ReactNode } from 'react'

const styles = {
    head: xcss({
        display: 'grid',
        gridTemplateColumns: 'subgrid',
        gridColumn: '1 / -1',
        gridRow: '1 / 1',
        color: 'color.text.subtle',
        fontWeight: 'font.weight.bold',
        alignItems: 'center',
        borderBottomWidth: '1px',
        borderBottomStyle: 'solid',
        borderBottomColor: 'color.border.muted',
    }),
    body: xcss({
        display: 'grid',
        gridTemplateColumns: 'subgrid',
        gap: 'space.150',
        gridColumn: '1 / -1',
        position: 'relative',
    }),
    row: xcss({
        display: 'grid',
        gridTemplateColumns: 'subgrid',
        gridColumn: '1 / -1',
        alignItems: 'center',
        color: 'color.text',
        borderBottomWidth: '1px',
        borderBottomStyle: 'solid',
        borderBottomColor: 'color.border',
    }),
    cell: xcss({
        wordBreak: 'break-word',
    }),
}

export const TableHead = ({ children }: { children: ReactNode }) => <Box xcss={styles.head}>{children}</Box>
export const TableBody = ({ children }: { children: ReactNode }) => <Box xcss={styles.body}>{children}</Box>
export const TableRow = ({ children }: { children: ReactNode }) => <Box xcss={styles.row}>{children}</Box>
export const TableCell = ({ children }: { children?: ReactNode }) => <Box xcss={styles.cell}>{children}</Box>

export const Table = (props: { children: ReactNode; gridTemplateColumns: string }) => {
    const { children, gridTemplateColumns } = props

    return (
        <Box
            xcss={xcss({
                display: 'grid',
                gridTemplateRows: '30px 1fr',
                gap: 'space.100',

                gridTemplateColumns,
            })}
        >
            {children}
        </Box>
    )
}
