import { useNotifications } from 'react-app/shared/lib/hooks/useNotifications'
import { PLUGINS, useGlobalState } from 'react-app/shared/lib/hooks/useGlobalState'
import { useEffect, useRef } from 'react'
import { useBooleanController } from 'use-global-boolean'
import { useLocation, useNavigate } from 'react-router-dom'

const UnauthorizedPluginHandler = () => {
    const notify = useNotifications()

    const currentPath = useRef('')

    const [isUnauthorizedPlugin, { setFalse }] = useBooleanController('UNAUTHORIZED PLUGIN')
    const navigate = useNavigate()
    const location = useLocation()

    currentPath.current = location.pathname

    useEffect(() => {
        if (isUnauthorizedPlugin && currentPath.current === '/issues') {
            const pluginName = useGlobalState.getState().settings.plugin

            switch (pluginName) {
                case PLUGINS.TEMPO: {
                    notify.error({
                        title: `The ${PLUGINS.TEMPO} plugin has been disconnected from the application.`,
                    })

                    navigate('/auth-plugin')

                    localStorage.setItem('pluginName', PLUGINS.TEMPO)

                    break
                }

                default: {
                    break
                }
            }


        }

        return () => setFalse()
    }, [isUnauthorizedPlugin])

    return null
}

export default UnauthorizedPluginHandler
