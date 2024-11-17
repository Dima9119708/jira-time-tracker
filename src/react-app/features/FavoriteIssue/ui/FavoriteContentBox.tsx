import { Box, xcss } from '@atlaskit/primitives'
import { ReactNode } from 'react'

interface FavoriteContentBoxProps {
    children: ReactNode,
}

const FavoriteContentBox = (props: FavoriteContentBoxProps) => {
    const { children } = props

    return (
        <Box xcss={xcss({ padding: 'space.200', minWidth: '400px' })}>{children}</Box>
    );
};

export default FavoriteContentBox;
