import { Badge } from '@mantine/core'
import { useEffect, useState } from 'react'
import dayjs from 'dayjs'

const TaskTimer = () => {
    const [date, setDate] = useState(dayjs().startOf('day'))
    const formattedDate = date.format('HH:mm:ss')

    useEffect(() => {
        let intervalId: ReturnType<typeof setInterval>

        intervalId = setInterval(() => {
            setDate((prevDate) => prevDate.add(1, 'second'))
        }, 1000)

        return () => clearInterval(intervalId)
    }, [])

    return (
        <Badge
            mb={10}
            size="xl"
            radius="sm"
            variant="filled"
        >
            {formattedDate}
        </Badge>
    )
}

export default TaskTimer
