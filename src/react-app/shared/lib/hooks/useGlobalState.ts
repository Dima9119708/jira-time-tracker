import { createStore } from '../../config/store/store'
import deepmerge from '../utils/deepMerge'
import { JQLBasic } from 'react-app/widgets/JQLBuilderBasic/ui/JQLBuilderBasicForm'
import { ConfigurationTimeTrackingOptions } from 'react-app/shared/types/Jira/TimeTracking'
import { EnumSortOrder } from 'react-app/shared/types/common'

type Unit = { label: 'Minutes' | 'Hours'; value: 'minutes' | 'hours' }

export enum PLUGINS {
    TEMPO = 'TEMPO',
}

export interface UseGlobalState {
    filterId: string
    jql: string
    isIdleWithInsufficientActivity: boolean
    isTimeLoggingPaused: boolean
    settings: {
        plugin: PLUGINS.TEMPO | null
        jqlUISearchModeSwitcher: 'basic' | 'jql'
        jqlBasic: JQLBasic | null
        autoStart: boolean
        favorites: Array<{ name: string; issueIds: string[] }>
        timeLoggingInterval: {
            unit: Unit
            displayTime: number
            second: number
        }

        sendInactiveNotification: {
            enabled: boolean
            unit: Unit
            displayTime: number
            millisecond: number
        }

        systemIdle: {
            enabled: boolean
            unit: Unit
            displayTime: number
            second: number
        }

        pluginLogoutAlerts: {
            enabled: boolean
            displayTime: number
            millisecond: number
        }

        workingHoursPerDay: ConfigurationTimeTrackingOptions['workingHoursPerDay']
        workingDaysPerWeek: ConfigurationTimeTrackingOptions['workingDaysPerWeek']
    }
    issueIdsSearchParams: {
        type: 'add' | 'delete' | null
        value: string
        currentParams: string
    }
    setFilterId: (id: string) => void
    parseAndSaveSetting: (string: string) => void
    setWorkingHoursPerWeek: (hours: UseGlobalState['settings']['workingHoursPerDay']) => void
    setWorkingDaysPerWeek: (hours: UseGlobalState['settings']['workingDaysPerWeek']) => void
    updateJQL: (jql: string) => void
    hasJiraTimeTrackingPermission: boolean
    changeIssueIdsSearchParams: (
        type: UseGlobalState['issueIdsSearchParams']['type'],
        value: UseGlobalState['issueIdsSearchParams']['value']
    ) => Promise<void>
    getIssueIdsSearchParams: () => string
    setIdleWithInsufficientActivity: (bool: boolean) => void
    setTimeLoggingPaused: (bool: boolean) => void
    setSettings: (settings: Partial<UseGlobalState['settings']>) => void
    setIssueIdsSearchParams: (ids: string) => void
    setSearchModeSwitcherBasic: () => void
    setSearchModeSwitcherJQL: () => void
    getSettingsString: () => string
}

export const TIME_OPTIONS: Unit[] = [
    { label: 'Minutes', value: 'minutes' },
    { label: 'Hours', value: 'hours' },
]

export const DEFAULT_WORKING_HOURS_PER_DAY = 8
export const DEFAULT_WORKING_DAYS_PER_WEEK = 5

export const useGlobalState = createStore<UseGlobalState>(
    (set, get) => ({
        filterId: '',
        jql: '',
        isIdleWithInsufficientActivity: false,
        isTimeLoggingPaused: false,
        hasJiraTimeTrackingPermission: false,
        openSettings: false,
        settings: {
            plugin: null,
            jqlUISearchModeSwitcher: 'basic',
            favorites: [],
            jqlBasic: null,
            autoStart: true,
            timeLoggingInterval: {
                unit: TIME_OPTIONS[0],
                displayTime: 1,
                second: 60,
            },

            sendInactiveNotification: {
                enabled: true,
                unit: TIME_OPTIONS[0],
                displayTime: 30,
                millisecond: 1800000,
            },

            systemIdle: {
                enabled: true,
                unit: TIME_OPTIONS[0],
                displayTime: 5,
                second: 300,
            },

            pluginLogoutAlerts: {
                enabled: true,
                displayTime: 1,
                millisecond: 60_000,
            },

            workingHoursPerDay: DEFAULT_WORKING_HOURS_PER_DAY,
            workingDaysPerWeek: DEFAULT_WORKING_DAYS_PER_WEEK,
        },
        issueIdsSearchParams: {
            type: null,
            value: '',
            currentParams: '',
        },
        setSettings: (settings) => {
            set((draft) => {
                draft.settings = deepmerge(get().settings, settings)
            })
        },
        setIdleWithInsufficientActivity: (bool) => {
            set((draft) => {
                draft.isIdleWithInsufficientActivity = bool
            })
        },
        setTimeLoggingPaused: (bool) => {
            set((draft) => {
                draft.isTimeLoggingPaused = bool
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
        setWorkingHoursPerWeek: (hours) => {
            set((draft) => {
                draft.settings.workingHoursPerDay = hours
            })
        },
        setWorkingDaysPerWeek: (hours) => {
            set((draft) => {
                draft.settings.workingDaysPerWeek = hours
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
        setSearchModeSwitcherBasic: () => {
            set((state) => {
                state.settings.jqlUISearchModeSwitcher = 'basic'
            })
        },
        setSearchModeSwitcherJQL: () => {
            set((state) => {
                state.settings.jqlUISearchModeSwitcher = 'jql'
            })
        },
        getSettingsString: () => JSON.stringify(get().settings),
    }),
    { name: 'Global Store' }
)
