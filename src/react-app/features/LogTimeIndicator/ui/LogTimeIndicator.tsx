import { Box, xcss } from '@atlaskit/primitives'
import { Issue } from 'react-app/shared/types/Jira/Issues'
import { useLogTimeIndicator } from 'react-app/features/LogTimeIndicator/lib/useLogTimeIndicator'

export interface LogTimeIndicatorProps  {
    fields: Issue['fields']
}

const LogTimeIndicator = (props: LogTimeIndicatorProps) => {
    const { fields } = props

    const { timeLogged, timeRemaining, timeLoggedWidth, overEstimateWidth, timeRemainingFromOriginalEstimate } = useLogTimeIndicator({
        fields,
    })

    return (
        <Box
            xcss={xcss({
                position: 'relative',
                display: 'flex',
                justifyContent: 'space-between',
                marginTop: 'space.075',
                height: '6px',
                backgroundColor: 'color.background.neutral',
            })}
        >
            <Box
                xcss={xcss({
                    position: 'absolute',
                    top: 'calc(100% + 3px)',
                    left: '0',
                    fontSize: 'x-small',
                    lineHeight: 1,
                    color: 'color.text.accent.gray',
                })}
            >
                {timeLogged}
            </Box>
            <Box
                xcss={xcss({
                    position: 'absolute',
                    top: 'calc(100% + 3px)',
                    right: '0',
                    fontSize: 'x-small',
                    lineHeight: 1,
                    color: 'color.text.accent.gray',
                    textAlign: 'right',
                })}
            >
                <div>{timeRemaining}</div>
                <div>{timeRemainingFromOriginalEstimate}</div>
            </Box>
            <Box
                xcss={xcss({
                    height: 'inherit',
                    backgroundColor: 'color.background.information.bold',
                    flexBasis: timeLoggedWidth,
                })}
            />
            <Box
                xcss={xcss({
                    height: 'inherit',
                    backgroundColor: 'color.background.danger.bold',
                    flexBasis: overEstimateWidth,
                })}
            />
        </Box>
    )
}

export default LogTimeIndicator
