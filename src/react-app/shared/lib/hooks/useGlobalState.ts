import { createStore } from '../../config/store/store'
import deepmerge from '../utils/deepMerge'
import { JQLBasic } from 'react-app/widgets/JQLBuilderBasic/ui/JQLBuilderBasicForm'
import { ConfigurationTimeTrackingOptions } from 'react-app/shared/types/Jira/TimeTracking'

type Unit = { label: 'Minutes' | 'Hours'; value: 'minutes' | 'hours' }

export enum PLUGINS {
    TEMPO = 'TEMPO',
}

export interface UseGlobalState {
    filterId: string
    jql: string
    isSystemIdle: boolean
    settings: {
        plugin: PLUGINS.TEMPO | null
        jqlUISearchModeSwitcher: 'basic' | 'jql'
        jqlBasic?: JQLBasic
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
    }
    workingHoursPerDay: ConfigurationTimeTrackingOptions['workingHoursPerDay']
    workingDaysPerWeek: ConfigurationTimeTrackingOptions['workingDaysPerWeek']
    issueIdsSearchParams: {
        type: 'add' | 'delete' | null
        value: string
        currentParams: string
    }
    setFilterId: (id: string) => void
    parseAndSaveSetting: (string: string) => void
    setWorkingHoursPerWeek: (hours: UseGlobalState['workingHoursPerDay']) => void
    setWorkingDaysPerWeek: (hours: UseGlobalState['workingDaysPerWeek']) => void
    updateJQL: (jql: string) => void
    changeIssueIdsSearchParams: (
        type: UseGlobalState['issueIdsSearchParams']['type'],
        value: UseGlobalState['issueIdsSearchParams']['value']
    ) => Promise<void>
    getIssueIdsSearchParams: () => string
    setSystemIdle: (bool: boolean) => void
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

export const useGlobalState = createStore<UseGlobalState>(
    (set, get) => ({
        filterId: '',
        jql: '',
        isSystemIdle: false,
        workingHoursPerDay: 8,
        workingDaysPerWeek: 5,
        openSettings: false,
        settings: {
            plugin: null,
            jqlUISearchModeSwitcher: 'basic',
            favorites: [],
            jqlBasic: {
                assignees: [],
                projects: [],
                statuses: [],
                priority: [],
                prioritySort: '',
                createdSort: '',
            },
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
        setWorkingHoursPerWeek: (hours) => {
            set((draft) => {
                draft.workingHoursPerDay = hours
            })
        },
        setWorkingDaysPerWeek: (hours) => {
            set((draft) => {
                draft.workingDaysPerWeek = hours
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
