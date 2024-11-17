import { Navigate, useLocation, useNavigate, useParams } from 'react-router-dom'
import { IconButton } from '@atlaskit/button/new'
import ArrowLeftCircleIcon from '@atlaskit/icon/glyph/arrow-left-circle'
import { Box } from '@atlaskit/primitives'
import { PLUGINS, UseGlobalState } from 'react-app/shared/lib/hooks/useGlobalState'
import { lazy, Suspense } from 'react'
import Spinner from '@atlaskit/spinner'

const AuthTempo = lazy(() => import('../../../features/AuthPluginTempo'))

const AuthPlugin = () => {
    const navigate = useNavigate()
    const { pluginName } = useParams()

    return (
        <Box>
            <IconButton
                icon={ArrowLeftCircleIcon}
                label="back"
                onClick={() => navigate('/issues')}
            />

            {pluginName === PLUGINS.TEMPO && (
                <Suspense fallback={<Spinner />}>
                    <AuthTempo />
                </Suspense>
            )}
            {!pluginName && <Navigate to="/issues" />}
        </Box>
    )
}

export default AuthPlugin
