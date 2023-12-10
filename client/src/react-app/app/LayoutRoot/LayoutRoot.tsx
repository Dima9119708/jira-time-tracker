import { AppShell, Group } from '@mantine/core'
import { IconTransferOut } from '@tabler/icons-react'
import { Outlet } from 'react-router-dom'
import { Breadcrumbs } from '../../shared/ui/Breadcrumbs'

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
                <Group justify="end">
                    <IconTransferOut cursor="pointer" />
                </Group>
            </AppShell.Header>

            <AppShell.Main pt={40}>
                <Breadcrumbs mb={20} />
                <Outlet />
            </AppShell.Main>
        </AppShell>
    )
}

export default LayoutRoot
