import { useCallback, useEffect, useState } from 'react'
import dayjs from 'dayjs'

export const useMidnightCountdown = (fn: () => void) => {
    const [timeUntilMidnight, setTimeUntilMidnight] = useState('');

    const calculateTimeUntilMidnight = useCallback(() => {
        const now = dayjs();
        const midnight = dayjs().endOf('day').add(1, 'second');
        const diffInMs = midnight.diff(now);

        const hours = Math.floor(diffInMs / (1000 * 60 * 60)) % 24;
        const minutes = Math.floor(diffInMs / (1000 * 60)) % 60;
        const seconds = Math.floor(diffInMs / 1000) % 60;

        setTimeUntilMidnight(`${hours}h ${minutes}m ${seconds}s`);
    }, []);

    useEffect(() => {
        calculateTimeUntilMidnight();

        const countdownInterval = setInterval(calculateTimeUntilMidnight, 1000);

        const now = dayjs();
        const midnight = dayjs().endOf('day').add(1, 'second');
        const initialDelay = midnight.diff(now);

        const timeoutId = setTimeout(() => {
            fn();

            const intervalId = setInterval(fn, 24 * 60 * 60 * 1000);

            return () => clearInterval(intervalId);
        }, initialDelay);

        return () => {
            clearTimeout(timeoutId);
            clearInterval(countdownInterval);
        };
    }, [fn, calculateTimeUntilMidnight]);

    return timeUntilMidnight;
};
