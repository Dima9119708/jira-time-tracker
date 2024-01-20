import { createStore } from '../../../shared/config/store/store'

interface UseHelpModal {
    type: 'your-domain' | 'email' | 'apiToken' | null
    onOpen: (type: UseHelpModal['type']) => void
    onClose: () => void
}

export const useHelpModal = createStore<UseHelpModal>((set) => ({
    type: null,
    onOpen: (type) => {
        set((draft) => {
            draft.type = type
        })
    },
    onClose: () => {
        set((draft) => {
            draft.type = null
        })
    },
}))
