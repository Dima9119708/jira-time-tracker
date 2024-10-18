import { Box, xcss } from '@atlaskit/primitives'

interface LogoProps {
    size: 1 | 2
    onClick?: () => void
}

const styles = {
    logo: xcss({
        font: 'font.heading.xxlarge',
        margin: 'space.400',
        fontWeight: 'font.weight.bold',
    }),
}

const Logo = (props: LogoProps) => {
    const { size, onClick } = props

    return (
        <Box
            as="h1"
            onClick={onClick}
            xcss={{ ...styles.logo, ...xcss({ fontSize: size === 1 ? 'font.heading.xlarge' : 'font.heading.xxlarge' }) }}
        >
            Time Tracking
        </Box>
    )
}

export default Logo
