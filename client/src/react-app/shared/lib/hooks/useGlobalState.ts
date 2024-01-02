import { createStore } from '../../config/store/store'
import { ConfigurationTimeTrackingOptions } from '../../../pages/Issues/types/types'

export interface UseGlobalState {
    filterId: string
    jql: string
    openSettings: boolean
    settings: {
        timeLoggingIntervalUnit: 'minutes' | 'hours'
        timeLoggingIntervalValue: number
        timeLoggingIntervalSecond: number
        timeLoggingIntervalMillisecond: number
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
    onOpenSettings: () => void
    onCloseSettings: () => void
    setSettings: (settings: UseGlobalState['settings']) => void
    setIssueIdsSearchParams: (ids: string) => void
}

export const useGlobalState = createStore<UseGlobalState>(
    (set, get) => ({
        filterId: '',
        jql: '',
        workHoursPerWeek: 8,
        openSettings: false,
        settings: {
            timeLoggingIntervalUnit: 'minutes',
            timeLoggingIntervalMillisecond: 60000,
            timeLoggingIntervalSecond: 60,
            timeLoggingIntervalValue: 1,
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
                    state.settings = setting
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
                    console.log('arguments =>', get().issueIdsSearchParams.currentParams)
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
