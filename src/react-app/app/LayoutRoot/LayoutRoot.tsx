import { AppShell, Drawer, Group, Input, Modal, Select, Text, Title } from '@mantine/core'
import { IconSettings, IconTransferOut } from '@tabler/icons-react'
import { Outlet, useNavigate } from 'react-router-dom'
import { Breadcrumbs } from '../../shared/ui/Breadcrumbs'
import { queryClient } from '../QueryClientProvide/QueryClientProvide'
import { Logo } from '../../shared/components/Logo'
import GlobalStateUrlSync from '../GlobalStateUrlSync/GlobalStateUrlSync'
import Settings from '../../widgets/Settings/ui/Settings'
import { useGlobalState } from '../../shared/lib/hooks/useGlobalState'
import Notifications from '../Notifications/Notifications'
import DetectedSystemIdle from '../DetectedSystemIdle/DetectedSystemIdle'

const LayoutRoot = () => {
    const navigate = useNavigate()

    const onLogout = () => {
        navigate('/auth')
        queryClient.removeQueries()
    }

    return (
        <>
            <GlobalStateUrlSync />
            <Notifications />
            <DetectedSystemIdle />
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
                        <Logo
                            size={2}
                            onClick={() => navigate('/issues')}
                            className="cursor-pointer"
                        />

                        <Group>
                            <IconSettings
                                onClick={useGlobalState.getState().onOpenSettings}
                                cursor="pointer"
                            />
                            <IconTransferOut
                                onClick={onLogout}
                                cursor="pointer"
                            />
                        </Group>
                    </Group>
                </AppShell.Header>

                <AppShell.Main>
                    <Breadcrumbs mb={20} />
                    <Outlet />
                    <Settings />
                </AppShell.Main>
            </AppShell>
        </>
    )
}

export default LayoutRoot
