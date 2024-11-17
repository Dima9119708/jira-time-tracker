import { useNotifications } from 'react-app/shared/lib/hooks/useNotifications'
import { useCallback, useState } from 'react'
import { useFilterPUT } from 'react-app/entities/Filters'
import { useGlobalState } from 'react-app/shared/lib/hooks/useGlobalState'
import { produce } from 'immer'
import { EnumReasonLoading, FavoriteIssueProps, FavoriteItemProps } from '../types/types'
import { useFavoriteStore } from '../lib/useFavotiveStore'
import { useErrorNotifier } from 'react-app/shared/lib/hooks/useErrorNotifier'

export const useFavoriteControl = () => {
    const favorites = useFavoriteStore((state) => state.favorites)
    const notify = useNotifications()
    const [reasonLoading, setReasonLoading] = useState<EnumReasonLoading>(EnumReasonLoading.empty)

    const filterPUT = useFilterPUT({
        titleLoading: '',
        titleError: ``,
        titleSuccess: ``,
        onMutate: (variables) => {
            useFavoriteStore.setState((state) => {
                state.favorites = variables.settings?.favorites!
            })
        },
        onSuccess: () => {
            setReasonLoading(EnumReasonLoading.empty)
        },
        onError: () => {
            setReasonLoading(EnumReasonLoading.empty)

            useFavoriteStore.setState((state) => {
                state.favorites = useGlobalState.getState().settings.favorites
            })
        },
    })

    useErrorNotifier(filterPUT.error)

    const hasFavorite = useCallback((issueId: FavoriteIssueProps['issueId']) => {
        return favorites.some(({ issueIds }) => issueIds.includes(issueId))
    }, [favorites])

    const removeFromAllGroups = (issueId: FavoriteIssueProps['issueId']) => {
        const newFavorites = produce(useFavoriteStore.getState().favorites, (draft) => {
            draft.forEach((group) => {
                if (group.issueIds.includes(issueId)) {
                    group.issueIds.splice(group.issueIds.indexOf(issueId), 1)
                }
            })
        })

        filterPUT.mutate({
            settings: {
                favorites: newFavorites,
            },
        })

        setReasonLoading(EnumReasonLoading['removeFromAllGroups'])
    }

    const onAddNewGroup = (newGroupName: FavoriteItemProps['name']) => {
        const isDuplicateName = useFavoriteStore.getState().favorites.some(({ name }) => name === newGroupName)

        if (isDuplicateName) {
            notify.error({
                title: 'Such a group has already been added to favorites.',
            })

            return
        }

        const newGroups = produce(useFavoriteStore.getState().favorites, (draft) => {
            draft.push({
                name: newGroupName,
                issueIds: [],
            })
        })

        filterPUT.mutate({
            settings: {
                favorites: newGroups,
            },
        })

        setReasonLoading(EnumReasonLoading.add)
    }

    const onRemoveGroup = (groupName: FavoriteItemProps['name']) => {
        const newFavorites = produce(useFavoriteStore.getState().favorites, (draft) => {
            const groupIdx = draft.findIndex((group) => group.name === groupName)

            if (groupIdx !== -1) {
                draft.splice(groupIdx, 1)
            }
        })

        filterPUT.mutate({
            settings: {
                favorites: newFavorites,
            },
        })

        setReasonLoading(EnumReasonLoading.remove)
    }

    const onAddGroup = (groupName: FavoriteItemProps['name'], issueId: FavoriteIssueProps['issueId']) => {
        const newFavorites = produce(useFavoriteStore.getState().favorites, (draft) => {
            const newGroup = draft.find((group) => group.name === groupName)

            if (newGroup) {
                if (newGroup.issueIds.includes(issueId)) {
                    newGroup.issueIds.splice(newGroup.issueIds.indexOf(issueId), 1)
                } else {
                    newGroup.issueIds.push(issueId)
                }
            }
        })

        filterPUT.mutate({
            settings: {
                favorites: newFavorites,
            },
        })

        setReasonLoading(EnumReasonLoading.choose)
    }

    const onEditGroup = (oldGroupName: FavoriteItemProps['name'], newGroupName: FavoriteItemProps['name']) => {
        const isDuplicateName = useFavoriteStore.getState().favorites.some(({ name }) => name === newGroupName)

        if (isDuplicateName) {
            notify.error({
                title: 'Such a group has already been added to favorites.',
            })

            return
        }

        const newGroups = produce(useFavoriteStore.getState().favorites, (draft) => {
            const oldGroup = draft.find((group) => group.name === oldGroupName)

            if (oldGroup) {
                oldGroup.name = newGroupName
            }
        })

        filterPUT.mutate({
            settings: {
                favorites: newGroups,
            },
        })

        setReasonLoading(EnumReasonLoading.edit)
    }

    return {
        hasFavorite,
        favorites,
        reasonLoading,
        removeFromAllGroups,
        onAddNewGroup,
        onRemoveGroup,
        onAddGroup,
        onEditGroup,
    }
}
