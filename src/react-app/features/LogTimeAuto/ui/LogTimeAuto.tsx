import Timer from 'react-app/shared/components/Timer/ui/Timer'
import { Box, xcss } from '@atlaskit/primitives'
import { useLogTimeAuto } from 'react-app/features/LogTimeAuto/api/useLogTimeAuto'

interface TimeLogAutoProps {
    issueId: string
}

const LogTimeAuto = (props: TimeLogAutoProps) => {
    const ref = useLogTimeAuto(props.issueId)

    return (
        <Timer ref={ref}>
            {(time) => (
                <Box
                    xcss={xcss({
                        backgroundColor: 'color.background.neutral',
                        borderRadius: 'border.radius.200',
                        textAlign: 'center',
                        font: 'font.heading.xlarge',
                        fontWeight: 'font.weight.bold',
                        color: 'color.text.accent.blue.bolder',
                    })}
                >
                    {time}
                </Box>
            )}
        </Timer>
    )
}

export default LogTimeAuto
