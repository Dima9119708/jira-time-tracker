import Skeleton from '@atlaskit/skeleton'
import { tokensMap } from '@atlaskit/primitives/dist/types/xcss/xcss'
import { Box, Flex, xcss } from '@atlaskit/primitives'

interface SkeletonsProps {
    count: number,
    height: number | string
    width: number | string
    gap: (keyof typeof tokensMap['gap'])
}

const Skeletons = (props: SkeletonsProps) => {
    const { height, count, width, gap } = props

    return (
        <Flex direction="column" gap={gap}>
            {
                Array.from({ length: count }).map((_, index) => (
                    <Skeleton height={height} width={width}  />
                ))
            }
        </Flex>
    );
};

export default Skeletons;
