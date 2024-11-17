import Button, { IconButton } from '@atlaskit/button/new'
import StarIcon from '@atlaskit/icon/glyph/star'
import { Box, Flex, Text, xcss } from '@atlaskit/primitives'
import Heading from '@atlaskit/heading'
import ChevronDownIcon from '@atlaskit/icon/glyph/chevron-down'
import ChevronUpIcon from '@atlaskit/icon/glyph/chevron-up'
import { useGlobalBoolean } from 'use-global-boolean'
import EditorAddIcon from '@atlaskit/icon/glyph/editor/add'
import {
    AddGroup,
    EnumReasonLoading,
    FavoriteContentBox,
    useFavoriteControl,
    useFavoriteStore,
} from 'react-app/features/FavoriteIssue'
import { useEffect, useState } from 'react'
import { Popup } from '@atlaskit/popup'

const FavoriteButton = () => {
    const { toggle, watchBoolean } = useGlobalBoolean()
    const [isOpenAddGroup, setIsOpenAddGroup] = useState(false)
    const favoriteList = useFavoriteStore((state) => state.favorites)

    const [isOpenFavorite] = watchBoolean('FAVORITE LIST')
    const { reasonLoading, onAddNewGroup } = useFavoriteControl()

    useEffect(() => () => {
        setIsOpenAddGroup(false)
    }, [isOpenFavorite])

    return (
        <Box
            xcss={xcss({ marginBottom: 'space.300' })}

        >
            <Flex
                alignItems="center"
                justifyContent="center"
                columnGap="space.050"
                xcss={xcss({
                    backgroundColor: 'color.background.neutral',
                    cursor: 'pointer',
                    paddingBottom: 'space.100',
                    paddingTop: 'space.100',
                })}
            >
                <StarIcon label="Favorite" />

                <Box
                    xcss={xcss({
                        display: 'flex',
                        alignItems: 'center',
                        columnGap: 'space.050'
                    })}
                    onClick={() => {
                        toggle('FAVORITE LIST')
                    }}
                >
                    <Heading size="small">Favorite list {favoriteList.length ? `(${favoriteList.length})` : ''}</Heading>
                    {isOpenFavorite ? <ChevronUpIcon label="arrow up favorite" /> : <ChevronDownIcon label="arrow down favorite" />}
                </Box>


                {isOpenFavorite && (
                    <Popup
                        isOpen={isOpenAddGroup}
                        onClose={() =>  setIsOpenAddGroup(prevState => !prevState)}
                        content={() => (
                            <FavoriteContentBox>
                                <AddGroup
                                    isLoading={reasonLoading === EnumReasonLoading.add}
                                    onAdd={onAddNewGroup}
                                />
                            </FavoriteContentBox>
                        )}
                        trigger={(triggerProps) => (
                            <Box
                                {...triggerProps}
                                as="div"
                                xcss={xcss({
                                    // @ts-ignore
                                    '& > button': {
                                        height: '20px',
                                    },
                                })}
                                onClick={(e) => {
                                    e.stopPropagation()
                                    setIsOpenAddGroup(prevState => !prevState)
                                }}
                            >
                                <IconButton
                                    icon={EditorAddIcon}
                                    label="add favorite group"
                                    isLoading={reasonLoading === EnumReasonLoading.add}
                                />
                            </Box>
                        )}
                    />
                )}
            </Flex>
        </Box>
    )
}

export default FavoriteButton
