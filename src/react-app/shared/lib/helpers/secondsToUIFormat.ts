export const secondsToUIFormat = (seconds: number | null, withHours = false) => {
    const totalMinutes = Math.floor((seconds ?? 0) / 60)
    const totalHours = Math.floor(totalMinutes / 60)

    return `${String(totalHours).padStart(2, '0')}:${String(totalMinutes % 60).padStart(2, '0')}${withHours ? 'h' : ''}`
}
