import { createStore } from '../../../shared/config/store/store'

interface UseComment {
    open: boolean
    setToggle: () => void
}

export const useComment = createStore<UseComment>((set, get) => ({
    open: false,
    setToggle: () => {
        set((draft) => {
            draft.open = !get().open
        })
    },
}))
