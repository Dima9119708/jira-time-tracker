import { electron } from '../../../shared/lib/electron/electron'
import { useEffect, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { axiosInstance } from '../../../shared/config/api/api'
import { useNavigate } from 'react-router-dom'
import Button, { IconButton } from '@atlaskit/button/new'
import Spinner from '@atlaskit/spinner'
import { Box, Flex, xcss, Text } from '@atlaskit/primitives'

import { JiraLogo } from '@atlaskit/logo'

const styles = {
    wrap: xcss({
        marginTop: 'space.200',
        width: '100%',
    }),
    loading: xcss({
        position: 'absolute',
        top: '0',
        left: '0',
        right: '0',
        bottom: '0',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    }),
    loading_overlay: xcss({
        position: 'absolute',
        top: '0',
        left: '0',
        right: '0',
        bottom: '0',
        backgroundColor: 'color.background.accent.gray.subtler',
        opacity: 'opacity.loading',
    }),
}

const OAuth2 = () => {
    const [loading, setLoading] = useState(false)

    const navigate = useNavigate()
    const queryClient = useQueryClient()

    useEffect(() => {
        const unsubscribe = electron((methods) => {
            const listenerOAuth2 = async (_: Electron.IpcRendererEvent, code: string) => {
                try {
                    setLoading(true)

                    const resOAuthToken = await axiosInstance.post('/oauth-token', { code })
                    const resAccessibleResources = await axiosInstance.get('/oauth-token-accessible-resources', {
                        headers: {
                            access_token: resOAuthToken.data.access_token,
                        },
                    })

                    const client_id = resAccessibleResources.data[0].id
                    const jiraSubDomain = resAccessibleResources.data[0].url

                    await methods.ipcRenderer.invoke('SAVE_DATA_OAuth2', {
                        access_token: resOAuthToken.data.access_token,
                        refresh_token: resOAuthToken.data.refresh_token,
                        client_id,
                        jiraSubDomain,
                    })

                    const resLogin = await axiosInstance.get('/myself')

                    queryClient.setQueryData(['myself'], resLogin.data)

                    navigate('/issues')

                    setLoading(false)
                } catch (e) {
                    setLoading(false)
                }
            }

            methods.ipcRenderer.on('ACCEPT_OAuth2', listenerOAuth2)

            return () => {
                methods.ipcRenderer.removeListener('ACCEPT_OAuth2', listenerOAuth2)
            }
        })

        return () => unsubscribe()
    }, [])

    return (
        <Box xcss={styles.wrap}>
            {loading && (
                <Box xcss={styles.loading}>
                    <Box xcss={styles.loading_overlay} />
                    <Spinner size="xlarge" />
                </Box>
            )}
            <Button
                onClick={() => {
                    electron((methods) => methods.ipcRenderer.send('OPEN_OAuth2'))
                }}
                shouldFitContainer
            >
                <Flex
                    justifyContent="center"
                    alignItems="center"
                    columnGap="space.025"
                >
                    <JiraLogo
                        appearance="brand"
                        size="small"
                    />
                </Flex>
            </Button>
        </Box>
    )
}

export default OAuth2
