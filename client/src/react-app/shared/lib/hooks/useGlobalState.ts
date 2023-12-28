import { createStore } from '../../config/store/store'

interface UseGlobalState {
    filterId: string
    jql: string
    issueIdsSearchParams: {
        type: 'add' | 'delete' | null
        value: string
        currentParams: string
    }
    setFilterId: (id: string) => void
    updateJQL: (jql: string) => void
    changeIssueIdsSearchParams: (
        type: UseGlobalState['issueIdsSearchParams']['type'],
        value: UseGlobalState['issueIdsSearchParams']['value']
    ) => void
    getIssueIdsSearchParams: () => string
    setIssueIdsSearchParams: (ids: string) => void
}

export const useGlobalState = createStore<UseGlobalState>(
    (set, get) => ({
        filterId: '',
        jql: '',
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
        changeIssueIdsSearchParams: (type, value) => {
            set((state) => {
                state.issueIdsSearchParams.type = type
                state.issueIdsSearchParams.value = value
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
