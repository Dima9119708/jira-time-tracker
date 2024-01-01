import { useGlobalState } from '../../../shared/lib/hooks/useGlobalState'

export const secondsToJiraFormat = (seconds: number) => {
    const secondsPerMinute = 60
    const minutesPerHour = 60
    const hoursPerDay = useGlobalState.getState().workHoursPerWeek
    const secondsPerDay = secondsPerMinute * minutesPerHour * hoursPerDay
    const secondsPerHour = secondsPerMinute * minutesPerHour

    const days = Math.floor(seconds / secondsPerDay)
    seconds %= secondsPerDay

    const hours = Math.floor(seconds / secondsPerHour)
    seconds %= secondsPerHour

    const minutes = Math.floor(seconds / secondsPerMinute)

    return `${days}d ${hours}h ${minutes}m`
}

export const secondsToUIFormat = (seconds: number) => {
    const totalMinutes = Math.floor(seconds / 60)
    const totalHours = Math.floor(totalMinutes / 60)

    return `${String(totalHours).padStart(2, '0')}:${String(totalMinutes % 60).padStart(2, '0')}`
}
