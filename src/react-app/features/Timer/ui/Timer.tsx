import { forwardRef, Ref, useEffect, useImperativeHandle, useRef, useState } from 'react'
import dayjs from 'dayjs'
import { Box, xcss } from '@atlaskit/primitives'

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
        <Box
            xcss={xcss({
                backgroundColor: 'color.background.neutral',
                borderRadius: 'border.radius.200',
                textAlign: 'center',
                font: 'font.heading.xlarge',
                fontWeight: 'font.weight.bold',
                color: 'color.text.accent.blue.bolder',
            })}
        >
            {formattedDate}
        </Box>
    )
}

export default forwardRef(Timer)
