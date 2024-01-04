import { useInView } from 'react-intersection-observer'
import { useInfiniteQuery } from '@tanstack/react-query'
import { Button } from '@mantine/core'
import { memo, useEffect } from 'react'
import { cn } from '../../../shared/lib/classNames '
import { queryGetIssues } from '../model/queryOptions'

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
            <Button
                variant="light"
                color="blue"
                onClick={() => fetchNextPage()}
                fullWidth
            >
                {isFetchingNextPage ? 'Loading more...' : hasNextPage ? 'Load More' : 'Nothing more to load'}
                <span
                    ref={ref}
                    className={cn('invisible', {
                        hidden: isFetchingNextPage,
                    })}
                />
            </Button>
        )
    )
}

export default memo(LoadMore)
