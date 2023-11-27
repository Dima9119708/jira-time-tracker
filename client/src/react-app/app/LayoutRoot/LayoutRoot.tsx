import { Outlet } from 'react-router-dom'
import { Box } from '@mantine/core'

const LayoutRoot = () => {
    return (
        <Box
            bg="gray.2"
            className="p-[2rem] min-h-[100vh]"
        >
            <Outlet />
        </Box>
    )
}

export default LayoutRoot
