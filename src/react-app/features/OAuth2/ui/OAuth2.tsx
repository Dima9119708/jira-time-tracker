import { Button, LoadingOverlay } from '@mantine/core'
import IconAtlassianJira from '../../../shared/assets/images/atlassian_jira.svg'
import { electron } from '../../../shared/lib/electron/electron'
import { useEffect, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { axiosInstance } from '../../../shared/config/api/api'
import { useNavigate } from 'react-router-dom'
import { OAuth2Props } from '../types/types'

const OAuth2 = (props: OAuth2Props) => {
    const { className } = props
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

                    await methods.ipcRenderer.invoke('SAVE_DATA_OAuth2', {
                        access_token: resOAuthToken.data.access_token,
                        refresh_token: resOAuthToken.data.refresh_token,
                        client_id,
                    })

                    const resLogin = await axiosInstance.get('/login')

                    queryClient.setQueryData(['login'], resLogin.data)

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
        <>
            <LoadingOverlay visible={loading} />
            <Button
                onClick={() => {
                    electron((methods) => methods.ipcRenderer.send('OPEN_OAuth2'))
                }}
                className={className}
                fullWidth
                variant="outline"
            >
                <IconAtlassianJira />
            </Button>
        </>
    )
}

export default OAuth2
