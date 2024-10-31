import Button, { IconButton } from '@atlaskit/button/new'

import StarIcon from '@atlaskit/icon/glyph/star'
import Popup from '@atlaskit/popup'
import { Box, Flex, xcss } from '@atlaskit/primitives'
import { Fragment, useEffect, useMemo, useRef, useState } from 'react'
import Textfield from '@atlaskit/textfield'
import AddIcon from '@atlaskit/icon/glyph/add'
import TrashIcon from '@atlaskit/icon/glyph/trash'
import Heading from '@atlaskit/heading'
import EditFilledIcon from '@atlaskit/icon/glyph/edit-filled'
import { UseGlobalState, useGlobalState } from 'react-app/shared/lib/hooks/useGlobalState'
import InlineEdit from '@atlaskit/inline-edit'
import CheckIcon from '@atlaskit/icon/glyph/check'
import { produce } from 'immer'
import { useFilterPUT } from 'react-app/entities/Filters'
import EmptyState from '@atlaskit/empty-state'
import { useNotifications } from 'react-app/shared/lib/hooks/useNotifications'
import { createStore } from 'react-app/shared/config/store/store'
import StarFilledIcon from '@atlaskit/icon/glyph/star-filled'

interface FavoriteIssueProps {
    issueId: string
}

interface FavoriteItemProps extends FavoriteIssueProps {
    name: string
    isGroup: boolean
}

enum EnumReasonLoading {
    'add' = 'add',
    'remove' = 'remove',
    'edit' = 'edit',
    'choose' = 'choose',
    'removeFromGroups' = 'removeFromGroups',
    'empty' = '',
}

const useFavoriteStore = createStore<{ favorites: UseGlobalState['settings']['favorites'] }>(() => ({
    favorites: [],
}))

