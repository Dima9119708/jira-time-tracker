import { createStore } from '../../config/store/store'
import { updateNotKeyIn } from '../helpers/updateNotKeyIn'

interface UseGlobalState {
    filterId: string
    jql: string
    setFilterId: (id: string) => void
    updateJQL: (jql?: string) => string
    getSearchParamsIds: () => string
}

export const useGlobalState = createStore<UseGlobalState>(
    (set, get) => ({
        filterId: '',
        jql: '',
        setFilterId: (id) => {
            set((state) => {
                state.filterId = id
            })
        },
        getSearchParamsIds: () => {
            const ids = new URL(document.URL).searchParams.get('keysTaskTracking')

            return ids ?? ''
        },
        updateJQL: (jql) => {
            const keysTasksTracking = new URL(document.URL).searchParams.get('keysTaskTracking')
            const newJQL = updateNotKeyIn(jql ?? get().jql, keysTasksTracking)

            set((state) => {
                state.jql = newJQL
            })

            return newJQL
        },
    }),
    { name: 'Global Store' }
)
