import { AuthByEmailAndToken } from '../../../features/AuthByEmailAndToken'
import { Logo } from '../../../shared/components/Logo'
import { OAuth2 } from '../../../features/OAuth2'
import { Box, xcss } from '@atlaskit/primitives'
import { JiraLogo } from '@atlaskit/logo'

const styles = {
    wrap: xcss({
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: 'calc(100vh - 36px)',
        width: '100%',
        backgroundColor: 'color.blanket',
    }),
    inner_form: xcss({
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: 'space.500',
        borderRadius: 'border.radius.200',
        width: '400px',
        boxShadow: 'elevation.shadow.overflow',
        backgroundColor: 'elevation.surface.overlay',
    }),
}

const AuthPage = () => {
    return (
        <Box xcss={styles.wrap}>
            <Box xcss={styles.inner_form}>
                <Logo size={1} />

                <JiraLogo
                    appearance="brand"
                    size="medium"
                />

                <AuthByEmailAndToken />

                <OAuth2 />
            </Box>
        </Box>
    )
}

export default AuthPage
