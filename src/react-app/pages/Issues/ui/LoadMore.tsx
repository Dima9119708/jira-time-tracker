import { useInView } from 'react-intersection-observer'
import { useInfiniteQuery } from '@tanstack/react-query'
import { memo, useEffect } from 'react'
import { queryGetIssues } from '../model/queryOptions'
import Button from '@atlaskit/button/new'
import { Box, xcss } from '@atlaskit/primitives'

const LoadMore = () => {
    const { ref, inView } = useInView()
    const { isLoading, isFetching, isFetchingNextPage, hasNextPage, fetchNextPage } = useInfiniteQuery(queryGetIssues())

    useEffect(() => {
        if (inView && !isFetching) {
            fetchNextPage()
        }
    }, [inView, isFetching])

    return (
        !isLoading && (
            <Box xcss={xcss({ marginTop: 'space.400' })}>
                <Button
                    appearance={isFetchingNextPage ? 'default' : hasNextPage ? 'primary' : 'default'}
                    onClick={() => fetchNextPage()}
                    shouldFitContainer
                >
                    {isFetchingNextPage ? 'Loading more...' : hasNextPage ? 'Load More' : 'Nothing more to load'}
                    <Box
                        ref={ref}
                        xcss={xcss({
                            display: isFetchingNextPage ? 'none' : 'block',
                        })}
                    />
                </Button>
            </Box>
        )
    )
}

export default memo(LoadMore)
