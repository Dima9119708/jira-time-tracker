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
        position: 'relative',
        display: 'grid',
        gridTemplateColumns: 'subgrid',
        gridColumn: '1 / -1',
        alignItems: 'center',
        color: 'color.text',
        borderBottomWidth: '1px',
        borderBottomStyle: 'solid',
        borderBottomColor: 'color.border.bold',
    }),
    cell: xcss({
        wordBreak: 'break-word',
    }),
    rowDetail: xcss({
        display: 'grid',
        gridTemplateColumns: 'subgrid',
        gridColumn: '1 / -1',
        paddingTop: 'space.150',
        paddingBottom: 'space.150',
    }),
}

export const TableHead = ({ children }: { children: ReactNode }) => <Box xcss={styles.head}>{children}</Box>
export const TableBody = ({ children }: { children: ReactNode }) => <Box xcss={styles.body}>{children}</Box>
export const TableRow = ({ children }: { children: ReactNode }) => <Box xcss={styles.row}>{children}</Box>
export const TableCell = ({ children, styles }: { children?: ReactNode; styles?: ReturnType<typeof xcss> }) => (
    <Box xcss={styles}>{children}</Box>
)
export const TableRowDetail = ({ children }: { children: ReactNode }) => <Box xcss={styles.rowDetail}>{children}</Box>

export const Table = (props: { children: ReactNode; gridTemplateColumns: string; minWidth?: string }) => {
    const { children, gridTemplateColumns, minWidth = '600px' } = props

    return (
        <Box
            xcss={xcss({
                display: 'grid',
                gridTemplateRows: 'auto 1fr',
                gap: 'space.100',
                minWidth,
                gridTemplateColumns,
            })}
        >
            {children}
        </Box>
    )
}
