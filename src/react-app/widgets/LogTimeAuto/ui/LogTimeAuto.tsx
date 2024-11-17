import { Timer } from 'react-app/shared/components/Timer'
import { Box, xcss } from '@atlaskit/primitives'
import { useLogTimeAuto } from '../api/useLogTimeAuto'
import { ReactNode } from 'react'

interface TimeLogAutoProps {
    issueId: string
    indicatorSlot?: ReactNode
}

const LogTimeAuto = (props: TimeLogAutoProps) => {
    const ref = useLogTimeAuto(props.issueId)

    return (
        <Timer ref={ref}>
            {(time) => (
                <Box
                    xcss={xcss({
                        backgroundColor: 'color.background.neutral',
                        borderTopLeftRadius: 'border.radius.200',
                        borderTopRightRadius: 'border.radius.200',
                        textAlign: 'center',
                        font: 'font.heading.xlarge',
                        fontWeight: 'font.weight.bold',
                        color: 'color.text.accent.blue.bolder',
                        marginBottom: 'space.150',
                    })}
                >
                    {time}

                    {props.indicatorSlot}
                </Box>
            )}
        </Timer>
    )
}

export default LogTimeAuto
