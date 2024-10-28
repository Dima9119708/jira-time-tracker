import { Navigate, useNavigate } from 'react-router-dom'
import { IconButton } from '@atlaskit/button/new'
import ArrowLeftCircleIcon from '@atlaskit/icon/glyph/arrow-left-circle'
import { Box } from '@atlaskit/primitives'
import { PLUGINS, UseGlobalState } from 'react-app/shared/lib/hooks/useGlobalState'
import { lazy } from 'react'

const AuthTempo = lazy(() => import('react-app/features/AuthPluginTempo'))

const AuthPlugin = () => {
    const navigate = useNavigate()
    const pluginName = localStorage.getItem('pluginName') as UseGlobalState['settings']['plugin']

    return (
        <Box>
            <IconButton
                icon={ArrowLeftCircleIcon}
                label="back"
                onClick={() => navigate('/issues')}
            />

            {pluginName === PLUGINS.TEMPO && <AuthTempo />}
            {!pluginName && <Navigate to="/issues" />}
        </Box>
    )
}

export default AuthPlugin
