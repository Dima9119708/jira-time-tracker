import { createStore } from '../../config/store/store'
import { ConfigurationTimeTrackingOptions } from '../../../pages/Issues/types/types'
import deepmerge from '../utils/deepMerge'

export interface UseGlobalState {
    filterId: string
    jql: string
    openSettings: boolean
    isSystemIdle: boolean
    settings: {
        autoStart: boolean
        timeLoggingInterval: {
            unit: 'minutes' | 'hours'
            displayTime: number
            second: number
        }

        sendInactiveNotification: {
            enabled: boolean
            unit: 'minutes' | 'hours'
            displayTime: number
            millisecond: number
        }

        systemIdle: {
            enabled: boolean
            unit: 'minutes' | 'hours'
            displayTime: number
            second: number
        }
    }
    workHoursPerWeek: ConfigurationTimeTrackingOptions['workingHoursPerDay']
    issueIdsSearchParams: {
        type: 'add' | 'delete' | null
        value: string
        currentParams: string
    }
    setFilterId: (id: string) => void
    parseAndSaveSetting: (string: string) => void
    setWorkHoursPerWeek: (hours: UseGlobalState['workHoursPerWeek']) => void
    updateJQL: (jql: string) => void
    changeIssueIdsSearchParams: (
        type: UseGlobalState['issueIdsSearchParams']['type'],
        value: UseGlobalState['issueIdsSearchParams']['value']
    ) => Promise<void>
    getIssueIdsSearchParams: () => string
    setSystemIdle: (bool: boolean) => void
    onOpenSettings: () => void
    onCloseSettings: () => void
    setSettings: (settings: UseGlobalState['settings']) => void
    setIssueIdsSearchParams: (ids: string) => void
}

export const useGlobalState = createStore<UseGlobalState>(
    (set, get) => ({
        filterId: '',
        jql: '',
        isSystemIdle: false,
        workHoursPerWeek: 8,
        openSettings: false,
        settings: {
            autoStart: true,
            timeLoggingInterval: {
                unit: 'minutes',
                displayTime: 1,
                second: 60,
            },

            sendInactiveNotification: {
                enabled: false,
                unit: 'minutes',
                displayTime: 30,
                millisecond: 1800000,
            },

            systemIdle: {
                enabled: true,
                unit: 'minutes',
                displayTime: 5,
                second: 300,
            },
        },
        issueIdsSearchParams: {
            type: null,
            value: '',
            currentParams: '',
        },
        onOpenSettings: () => {
            set((draft) => {
                draft.openSettings = true
            })
        },
        onCloseSettings: () => {
            set((draft) => {
                draft.openSettings = false
            })
        },
        setSettings: (settings) => {
            set((draft) => {
                draft.settings = settings
            })
        },
        setSystemIdle: (bool) => {
            set((draft) => {
                draft.isSystemIdle = bool
            })
        },
        setFilterId: (id) => {
            set((state) => {
                state.filterId = id
            })
        },
        setIssueIdsSearchParams: (ids) => {
            set((draft) => {
                draft.issueIdsSearchParams.currentParams = ids
            })
        },
        getIssueIdsSearchParams: () => {
            return get().issueIdsSearchParams.currentParams
        },
        setWorkHoursPerWeek: (hours) => {
            set((draft) => {
                draft.workHoursPerWeek = hours
            })
        },
        parseAndSaveSetting: (string) => {
            try {
                const setting = JSON.parse(string)
                set((state) => {
                    state.settings = deepmerge(get().settings, setting)
                })
            } catch (e) {}
        },
        changeIssueIdsSearchParams: async (type, value) => {
            set((state) => {
                state.issueIdsSearchParams.type = type
                state.issueIdsSearchParams.value = value
            })

            await new Promise((resolve) => {
                const interval = setInterval(() => {
                    if (type === 'delete' && !get().issueIdsSearchParams.currentParams.includes(value)) {
                        clearInterval(interval)
                        resolve(true)
                    }

                    if (type === 'add' && get().issueIdsSearchParams.currentParams.includes(value)) {
                        clearInterval(interval)
                        resolve(true)
                    }
                })
            })
        },
        updateJQL: (jql) => {
            set((state) => {
                state.jql = jql
            })
        },
    }),
    { name: 'Global Store' }
)
