import { useNavigate } from 'react-router-dom'
import { useNotifications } from 'react-app/shared/lib/hooks/useNotifications'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { electron } from 'react-app/shared/lib/electron/electron'
import { useQuery } from '@tanstack/react-query'
import { AxiosError, AxiosResponse } from 'axios'
import { ErrorType } from 'react-app/shared/types/Jira/ErrorType'
import { axiosInstancePlugin } from 'react-app/shared/config/api/api'
import { PLUGINS, useGlobalState } from 'react-app/shared/lib/hooks/useGlobalState'
import { queryClient } from 'react-app/app/QueryClientProvide/QueryClientProvide'
import { Box, Flex, xcss } from '@atlaskit/primitives'
import Image from '@atlaskit/image'
import { Radio } from '@atlaskit/radio'
import { Label } from '@atlaskit/form'
import Textfield from '@atlaskit/textfield'
import Button from '@atlaskit/button/new'
import { useFilterPUT } from 'react-app/entities/Filters'

interface AuthTempoForm {
    client_id: string
    client_secret: string
    redirect_uri: string
    apiIntegration: string
}

export const AuthPluginTempo = () => {
    const navigate = useNavigate()
    const notify = useNotifications()
    const [loading, setLoading] = useState(false)
    const [typeAuth, setTypeAuth] = useState<'Api Integration' | 'OAuth2'>('Api Integration')

    const { handleSubmit, control, getValues } = useForm<AuthTempoForm>({
        defaultValues: async () => {
            const authData = await electron(async (methods) => await methods.ipcRenderer.invoke('GET_AUTH_PLUGIN_DATA'))

            return {
                client_id: authData?.client_id || '',
                client_secret: authData?.client_secret || '',
                apiIntegration: authData?.access_token || '',
                redirect_uri: process.env.REDIRECT_URI || '',
            }
        },
    })

    const checkConnectionPlugin = useQuery<AxiosResponse<Boolean>, AxiosError<ErrorType>>({
        queryKey: ['checkConnectionPlugin'],
        queryFn: async (context) => {
            return await axiosInstancePlugin.get('/check-connection-plugin', {
                signal: context.signal,
                params: {
                    namePlugin: PLUGINS.TEMPO,
                    access_token: getValues('apiIntegration'),
                },
            })
        },
        enabled: false,
        notifyOnChangeProps: ['isSuccess', 'isFetching'],
        retry: 2,
    })

    const filterPUT = useFilterPUT({
        onSuccess: () => {
            if (checkConnectionPlugin.isSuccess) {
                electron(async (methods) => {
                    await methods.ipcRenderer.invoke('SAVE_AUTH_DATA_PLUGIN', {
                        access_token: getValues('apiIntegration'),
                        namePlugin: PLUGINS.TEMPO,
                    })

                    navigate('/issues')
                })
            }
        },
    })

    useEffect(() => {
        if (checkConnectionPlugin.isSuccess) {
            filterPUT.mutate({ settings: { plugin: PLUGINS.TEMPO } })
        }
    }, [checkConnectionPlugin.isSuccess])

    useEffect(() => {
        if (checkConnectionPlugin.isError) {
            notify.error({
                title: ``,
                description: JSON.stringify(checkConnectionPlugin.error.message),
            })
        }
    }, [checkConnectionPlugin.isError, checkConnectionPlugin.error])

    useEffect(() => {
        return () =>
            queryClient.removeQueries({
                queryKey: ['checkConnectionPlugin'],
            })
    }, [])

    useEffect(() => {
        const unsubscribe = electron((methods) => {
            const listenerOAuth2 = async (_: Electron.IpcRendererEvent, code: string) => {
                try {
                    setLoading(true)

                    const resOAuthToken = await axiosInstancePlugin.post('/oauth-token-plugin', { code })

                    await methods.ipcRenderer.invoke('SAVE_AUTH_DATA_PLUGIN', {
                        access_token: resOAuthToken.data.access_token,
                        refresh_token: resOAuthToken.data.refresh_token,
                        client_id: getValues('client_id'),
                        client_secret: getValues('client_secret'),
                        namePlugin: PLUGINS.TEMPO,
                    })

                    setLoading(false)
                } catch (e) {
                    setLoading(false)
                }
            }

            methods.ipcRenderer.on('ACCEPT_OAuth2Plugin', listenerOAuth2)

            return () => {
                methods.ipcRenderer.removeListener('ACCEPT_OAuth2Plugin', listenerOAuth2)
            }
        })

        return () => unsubscribe()
    }, [])

    const onConnectOAuth2 = (data: AuthTempoForm) => {
        electron(async (methods) => {
            const authData = await methods.ipcRenderer.invoke('GET_AUTH_DATA')

            const tempoURL = new URL(`${authData.jiraSubDomain}/plugins/servlet/ac/io.tempo.jira/oauth-authorize/`)

            tempoURL.searchParams.set('client_id', data.client_id)
            tempoURL.searchParams.set('redirect_uri', '')

            if (authData.jiraSubDomain) {
                methods.ipcRenderer.send('OPEN_OAuth2Plugin', {
                    url: tempoURL.toString(),
                })
            }
        })
    }

    const onConnectApiIntegration = () => checkConnectionPlugin.refetch()

    return (
        <Box>
            <Box xcss={xcss({ marginBottom: 'space.250' })} />

            <Flex
                justifyContent="center"
                xcss={xcss({ marginBottom: 'space.200' })}
            >
                <Image
                    height="20px"
                    src="https://www.tempo.io/images/brand/tempo-full-logo.svg"
                />
            </Flex>

            <Flex justifyContent="end">
                <Radio
                    value="Api Integration"
                    label="Api Integration"
                    isChecked={typeAuth === 'Api Integration'}
                    onChange={() => setTypeAuth('Api Integration')}
                    onPointerEnterCapture={undefined}
                    onPointerLeaveCapture={undefined}
                />
                <Radio
                    value="OAuth2"
                    label="OAuth2"
                    testId="radio-disabled"
                    isChecked={typeAuth === 'OAuth2'}
                    onChange={() => setTypeAuth('OAuth2')}
                    onPointerEnterCapture={undefined}
                    onPointerLeaveCapture={undefined}
                />
            </Flex>

            {typeAuth === 'OAuth2' ? (
                <>
                    <Label htmlFor="redirect_uri">Redirect URIs:</Label>
                    <Controller
                        render={({ field }) => {
                            return (
                                <Textfield
                                    id="redirect_uri"
                                    value={field.value}
                                    ref={field.ref}
                                    onChange={field.onChange}
                                    isDisabled={loading}
                                />
                            )
                        }}
                        name="redirect_uri"
                        control={control}
                    />

                    <Box xcss={xcss({ marginBottom: 'space.200' })} />

                    <Label htmlFor="client_id">Client ID:</Label>
                    <Controller
                        render={({ field }) => {
                            return (
                                <Textfield
                                    id="client_id"
                                    value={field.value}
                                    ref={field.ref}
                                    onChange={field.onChange}
                                    isDisabled={loading}
                                />
                            )
                        }}
                        name="client_id"
                        control={control}
                    />

                    <Box xcss={xcss({ marginBottom: 'space.200' })} />

                    <Label htmlFor="client_secret">Client secret:</Label>
                    <Controller
                        render={({ field }) => {
                            return (
                                <Textfield
                                    id="client_secret"
                                    value={field.value}
                                    ref={field.ref}
                                    onChange={field.onChange}
                                    isDisabled={loading}
                                />
                            )
                        }}
                        name="client_secret"
                        control={control}
                    />

                    <Box xcss={xcss({ marginBottom: 'space.200' })} />

                    <Button
                        isLoading={loading}
                        onClick={handleSubmit(onConnectOAuth2)}
                        appearance="primary"
                        shouldFitContainer
                    >
                        Connect
                    </Button>
                </>
            ) : (
                <>
                    <Label htmlFor="apiIntegration">API Integration:</Label>
                    <Controller
                        render={({ field }) => {
                            return (
                                <Textfield
                                    id="apiIntegration"
                                    value={field.value}
                                    onChange={field.onChange}
                                    ref={field.ref}
                                    isDisabled={loading}
                                />
                            )
                        }}
                        name="apiIntegration"
                        control={control}
                    />
                    <Box xcss={xcss({ marginBottom: 'space.200' })} />
                    <Button
                        isLoading={loading || checkConnectionPlugin.isFetching || filterPUT.isPending}
                        onClick={handleSubmit(onConnectApiIntegration)}
                        appearance="primary"
                        shouldFitContainer
                    >
                        Connect
                    </Button>
                </>
            )}
        </Box>
    )
}
