import Button from '@atlaskit/button/new'
import StarIcon from '@atlaskit/icon/glyph/star'
import { Box, Flex, Text, xcss } from '@atlaskit/primitives'
import Heading from '@atlaskit/heading'
import ChevronDownIcon from '@atlaskit/icon/glyph/chevron-down'
import ChevronUpIcon from '@atlaskit/icon/glyph/chevron-up'
import { useGlobalBoolean } from 'use-global-boolean'

const FavoriteButton = () => {
    const { toggle, watchBoolean } = useGlobalBoolean()

    const [isOpenFavorite] = watchBoolean('FAVORITE LIST')

    return (
        <Box xcss={xcss({ marginBottom: 'space.250' })}>
            <Button
                shouldFitContainer
                onClick={() => toggle('FAVORITE LIST')}
            >
                <Flex
                    alignItems="center"
                    justifyContent="center"
                    columnGap="space.050"
                >
                    <StarIcon label="Favorite" />
                    <Heading size="small">Favorite list</Heading>
                    {isOpenFavorite ? <ChevronUpIcon label="arrow up favorite" /> : <ChevronDownIcon label="arrow down favorite" />}
                </Flex>
            </Button>
        </Box>
    )
}

export default FavoriteButton
