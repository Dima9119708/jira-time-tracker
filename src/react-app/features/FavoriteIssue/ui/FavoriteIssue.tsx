import Button, { IconButton } from '@atlaskit/button/new'

import StarIcon from '@atlaskit/icon/glyph/star'
import Popup from '@atlaskit/popup'
import { Box, Flex, xcss } from '@atlaskit/primitives'
import { useEffect, useRef, useState } from 'react'
import Textfield from '@atlaskit/textfield'
import AddIcon from '@atlaskit/icon/glyph/add'
import { FavoriteItem } from './FavoriteItem'
import { useFavoriteControl } from '../api/useFavoriteControl'
import { useFavoriteStore } from '../lib/useFavotiveStore'
import { useGlobalState } from 'react-app/shared/lib/hooks/useGlobalState'
import StarFilledIcon from '@atlaskit/icon/glyph/star-filled'
import EmptyState from '@atlaskit/empty-state'
import { EnumReasonLoading, FavoriteIssueProps } from 'react-app/features/FavoriteIssue/types/types'

const FavoriteIssue = (props: FavoriteIssueProps) => {
    const { issueId } = props
    const [isOpen, setIsOpen] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)

    const { reasonLoading, onAddNewGroup, removeFromAllGroups, hasFavorite, favorites } = useFavoriteControl()

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
                                    onAddNewGroup(inputRef.current.value)

                                    inputRef.current.value = ''
                                }
                            }}
                        />
                    </Flex>

                    <Button
                        appearance="default"
                        shouldFitContainer
                        isDisabled={!hasFavorite}
                        onClick={() => removeFromAllGroups(issueId)}
                        isLoading={reasonLoading === EnumReasonLoading['removeFromAllGroups']}
                    >
                        Remove issue from group
                    </Button>
                </Box>
            )}
            trigger={(triggerProps) => (
                <IconButton
                    {...triggerProps}
                    icon={hasFavorite(issueId) ? StarFilledIcon : StarIcon}
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
