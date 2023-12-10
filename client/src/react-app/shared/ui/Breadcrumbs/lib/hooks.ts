import { createStore } from '../../../config/store/store'
import { useEffect } from 'react'

export interface UseBreadcrumbsProps {
    items: Array<{
        title: string
        link: string
    }>
    add: (items: UseBreadcrumbsProps['items']) => void
    clear: () => void
}

export const useBreadcrumbsStore = createStore<UseBreadcrumbsProps>((set) => ({
    items: [],
    add: (items) => {
        set((state) => {
            state.items = items
        })
    },
    clear: () => {
        set((state) => {
            state.items = []
        })
    },
}))

export const useBreadcrumbs = (props: { items: UseBreadcrumbsProps['items'] }) => {
    const { items } = props

    useEffect(() => {
        useBreadcrumbsStore.getState().add(items)

        return () => useBreadcrumbsStore.getState().clear()
    }, [])
}