const useFavoriteGroup = (issueId: FavoriteIssueProps['issueId']) => {
    const favorites = useFavoriteStore((state) => state.favorites)
    const [reasonLoading, setReasonLoading] = useState<EnumReasonLoading>(EnumReasonLoading.empty)

    const notify = useNotifications()

    const filterPUT = useFilterPUT({
        titleLoading: '',
        titleError: `Update favorite issue: ${issueId}`,
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

    const hasFavorite = useMemo(() => {
        return favorites.some(({ issueIds }) => issueIds.includes(issueId))
    }, [favorites, issueId])

    const onToggleChooseGroup = (groupName: FavoriteItemProps['name']) => {
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

    const onRemoveIssueFromGroup = () => {
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

        setReasonLoading(EnumReasonLoading['removeFromGroups'])
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

    const onAddGroup = (newGroupName: FavoriteItemProps['name']) => {
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

    return {
        reasonLoading,
        favorites,
        onToggleChooseGroup,
        onEditGroup,
        onAddGroup,
        onRemoveGroup,
        onRemoveIssueFromGroup,
        hasFavorite,
    }
}

const FavoriteItem = ({ name, isGroup, issueId }: FavoriteItemProps) => {
    const [value, setValue] = useState(name)
    const [isEdit, setIsEdit] = useState(false)

    const { reasonLoading, onToggleChooseGroup, onRemoveGroup, onEditGroup } = useFavoriteGroup(issueId)

    return (
        <>
            <Box xcss={xcss({ flex: 1 })}>
                <InlineEdit
                    isEditing={isEdit}
                    defaultValue={value}
                    editButtonLabel={value}
                    editView={({ errorMessage, ...fieldProps }) => (
                        <Textfield
                            {...fieldProps}
                            autoFocus
                        />
                    )}
                    readView={() => (
                        <Box xcss={xcss({ maxWidth: '200px', wordBreak: 'break-all' })}>
                            <Heading size="small">{value}</Heading>
                        </Box>
                    )}
                    onConfirm={(value) => {
                        if (!value) return
                        if (value === name) return

                        onEditGroup(name, value)
                        setValue(value)
                        setIsEdit((prevState) => !prevState)
                    }}
                    onCancel={() => setIsEdit((prevState) => !prevState)}
                />
            </Box>

            <IconButton
                appearance={isGroup ? 'primary' : 'default'}
                icon={CheckIcon}
                label="choose"
                isDisabled={reasonLoading === EnumReasonLoading.edit || reasonLoading === EnumReasonLoading.remove}
                isLoading={reasonLoading === EnumReasonLoading.choose}
                onClick={() => onToggleChooseGroup(name)}
            />

            <IconButton
                appearance="subtle"
                icon={EditFilledIcon}
                label="edit"
                isDisabled={reasonLoading === EnumReasonLoading.choose || reasonLoading === EnumReasonLoading.remove}
                isLoading={reasonLoading === EnumReasonLoading.edit}
                onClick={() => setIsEdit((prevState) => !prevState)}
            />
            <IconButton
                appearance="default"
                icon={TrashIcon}
                isDisabled={reasonLoading === EnumReasonLoading.choose || reasonLoading === EnumReasonLoading.edit}
                label="remove group"
                isLoading={reasonLoading === EnumReasonLoading.remove}
                onClick={() => onRemoveGroup(name)}
            />
        </>
    )
}

const FavoriteIssue = (props: FavoriteIssueProps) => {
    const { issueId } = props
    const [isOpen, setIsOpen] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)

    const { reasonLoading, onAddGroup, onRemoveIssueFromGroup, hasFavorite, favorites } = useFavoriteGroup(issueId)

    useEffect(() => {
        useFavoriteStore.setState((state) => {
            state.favorites = useGlobalState.getState().settings.favorites
        })
    }, [])

    return (
        <Popup
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            placement="bottom-start"
            content={() => (
                <Box xcss={xcss({ padding: 'space.200', minWidth: '400px' })}>
                    <Box
                        xcss={xcss({
                            overflowY: 'auto',
                            overflowX: 'hidden',
                            maxHeight: '300px',
                            paddingBottom: 'space.600',
                        })}
                    >
                        {favorites.length === 0 && <EmptyState header="No favorite issues" />}
                        {favorites.map(({ name, issueIds }, idx) => (
                            <Flex
                                key={name}
                                xcss={xcss({
                                    marginBottom: 'space.200',
                                    minHeight: '30px',
                                    // @ts-ignore
                                    '& input, & > button': {
                                        height: '30px',
                                    },

                                    '& form > div': {
                                        margin: 0,
                                    },
                                    '&:last-child': {
                                        marginBottom: 0,
                                    },
                                })}
                                columnGap="space.050"
                                alignItems="center"
                            >
                                <FavoriteItem
                                    name={name}
                                    isGroup={issueIds.includes(issueId)}
                                    issueId={issueId}
                                />
                            </Flex>
                        ))}
                    </Box>

                    <Flex
                        xcss={xcss({
                            height: '30px',
                            marginBottom: 'space.100',
                            // marginTop: 'space.300',
                            // @ts-ignore
                            '& > div, & > button': {
                                height: 'inherit',
                            },
                        })}
                        alignItems="center"
                        columnGap="space.100"
                    >
                        <Textfield ref={inputRef} />
                        <IconButton
                            appearance="primary"
                            icon={AddIcon}
                            label="add"
                            isLoading={reasonLoading === EnumReasonLoading.add}
                            onClick={() => {
                                if (inputRef.current) {
                                    onAddGroup(inputRef.current.value)

                                    inputRef.current.value = ''
                                }
                            }}
                        />
                    </Flex>

                    <Button
                        appearance="default"
                        shouldFitContainer
                        isDisabled={!hasFavorite}
                        onClick={onRemoveIssueFromGroup}
                        isLoading={reasonLoading === EnumReasonLoading['removeFromGroups']}
                    >
                        Remove issue from group
                    </Button>
                </Box>
            )}
            trigger={(triggerProps) => (
                <IconButton
                    {...triggerProps}
                    icon={hasFavorite ? StarFilledIcon : StarIcon}
                    label="Favorite"
                    // @ts-ignore
                    appearance="default"
                    onClick={() => setIsOpen(!isOpen)}
                />
            )}
        />
    )
}

export default FavoriteIssue
