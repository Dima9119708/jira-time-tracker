import { Text } from '@mantine/core'
import { cn } from '../../../lib/classNames '

interface LogoProps {
    size: 1 | 2
    className?: string
    onClick?: () => void
}

const Logo = (props: LogoProps) => {
    const { size, className, onClick } = props

    return (
        <Text
            onClick={onClick}
            fw={900}
            variant="gradient"
            className={cn(
                {
                    'text-[3rem]': size === 1,
                    'text-[2rem]': size === 2,
                },
                className
            )}
            gradient={{ from: 'indigo', to: 'teal', deg: 90 }}
        >
            Time Tracking
        </Text>
    )
}

export default Logo
