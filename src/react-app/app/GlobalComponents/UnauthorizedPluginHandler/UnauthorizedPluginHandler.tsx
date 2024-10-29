import { useNotifications } from 'react-app/shared/lib/hooks/useNotifications'
import { PLUGINS, useGlobalState } from 'react-app/shared/lib/hooks/useGlobalState'
import { useEffect, useRef } from 'react'
import { useBooleanController } from 'use-global-boolean'
import { useLocation, useNavigate } from 'react-router-dom'
import { useFilterPUT } from 'react-app/entities/Filters'

const UnauthorizedPluginHandler = () => {
    const notify = useNotifications()

    const currentPath = useRef('')

    const [isUnauthorizedPlugin, { setFalse }] = useBooleanController('UNAUTHORIZED PLUGIN')
    const navigate = useNavigate()
    const location = useLocation()

    currentPath.current = location.pathname

    const filterPUT = useFilterPUT()

    useEffect(() => {
        if (isUnauthorizedPlugin && currentPath.current === '/issues') {
            const pluginName = useGlobalState.getState().settings.plugin

            notify.error({
                title: `The ${pluginName} plugin has been disconnected from the application.`,
            })

            switch (pluginName) {
                case PLUGINS.TEMPO: {
                    filterPUT.mutate({
                        settings: {
                            plugin: null,
                        },
                    })

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
