import { Box, xcss } from '@atlaskit/primitives'
import { Issue } from 'react-app/shared/types/Jira/Issues'
import { useMemo } from 'react'
import { secondsToUIFormat } from 'react-app/shared/lib/helpers/secondsToUIFormat'

interface LogTimeIndicatorProps extends Pick<Issue['fields'], 'timespent' | 'timeoriginalestimate' | 'timeestimate'> {}

export const isNumber = (value: unknown): value is number => typeof value === 'number'

const LogTimeIndicator = (props: LogTimeIndicatorProps) => {
    const { timeoriginalestimate, timespent, timeestimate } = props

    const { timeLogged, timeRemaining, timeLoggedWidth, overOriginalEstimateWidth, timeOriginalEstimate } = useMemo(() => {
        /*
         * timespent = 0
         * timeestimate = 100
         * timeoriginalestimate = 100
         * */

        if (
            (timespent === null || timespent === 0) &&
            isNumber(timeestimate) &&
            timeestimate > 0 &&
            isNumber(timeoriginalestimate) &&
            timeoriginalestimate > 0 &&
            timeestimate === timeoriginalestimate
        ) {
            return {
                timeLogged: 'No time logged',
                timeRemaining: `${secondsToUIFormat(timeestimate)} remaining`,
                timeOriginalEstimate: `${secondsToUIFormat(timeoriginalestimate)} from original estimate`,
                timeLoggedWidth: '0',
                overOriginalEstimateWidth: '0',
            }
        }

        /*
         * timespent = 0
         * timeestimate = 200
         * timeoriginalestimate = 100
         * */
        if (
            (timespent === null || timespent === 0) &&
            isNumber(timeestimate) &&
            timeestimate > 0 &&
            isNumber(timeoriginalestimate) &&
            timeoriginalestimate > 0 &&
            timeestimate > timeoriginalestimate
        ) {

            return {
                timeLogged: 'No time logged',
                timeRemaining: `${secondsToUIFormat(timeestimate)} remaining`,
                timeOriginalEstimate: `${secondsToUIFormat(timeoriginalestimate)} from original estimate`,
                timeLoggedWidth: '0',
                overOriginalEstimateWidth: `${((timeestimate - timeoriginalestimate) / timeestimate) * 100}%`,
            }
        }

        /*
         * timespent = 0
         * timeestimate = 100
         * timeoriginalestimate = 200
         * */
        if (
            (timespent === null || timespent === 0) &&
            isNumber(timeestimate) &&
            timeestimate > 0 &&
            isNumber(timeoriginalestimate) &&
            timeoriginalestimate > 0 &&
            timeestimate < timeoriginalestimate
        ) {
            return {
                timeLogged: 'No time logged',
                timeRemaining: `${secondsToUIFormat(timeestimate)} remaining`,
                timeOriginalEstimate: `${secondsToUIFormat(timeoriginalestimate)} from original estimate`,
                timeLoggedWidth: '0',
                overOriginalEstimateWidth: '0',
            }
        }

        /*
         * timespent = 0
         * timeestimate = 0
         * timeoriginalestimate = 200
         * */
        if (
            (timespent === null || timespent === 0) &&
            (timeestimate === null || timeestimate === 0) &&
            isNumber(timeoriginalestimate) &&
            timeoriginalestimate > 0
        ) {
            return {
                timeLogged: 'No time logged',
                timeRemaining: `${secondsToUIFormat(timeoriginalestimate)} remaining`,
                timeOriginalEstimate: `${secondsToUIFormat(timeoriginalestimate)} from original estimate`,
                timeLoggedWidth: '0',
                overOriginalEstimateWidth: '0',
            }
        }

        /*
         * timespent = 100
         * timeestimate = 0
         * timeoriginalestimate = 200
         * */
        if (
            isNumber(timespent) &&
            timespent > 0 &&
            (timeestimate === null || timeestimate === 0) &&
            isNumber(timeoriginalestimate) &&
            timeoriginalestimate > 0 &&
            timespent < timeoriginalestimate
        ) {
            return {
                timeLogged: `${secondsToUIFormat(timespent)} logged`,
                timeRemaining: ``,
                timeOriginalEstimate: `${secondsToUIFormat(timeoriginalestimate - timespent)} from original estimate`,
                timeLoggedWidth: `${(timespent / timeoriginalestimate) * 100}%`,
                overOriginalEstimateWidth: '0',
            }
        }

        /*
         * timespent = 100
         * timeestimate = 0
         * timeoriginalestimate = 100
         * */
        if (
            isNumber(timespent) &&
            timespent > 0 &&
            (timeestimate === null || timeestimate === 0) &&
            isNumber(timeoriginalestimate) &&
            timeoriginalestimate > 0 &&
            timespent === timeoriginalestimate
        ) {
            return {
                timeLogged: `${secondsToUIFormat(timespent)} logged`,
                timeRemaining: ``,
                timeOriginalEstimate: ``,
                timeLoggedWidth: `100%`,
                overOriginalEstimateWidth: '0',
            }
        }

        /*
         * timespent = 200
         * timeestimate = 0
         * timeoriginalestimate = 100
         * */
        if (
            isNumber(timespent) &&
            timespent > 0 &&
            (timeestimate === null || timeestimate === 0) &&
            isNumber(timeoriginalestimate) &&
            timeoriginalestimate > 0 &&
            timespent > timeoriginalestimate
        ) {
            const exceeded = (timeoriginalestimate / timespent) * 100

            return {
                timeLogged: `${secondsToUIFormat(timespent)} logged`,
                timeRemaining: ``,
                timeOriginalEstimate: `-${secondsToUIFormat(timespent - timeoriginalestimate)} from original estimate`,
                timeLoggedWidth: `${exceeded}%`,
                overOriginalEstimateWidth: `${100 - exceeded}%`,
            }
        }

        /*
         * timespent = 150
         * timeestimate = 150
         * timeoriginalestimate = 300
         * */
        if (
            isNumber(timespent) &&
            timespent > 0 &&
            isNumber(timeestimate) &&
            timeestimate > 0 &&
            isNumber(timeoriginalestimate) &&
            timeoriginalestimate > 0 &&
            timespent + timeestimate === timeoriginalestimate
        ) {
            const exceeded = (timespent / timeoriginalestimate) * 100

            return {
                timeLogged: `${secondsToUIFormat(timespent)} logged`,
                timeRemaining: `${secondsToUIFormat(timeestimate)} remaining`,
                timeOriginalEstimate: `${secondsToUIFormat(timeoriginalestimate - timespent)} from original estimate`,
                timeLoggedWidth: `${exceeded}%`,
                overOriginalEstimateWidth: `0`,
            }
        }

        /*
         * timespent = 100
         * timeestimate = 100
         * timeoriginalestimate = 300
         * */
        if (
            isNumber(timespent) &&
            timespent > 0 &&
            isNumber(timeestimate) &&
            timeestimate > 0 &&
            isNumber(timeoriginalestimate) &&
            timeoriginalestimate > 0 &&
            timespent + timeestimate < timeoriginalestimate
        ) {
            const exceeded = (timespent / timeoriginalestimate) * 100

            return {
                timeLogged: `${secondsToUIFormat(timespent)} logged`,
                timeRemaining: `${secondsToUIFormat(timeestimate)}  remaining`,
                timeOriginalEstimate: `${secondsToUIFormat(timeoriginalestimate - timespent)} from original estimate`,
                timeLoggedWidth: `${exceeded}%`,
                overOriginalEstimateWidth: `0`,
            }
        }

        /*
         * timespent = 250
         * timeestimate = 100
         * timeoriginalestimate = 300
         * */
        if (
            isNumber(timespent) &&
            timespent > 0 &&
            isNumber(timeestimate) &&
            timeestimate > 0 &&
            isNumber(timeoriginalestimate) &&
            timeoriginalestimate > 0 &&
            timespent + timeestimate > timeoriginalestimate
        ) {
            const exceeded = ((timespent + timeestimate - timeoriginalestimate) / (timespent + timeestimate)) * 100

            return {
                timeLogged: `${secondsToUIFormat(timespent)} logged`,
                timeRemaining: `${secondsToUIFormat(timeestimate)}  remaining`,
                timeOriginalEstimate: `${timespent > timeoriginalestimate ? '-' : ''}${secondsToUIFormat(
                    timespent > timeoriginalestimate ? timespent - timeoriginalestimate : timeoriginalestimate - timespent
                )} from original estimate`,
                timeLoggedWidth: `${100 - exceeded}%`,
                overOriginalEstimateWidth: `${exceeded}%`,
            }
        }

        /*
         * timespent = 100
         * timeestimate = 0 || timeestimate = 100 || timeestimate = null
         * timeoriginalestimate = 0 || timeoriginalestimate = null
         * */
        if (isNumber(timespent) && timespent > 0) {
            return {
                timeLogged: `${secondsToUIFormat(timespent)} logged`,
                timeRemaining: ``,
                timeOriginalEstimate: ``,
                timeLoggedWidth: ``,
                overOriginalEstimateWidth: ``,
            }
        }

        return {
            timeLogged: 'No time logged',
            timeRemaining: '',
            timeOriginalRemaining: '',
            timeLoggedWidth: '0',
            overOriginalEstimateWidth: '0',
        }
    }, [timeoriginalestimate, timespent, timeestimate])

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
                <div>{timeOriginalEstimate}</div>
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
                    flexBasis: overOriginalEstimateWidth,
                })}
            />
        </Box>
    )
}

export default LogTimeIndicator
