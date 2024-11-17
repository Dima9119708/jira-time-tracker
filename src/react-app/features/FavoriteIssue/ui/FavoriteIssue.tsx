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
import AddGroup from 'react-app/features/FavoriteIssue/ui/AddGroup'
import FavoriteContentBox from 'react-app/features/FavoriteIssue/ui/FavoriteContentBox'

const FavoriteIssue = (props: FavoriteIssueProps) => {
    const { issueId, isEditGroup = true, isDeleteGroup = true, isAddNewGroup = true, isButtonCompact = false } = props
    const [isOpen, setIsOpen] = useState(false)

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
                <FavoriteContentBox>
                    <Box
                        xcss={xcss({
                            overflowY: 'auto',
                            overflowX: 'hidden',
                            maxHeight: '300px',
                            paddingBottom: 'space.600',
                            marginBottom: 'space.300',
                        })}
                    >
                        {favorites.length === 0 && <EmptyState header="No groups have been added yet." />}
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
                                    isDeleteGroup={isDeleteGroup}
                                    isEditGroup={isEditGroup}
                                />
                            </Flex>
                        ))}
                    </Box>

                    {isAddNewGroup && (
                        <AddGroup
                            isLoading={reasonLoading === EnumReasonLoading.add}
                            onAdd={onAddNewGroup}
                        />
                    )}

                    <Button
                        appearance="default"
                        shouldFitContainer
                        isDisabled={!hasFavorite(issueId)}
                        onClick={() => removeFromAllGroups(issueId)}
                        isLoading={reasonLoading === EnumReasonLoading['removeFromAllGroups']}
                    >
                        Remove the issue from all its groups.
                    </Button>
                </FavoriteContentBox>
            )}
            trigger={(triggerProps) => (
                <IconButton
                    {...triggerProps}
                    icon={hasFavorite(issueId) ? StarFilledIcon : StarIcon}
                    label="Favorite"
                    // @ts-ignore
                    appearance="default"
                    spacing={isButtonCompact ? 'compact' : 'default'}
                    onClick={() => setIsOpen(!isOpen)}
                />
            )}
        />
    )
}

export default FavoriteIssue
