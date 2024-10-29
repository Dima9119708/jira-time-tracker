export const secondsToUIFormat = (seconds: number) => {
    const totalMinutes = Math.floor(seconds / 60)
    const totalHours = Math.floor(totalMinutes / 60)

    return `${String(totalHours).padStart(2, '0')}:${String(totalMinutes % 60).padStart(2, '0')}`
}
