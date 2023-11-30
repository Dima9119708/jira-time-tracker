import { Outlet } from 'react-router-dom'
import { AppShell, Box, Group } from '@mantine/core'
import { IconTransferOut } from '@tabler/icons-react'

const LayoutRoot = () => {
    return (
        <AppShell
            bg="gray.2"
            p={20}
        >
            <AppShell.Header
                bg="gray.2"
                px={20}
                py={10}
            >
                <Group>
                    <IconTransferOut />
                </Group>
            </AppShell.Header>

            <AppShell.Main pt={40}>
                <Outlet />
            </AppShell.Main>
        </AppShell>
    )
}

export default LayoutRoot
