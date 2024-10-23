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
