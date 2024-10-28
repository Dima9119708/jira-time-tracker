import { useNotifications } from 'react-app/shared/lib/hooks/useNotifications'
import { PLUGINS, useGlobalState } from 'react-app/shared/lib/hooks/useGlobalState'
import { useEffect, useRef } from 'react'
import { useBooleanController } from 'use-global-boolean'
import { useLocation, useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { AxiosError, AxiosResponse } from 'axios'
import { FilterDetails } from 'react-app/pages/Issues/types/types'
import { ErrorType } from 'react-app/shared/types/jiraTypes'
import { axiosInstance } from 'react-app/shared/config/api/api'

const UnauthorizedPluginHandler = () => {
    const notify = useNotifications()

    const currentPath = useRef('')

    const [isUnauthorizedPlugin, { setFalse }] = useBooleanController('UNAUTHORIZED PLUGIN')
    const navigate = useNavigate()
    const location = useLocation()
    console.log('isUnauthorizedPlugin =>', isUnauthorizedPlugin, currentPath.current)
    currentPath.current = location.pathname

    const { mutate } = useMutation<AxiosResponse<FilterDetails>, AxiosError<ErrorType>, string, { dismissFn: Function; title: string }>({
        mutationFn: (variables) =>
            axiosInstance.put<FilterDetails>(
                '/filter-details',
                {
                    description: variables,
                },
                {
                    params: {
                        id: useGlobalState.getState().filterId,
                    },
                }
            ),
        onError: (error) => {
            notify.error({
                title: `Error loading issue`,
                description: JSON.stringify(error.response?.data),
            })
        },
    })

    useEffect(() => {
        if (isUnauthorizedPlugin && currentPath.current === '/issues') {
            const pluginName = useGlobalState.getState().settings.plugin

            notify.error({
                title: `The ${pluginName} plugin has been disconnected from the application.`,
            })

            switch (pluginName) {
                case PLUGINS.TEMPO: {
                    useGlobalState.getState().setSettings({
                        plugin: null,
                    })

                    mutate(useGlobalState.getState().getSettingsString())

                    navigate('/auth-plugin')

                    localStorage.setItem('pluginName', PLUGINS.TEMPO)

                    break
                }

                default: {
                    break
                }
            }

            setFalse()
        }
    }, [isUnauthorizedPlugin])

    return null
}

export default UnauthorizedPluginHandler
