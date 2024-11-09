import { lazy, Suspense, useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { queryClient } from '../QueryClientProvide/QueryClientProvide'
import { Logo } from '../../shared/components/Logo'
import GlobalStateUrlSync from '../GlobalComponents/GlobalStateUrlSync/GlobalStateUrlSync'
import Notifications from '../GlobalComponents/Notifications/Notifications'
import DetectedSystemIdle from '../GlobalComponents/DetectedSystemIdle/DetectedSystemIdle'
import AutoStart from '../GlobalComponents/AutoStart/AutoStart'
import { electron } from '../../shared/lib/electron/electron'
import { Box, Flex, xcss } from '@atlaskit/primitives'
import SettingsIcon from '@atlaskit/icon/glyph/settings'
import { IconButton } from '@atlaskit/button/new'
import SignOutIcon from '@atlaskit/icon/glyph/sign-out'
import { TOP_PANEL_HEIGHT } from 'react-app/widgets/TopPanel/ui/TopPanel'
import { useBooleanController, WatchController } from 'use-global-boolean'
import { ModalTransition } from '@atlaskit/modal-dialog'
import RecentIcon from '@atlaskit/icon/glyph/recent'
import UnauthorizedPluginHandler from '../GlobalComponents/UnauthorizedPluginHandler/UnauthorizedPluginHandler'
import { token } from '@atlaskit/tokens'
import { useQueryClient } from '@tanstack/react-query'
import { MySelf } from 'react-app/shared/types/Jira/MySelf'
import Image from '@atlaskit/image'

const Settings = lazy(() => import('../../widgets/Settings/ui/Settings'))
const Timesheet = lazy(() => import('../../widgets/Timesheet'))

const HEADER_HEIGHT = 60
const HEADER_MAIN_MARGIN = token('space.250')

const styles = {
    app_wrap: xcss({}),
    header: xcss({
        height: `${HEADER_HEIGHT}px`,
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingRight: 'space.150',
        paddingLeft: 'space.150',
        borderBottomWidth: '1px',
        borderBottomStyle: 'solid',
        borderColor: 'color.border.accent.gray',
        backgroundColor: 'color.background.input',
        zIndex: 'blanket',
    }),
    main: xcss({
        height: `calc(100vh - ${TOP_PANEL_HEIGHT} - ${HEADER_HEIGHT}px - ${HEADER_MAIN_MARGIN})`,
        overflowY: 'auto',
        overflowX: 'hidden',
        padding: 'space.150',
        // @ts-ignore
        marginTop: HEADER_MAIN_MARGIN,
    }),
}

const LayoutRoot = () => {
    const navigate = useNavigate()
    const [isUnauthorized, { toggle }] = useBooleanController('UNAUTHORIZED')
    const queryClient = useQueryClient()

    const myself = queryClient.getQueryData<MySelf>(['myself'])
    const avatarUrl = myself?.avatarUrls?.['16x16'] ?? ''

    const onLogout = () => {
        queryClient.removeQueries()
        electron(({ ipcRenderer }) => {
            ipcRenderer.invoke('DELETE_AUTH_DATA')
        })

        navigate('/auth')
    }

    useEffect(() => {
        if (isUnauthorized) {
            toggle()
            onLogout()
        }
    }, [isUnauthorized])

    return (
        <>
            <GlobalStateUrlSync />
            <Notifications />
            <DetectedSystemIdle />
            <AutoStart />
            <UnauthorizedPluginHandler />

            <Box xcss={styles.app_wrap}>
                <Flex xcss={styles.header}>
                    <Logo
                        size={2}
                        onClick={() => navigate('/issues')}
                    />

                    <Flex columnGap="space.100">
                        <Flex alignItems="center">
                            <Image src={avatarUrl} height="25px" width="25px" />
                        </Flex>


                        <WatchController>
                            {({ globalMethods }) => {
                                return (
                                    <IconButton
                                        icon={RecentIcon}
                                        label="timesheet"
                                        onClick={() => globalMethods.setTrue('timesheet')}
                                    />
                                )
                            }}
                        </WatchController>
                        <WatchController>
                            {({ globalMethods }) => {
                                return (
                                    <IconButton
                                        icon={SettingsIcon}
                                        label="Settings"
                                        onClick={() => globalMethods.setTrue('user settings')}
                                    />
                                )
                            }}
                        </WatchController>

                        <IconButton
                            icon={SignOutIcon}
                            label="Sign out"
                            onClick={onLogout}
                        />
                    </Flex>
                </Flex>

                <Box xcss={styles.main}>
                    <Outlet />
                </Box>
            </Box>

            <WatchController name="user settings">
                {({ localState }) => {
                    const [open] = localState

                    return (
                        <ModalTransition>
                            {open && (
                                <Suspense>
                                    <Settings />
                                </Suspense>
                            )}
                        </ModalTransition>
                    )
                }}
            </WatchController>
            <WatchController name="timesheet">
                {({ localState }) => {
                    const [open] = localState

                    return (
                        <ModalTransition>
                            {open && (
                                <Suspense>
                                    <Timesheet />
                                </Suspense>
                            )}
                        </ModalTransition>
                    )
                }}
            </WatchController>
        </>
    )
}

export default LayoutRoot
