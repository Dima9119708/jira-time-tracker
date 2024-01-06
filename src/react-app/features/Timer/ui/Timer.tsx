import { Badge } from '@mantine/core'
import { forwardRef, Ref, useEffect, useImperativeHandle, useRef, useState } from 'react'
import dayjs from 'dayjs'

export interface TimerRef {
    pause: () => void
    play: () => void
    setIntervalTrigger: (seconds: number, fn: () => void) => () => void
}

const Timer = (props: any, ref: Ref<TimerRef>) => {
    const control = useRef({
        pause: false,
        seconds: 0,
    })

    const [date, setDate] = useState(dayjs().startOf('day'))
    const formattedDate = date.format('HH:mm:ss')

    control.current.seconds = date.hour() * 3600 + date.minute() * 60 + date.second()

    useEffect(() => {
        let intervalId: ReturnType<typeof setInterval>

        intervalId = setInterval(() => {
            if (control.current.pause) return

            setDate((prevDate) => prevDate.add(1, 'second'))
        }, 1000)

        return () => clearInterval(intervalId)
    }, [])

    useImperativeHandle(ref, () => ({
        pause: () => {
            control.current.pause = true
        },
        play: () => {
            control.current.pause = false
        },
        setIntervalTrigger: (seconds, fn) => {
            let triggerValue = seconds

            const interval = setInterval(() => {
                if (control.current.seconds === triggerValue && !control.current.pause) {
                    triggerValue += seconds
                    fn()
                }
            }, 1000)

            return () => {
                setDate(dayjs().startOf('day'))
                clearInterval(interval)
            }
        },
    }))

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

export default forwardRef(Timer)
