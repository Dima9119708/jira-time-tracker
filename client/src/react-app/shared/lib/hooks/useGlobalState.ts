import { createStore } from '../../config/store/store'
import { ConfigurationTimeTrackingOptions } from '../../../pages/Issues/types/types'

interface UseGlobalState {
    filterId: string
    jql: string
    workHoursPerWeek: ConfigurationTimeTrackingOptions['workingHoursPerDay']
    issueIdsSearchParams: {
        type: 'add' | 'delete' | null
        value: string
        currentParams: string
    }
    setFilterId: (id: string) => void
    setWorkHoursPerWeek: (hours: UseGlobalState['workHoursPerWeek']) => void
    updateJQL: (jql: string) => void
    changeIssueIdsSearchParams: (
        type: UseGlobalState['issueIdsSearchParams']['type'],
        value: UseGlobalState['issueIdsSearchParams']['value']
    ) => Promise<void>
    getIssueIdsSearchParams: () => string
    setIssueIdsSearchParams: (ids: string) => void
}

export const useGlobalState = createStore<UseGlobalState>(
    (set, get) => ({
        filterId: '',
        jql: '',
        workHoursPerWeek: 8,
        issueIdsSearchParams: {
            type: null,
            value: '',
            currentParams: '',
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
