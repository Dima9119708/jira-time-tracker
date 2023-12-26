import { useInView } from 'react-intersection-observer'
import { useInfiniteQuery } from '@tanstack/react-query'
import { queryGetTasks } from '../model/queryOptions'
import { Button } from '@mantine/core'
import { memo, useEffect } from 'react'
import { cn } from '../../../shared/lib/classNames '
import { useLoaderData } from 'react-router-dom'

const LoadMore = () => {
    const JQLString = useLoaderData() as string
    const { ref, inView } = useInView()
    const { isFetching, isFetchingNextPage, hasNextPage, fetchNextPage } = useInfiniteQuery(queryGetTasks(JQLString))

    useEffect(() => {
        if (inView && !isFetching) {
            fetchNextPage()
        }
    }, [inView, isFetching])

    return (
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
}

export default memo(LoadMore)
