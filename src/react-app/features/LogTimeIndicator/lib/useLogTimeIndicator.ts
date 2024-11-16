import { useMemo } from 'react'
import { secondsToUIFormat } from 'react-app/shared/lib/helpers/secondsToUIFormat'
import { LogTimeIndicatorProps } from '../ui/LogTimeIndicator'

const isNumberMoreThanZero = (value: unknown): value is number => typeof value === 'number' && value > 0
const isZero = (value: null | number) => value === null || value === 0

export const useLogTimeIndicator = ({ timespent, timeestimate, timeoriginalestimate }: LogTimeIndicatorProps) => {
    return useMemo(() => {
        /*
         * timespent = 0
         * timeestimate = 100
         * timeoriginalestimate = 100
         * */
        if (
            isZero(timespent) &&
            isNumberMoreThanZero(timeestimate) &&
            isNumberMoreThanZero(timeoriginalestimate) &&
            timeestimate === timeoriginalestimate
        ) {
            return {
                timeLogged: 'No time logged',
                timeRemaining: `${secondsToUIFormat(timeestimate)} remaining`,
                timeRemainingFromOriginalEstimate: `${secondsToUIFormat(timeoriginalestimate)} from original estimate`,
                timeLoggedWidth: '0',
                overEstimateWidth: '0',
            }
        }

        /*
         * timespent = 0
         * timeestimate = 200
         * timeoriginalestimate = 100
         * */
        if (
            isZero(timespent) &&
            isNumberMoreThanZero(timeestimate) &&
            isNumberMoreThanZero(timeoriginalestimate) &&
            timeestimate > timeoriginalestimate
        ) {
            return {
                timeLogged: 'No time logged',
                timeRemaining: `${secondsToUIFormat(timeestimate)} remaining`,
                timeRemainingFromOriginalEstimate: `${secondsToUIFormat(timeoriginalestimate)} from original estimate`,
                timeLoggedWidth: '0',
                overEstimateWidth: `${((timeestimate - timeoriginalestimate) / timeestimate) * 100}%`,
            }
        }

        /*
         * timespent = 0
         * timeestimate = 100
         * timeoriginalestimate = 200
         * */
        if (
            isZero(timespent) &&
            isNumberMoreThanZero(timeestimate) &&
            isNumberMoreThanZero(timeoriginalestimate) &&
            timeestimate < timeoriginalestimate
        ) {
            return {
                timeLogged: 'No time logged',
                timeRemaining: `${secondsToUIFormat(timeestimate)} remaining`,
                timeRemainingFromOriginalEstimate: `${secondsToUIFormat(timeoriginalestimate)} from original estimate`,
                timeLoggedWidth: '0',
                overEstimateWidth: '0',
            }
        }

        /*
         * timespent = 0
         * timeestimate = 0
         * timeoriginalestimate = 200
         * */
        if (isZero(timespent) && isZero(timeestimate) && isNumberMoreThanZero(timeoriginalestimate) && timeoriginalestimate > 0) {
            return {
                timeLogged: 'No time logged',
                timeRemaining: `${secondsToUIFormat(timeoriginalestimate)} remaining`,
                timeRemainingFromOriginalEstimate: `${secondsToUIFormat(timeoriginalestimate)} from original estimate`,
                timeLoggedWidth: '0',
                overEstimateWidth: '0',
            }
        }

        /*
         * timespent = 100
         * timeestimate = 0
         * timeoriginalestimate = 200
         * */
        if (
            isNumberMoreThanZero(timespent) &&
            isZero(timeestimate) &&
            isNumberMoreThanZero(timeoriginalestimate) &&
            timespent < timeoriginalestimate
        ) {
            return {
                timeLogged: `${secondsToUIFormat(timespent)} logged`,
                timeRemaining: ``,
                timeRemainingFromOriginalEstimate: `${secondsToUIFormat(timeoriginalestimate - timespent)} remaining`,
                timeLoggedWidth: `${(timespent / timeoriginalestimate) * 100}%`,
                overEstimateWidth: '0',
            }
        }

        /*
         * timespent = 100
         * timeestimate = 0
         * timeoriginalestimate = 100
         * */
        if (
            isNumberMoreThanZero(timespent) &&
            isZero(timeestimate) &&
            isNumberMoreThanZero(timeoriginalestimate) &&
            timespent === timeoriginalestimate
        ) {
            return {
                timeLogged: `${secondsToUIFormat(timespent)} logged`,
                timeRemaining: ``,
                timeRemainingFromOriginalEstimate: ``,
                timeLoggedWidth: `100%`,
                overEstimateWidth: '0',
            }
        }

        /*
         * timespent = 200
         * timeestimate = 0
         * timeoriginalestimate = 100
         * */
        if (
            isNumberMoreThanZero(timespent) &&
            isZero(timeestimate) &&
            isNumberMoreThanZero(timeoriginalestimate) &&
            timespent > timeoriginalestimate
        ) {
            const exceeded = (timeoriginalestimate / timespent) * 100

            return {
                timeLogged: `${secondsToUIFormat(timespent)} logged`,
                timeRemaining: ``,
                timeRemainingFromOriginalEstimate: `-${secondsToUIFormat(timespent - timeoriginalestimate)} remaining`,
                timeLoggedWidth: `${exceeded}%`,
                overEstimateWidth: `${100 - exceeded}%`,
            }
        }

        /*
         * timespent = 150
         * timeestimate = 150
         * timeoriginalestimate = 300
         * */
        if (
            isNumberMoreThanZero(timespent) &&
            isNumberMoreThanZero(timeestimate) &&
            isNumberMoreThanZero(timeoriginalestimate) &&
            timespent + timeestimate === timeoriginalestimate
        ) {
            const exceeded = (timespent / timeoriginalestimate) * 100

            return {
                timeLogged: `${secondsToUIFormat(timespent)} logged`,
                timeRemaining: `${secondsToUIFormat(timeestimate)} remaining`,
                timeRemainingFromOriginalEstimate: `${secondsToUIFormat(timeoriginalestimate - timespent)} from original estimate`,
                timeLoggedWidth: `${exceeded}%`,
                overEstimateWidth: `0`,
            }
        }

        /*
         * timespent = 100
         * timeestimate = 100
         * timeoriginalestimate = 300
         * */
        if (
            isNumberMoreThanZero(timespent) &&
            isNumberMoreThanZero(timeestimate) &&
            isNumberMoreThanZero(timeoriginalestimate) &&
            timespent + timeestimate < timeoriginalestimate
        ) {
            const exceeded = (timespent / timeoriginalestimate) * 100

            return {
                timeLogged: `${secondsToUIFormat(timespent)} logged`,
                timeRemaining: `${secondsToUIFormat(timeestimate)}  remaining`,
                timeRemainingFromOriginalEstimate: `${secondsToUIFormat(timeoriginalestimate - timespent)} from original estimate`,
                timeLoggedWidth: `${exceeded}%`,
                overEstimateWidth: `0`,
            }
        }

        /*
         * timespent = 250
         * timeestimate = 100
         * timeoriginalestimate = 300
         * */
        if (
            isNumberMoreThanZero(timespent) &&
            isNumberMoreThanZero(timeestimate) &&
            isNumberMoreThanZero(timeoriginalestimate) &&
            timespent + timeestimate > timeoriginalestimate
        ) {
            const total = timespent + timeestimate
            const exceeded = ((total - timeoriginalestimate) / total) * 100

            return {
                timeLogged: `${secondsToUIFormat(timespent)} logged`,
                timeRemaining: `${secondsToUIFormat(timeestimate)}  remaining`,
                timeRemainingFromOriginalEstimate: `${timespent > timeoriginalestimate ? '-' : ''}${secondsToUIFormat(
                    timespent > timeoriginalestimate ? timespent - timeoriginalestimate : timeoriginalestimate - timespent
                )} from original estimate`,
                timeLoggedWidth: `${100 - exceeded}%`,
                overEstimateWidth: `${exceeded}%`,
            }
        }

        /*
         * timespent = 100
         * timeestimate = 0 || timeestimate = null
         * timeoriginalestimate = 0 || timeoriginalestimate = null
         * */
        if (isNumberMoreThanZero(timespent) && isZero(timeestimate) && isZero(timeoriginalestimate)) {
            return {
                timeLogged: `${secondsToUIFormat(timespent)} logged`,
                timeRemaining: ``,
                timeRemainingFromOriginalEstimate: ``,
                timeLoggedWidth: `100%`,
                overEstimateWidth: ``,
            }
        }

        /*
         * timespent = 100
         * timeestimate = 100
         * timeoriginalestimate = 0 || timeoriginalestimate = null
         * */
        if (isNumberMoreThanZero(timespent) && isNumberMoreThanZero(timeestimate) && isZero(timeoriginalestimate)) {
            const total = timespent + timeestimate
            const logged = (timespent / total) * 100
            return {
                timeLogged: `${secondsToUIFormat(timespent)} logged`,
                timeRemaining: `${secondsToUIFormat(timeestimate)} remaining`,
                timeRemainingFromOriginalEstimate: `Original estimate not provided`,
                timeLoggedWidth: `${logged}%`,
                overEstimateWidth: `0`,
            }
        }

        return {
            timeLogged: 'No time logged',
            timeRemaining: '',
            timeRemainingFromOriginalEstimate: '',
            timeLoggedWidth: '0',
            overEstimateWidth: '0',
        }
    }, [timeoriginalestimate, timespent, timeestimate])
}
