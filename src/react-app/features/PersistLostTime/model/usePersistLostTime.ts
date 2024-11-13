import { Issue } from 'react-app/shared/types/Jira/Issues'
import { Worklog } from 'react-app/shared/types/Jira/Worklogs'
import dayjs from 'dayjs'
import { DATE_FORMAT } from 'react-app/shared/const'
import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react'

interface PersistLostTimeItem {
    issueId: Issue['id']
    date: string
    timeSpentSeconds: Worklog['timeSpentSeconds']
}

const LS_KEY = 'PERSIST_LOST_TIME'

type Listener = () => void

const lostTimeMap = new Map<Issue['id'], PersistLostTimeItem | null>()
const listeners = new Map<Issue['id'], Listener[]>()

export const usePersistLostTime = (issueId: Issue['id']) => {
    const readFromLocalStorage = useCallback(() => {
        try {
            const storedData = localStorage.getItem(LS_KEY)
            if (!storedData) return []
            return JSON.parse(storedData) as PersistLostTimeItem[]
        } catch (e) {
            return []
        }
    }, [])

    const updateLocalStorage = useCallback((updatedData: PersistLostTimeItem[]) => {
        localStorage.setItem(LS_KEY, JSON.stringify(updatedData))
    }, [])

    const clear = useCallback(() => {
        const parsedIssuesLostTime = readFromLocalStorage()

        if (parsedIssuesLostTime) {
            const issueLostTime = parsedIssuesLostTime.find((issueLostTime) => issueLostTime.issueId === issueId)

            if (issueLostTime) {
                if (!dayjs(issueLostTime.date).isToday()) {
                    updateLocalStorage(parsedIssuesLostTime.filter((issueLostTime) => issueLostTime.issueId !== issueId) )
                    lostTimeMap.delete(issueId)
                }
            }
        }
    }, [issueId])

    useEffect(() => {
        clear()

        const parsedIssuesLostTime = readFromLocalStorage()

        if (issueId) {
            if (parsedIssuesLostTime) {
                const lostTimeItem = parsedIssuesLostTime.find((issueLostTime) => issueLostTime.issueId === issueId)
                lostTimeMap.set(issueId, lostTimeItem ?? null)
            } else {
                lostTimeMap.set(issueId, null)
            }
        }
    }, [issueId])

    const remove = useCallback(
        (_issueId: Issue['id']) => {
            const parsedIssuesLostTime = readFromLocalStorage()

            const issueLostTime = parsedIssuesLostTime.find((issueLostTime) => issueLostTime.issueId === _issueId)

            if (issueLostTime) {
                updateLocalStorage(parsedIssuesLostTime.filter((issueLostTime) => issueLostTime.issueId !== _issueId))
            }

            lostTimeMap.delete(_issueId)

            listeners.get(_issueId)?.forEach((listener) => listener())
        },
        [issueId]
    )

    const add = useCallback(
        (timeSpentSeconds: Worklog['timeSpentSeconds']) => {
            const parsedIssuesLostTime = readFromLocalStorage()

            if (parsedIssuesLostTime.length > 0) {
                const issueLostTime = parsedIssuesLostTime.find((issueLostTime) => issueLostTime.issueId === issueId)

                if (issueLostTime) {
                    updateLocalStorage([
                        ...parsedIssuesLostTime.filter((issueLostTime) => issueLostTime.issueId !== issueId),
                        {
                            ...issueLostTime,
                            timeSpentSeconds: timeSpentSeconds + issueLostTime.timeSpentSeconds,
                        },
                    ])

                    lostTimeMap.set(issueId, {
                        ...issueLostTime,
                        timeSpentSeconds: timeSpentSeconds + issueLostTime.timeSpentSeconds,
                    })
                } else {
                    updateLocalStorage([
                        ...parsedIssuesLostTime,
                        {
                            issueId: issueId,
                            date: dayjs().format(DATE_FORMAT),
                            timeSpentSeconds: timeSpentSeconds,
                        },
                    ])

                    lostTimeMap.set(issueId, {
                        issueId: issueId,
                        date: dayjs().format(DATE_FORMAT),
                        timeSpentSeconds: timeSpentSeconds,
                    })
                }
            } else {
                updateLocalStorage([
                    {
                        issueId: issueId,
                        date: dayjs().format(DATE_FORMAT),
                        timeSpentSeconds: timeSpentSeconds,
                    },
                ])

                lostTimeMap.set(issueId, {
                    issueId: issueId,
                    date: dayjs().format(DATE_FORMAT),
                    timeSpentSeconds: timeSpentSeconds,
                })
            }

            listeners.get(issueId)?.forEach((listener) => listener())
        },
        [issueId]
    )

    const lostTime = useSyncExternalStore(
        (onStoreChange) => {
            if (listeners.has(issueId)) {
                const ls = listeners.get(issueId)!
                listeners.set(issueId, [...ls, onStoreChange])
            } else {
                listeners.set(issueId, [onStoreChange])
            }

            const onStorage = (ev: StorageEvent) => {
                if (ev.key === LS_KEY) {
                    listeners.get(issueId)?.forEach((listener) => listener())
                }
            }

            window.addEventListener('storage', onStorage)

            return () => {
                if (listeners.has(issueId)) {
                    const ls = listeners.get(issueId)!
                    listeners.set(
                        issueId,
                        ls.filter((listener) => listener !== onStoreChange)
                    )
                }

                window.removeEventListener('storage', onStorage)
            }
        },
        () => lostTimeMap.get(issueId)
    )

    return {
        add,
        remove,
        clear,
        lostTime,
    }
}
