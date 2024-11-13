import { forwardRef, FunctionComponent, Ref, useEffect, useImperativeHandle, useRef, useState } from 'react'
import dayjs from 'dayjs'

export interface TimerRef {
    pause: () => void
    play: () => void
    setIntervalTrigger: (seconds: number, fn: () => void) => () => void
}

interface TimerProps {
    children: FunctionComponent<string>
}

const Timer = (props: TimerProps, ref: Ref<TimerRef>) => {
    const { children } = props

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
        }, 50)

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
            let nextTriggerTime = seconds

            const interval = setInterval(() => {
                if (control.current.seconds >= nextTriggerTime && !control.current.pause) {
                    nextTriggerTime += seconds
                    fn()
                }
            }, 50)

            return () => {
                setDate(dayjs().startOf('day'))
                clearInterval(interval)
            }
        },
    }))

    return children(formattedDate)
}

export default forwardRef(Timer)
