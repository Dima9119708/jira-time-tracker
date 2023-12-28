import { AppShell, Group } from '@mantine/core'
import { IconTransferOut } from '@tabler/icons-react'
import { Outlet, useNavigate } from 'react-router-dom'
import { Breadcrumbs } from '../../shared/ui/Breadcrumbs'
import { queryClient } from '../QueryClientProvide/QueryClientProvide'
import { Logo } from '../../shared/components/Logo'
import GlobalStateUrlSync from '../GlobalStateUrlSync/GlobalStateUrlSync'

const LayoutRoot = () => {
    const navigate = useNavigate()

    const onLogout = () => {
        navigate('/auth')
        queryClient.removeQueries()
    }

    return (
        <>
            <GlobalStateUrlSync />
            <AppShell
                bg="gray.2"
                header={{ height: 60 }}
                padding="lg"
            >
                <AppShell.Header
                    bg="gray.2"
                    px="lg"
                >
                    <Group
                        justify="space-between"
                        h="100%"
                    >
                        <Logo size={2} />
                        <IconTransferOut
                            onClick={onLogout}
                            cursor="pointer"
                        />
                    </Group>
                </AppShell.Header>

                <AppShell.Main>
                    <Breadcrumbs mb={20} />
                    <Outlet />
                </AppShell.Main>
            </AppShell>
        </>
    )
}

export default LayoutRoot
