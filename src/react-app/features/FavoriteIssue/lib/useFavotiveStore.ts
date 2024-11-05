import { createStore } from 'react-app/shared/config/store/store'
import { UseGlobalState } from 'react-app/shared/lib/hooks/useGlobalState'

export const useFavoriteStore = createStore<{ favorites: UseGlobalState['settings']['favorites'] }>(() => ({
    favorites: [],
}))

