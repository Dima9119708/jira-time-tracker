export const convertJiraTimeToSeconds = (timeString: string, workingDaysPerWeek: number, workingHoursPerDay: number) => {
    const timeParts = timeString.match(/(\d+w)|(\d+d)|(\d+h)|(\d+m)/g)

    let totalSeconds = 0

    if (!timeParts) {
        return totalSeconds
    }

    timeParts.forEach((part) => {
        const value = parseInt(part.slice(0, -1))
        const unit = part.slice(-1)

        switch (unit) {
            case 'w':
                totalSeconds += value * workingDaysPerWeek * workingHoursPerDay * 60 * 60
                break
            case 'd':
                totalSeconds += value * workingHoursPerDay * 60 * 60
                break
            case 'h':
                totalSeconds += value * 60 * 60
                break
            case 'm':
                totalSeconds += value * 60
                break
        }
    })

    return totalSeconds
}

export const convertSecondsToJiraTime = (totalSeconds: number, workingDaysPerWeek: number, workingHoursPerDay: number): string => {
    const secondsPerMinute = 60
    const secondsPerHour = secondsPerMinute * 60
    const secondsPerDay = secondsPerHour * workingHoursPerDay
    const secondsPerWeek = secondsPerDay * workingDaysPerWeek

    let remainingSeconds = totalSeconds

    const weeks = Math.floor(remainingSeconds / secondsPerWeek)
    remainingSeconds %= secondsPerWeek

    const days = Math.floor(remainingSeconds / secondsPerDay)
    remainingSeconds %= secondsPerDay

    const hours = Math.floor(remainingSeconds / secondsPerHour)
    remainingSeconds %= secondsPerHour

    const minutes = Math.floor(remainingSeconds / secondsPerMinute)

    const result = []
    if (weeks) result.push(`${weeks}w`)
    if (days) result.push(`${days}d`)
    if (hours) result.push(`${hours}h`)
    if (minutes) result.push(`${minutes}m`)

    return result.join(' ')
}
