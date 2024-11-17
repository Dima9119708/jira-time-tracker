import Issue from './Issue'
import { useEffect } from 'react'
import { useGlobalState } from 'react-app/shared/lib/hooks/useGlobalState'
import { useIssuesGET } from 'react-app/entities/Issues'
import { Box, xcss } from '@atlaskit/primitives'
import Button from '@atlaskit/button/new'
import { useInView } from 'react-intersection-observer'
import { useErrorNotifier } from 'react-app/shared/lib/hooks/useErrorNotifier'
import { AxiosError } from 'axios'
import EmptyState from '@atlaskit/empty-state'
import Spinner from '@atlaskit/spinner'

const Issues = () => {
    const { ref, inView } = useInView()

    const { data, error, isLoading, isFetching, isFetchingNextPage, hasNextPage, fetchNextPage } = useIssuesGET({
        jql: () => useGlobalState.getState().jql,
    })

    const aaaa = useErrorNotifier(error)

    useEffect(() => {
        aaaa(AxiosError)
    }, [])

    useEffect(() => {
        if (inView && !isFetching) {
            fetchNextPage()
        }
    }, [inView, isFetching])

    return (
        <>
            {isFetching && (data?.pages[0]?.issues.length === 0) && (
                <EmptyState
                    header=""
                    description={<Spinner />}
                />
            )}
            {!isLoading && !isFetching && (data?.pages[0]?.issues.length === 0 || !data?.pages.length) && (
                <EmptyState
                    header="No Issues Found"
                    description="There are no issues matching your criteria. Please check your filters or search settings, or try again later."
                />
            )}
            {data?.pages.map((page) =>
                page.issues.map((task) => (
                    <Issue
                        key={task.id}
                        issueKey={task.key}
                        fields={task.fields}
                        id={task.id}
                    />
                ))
            )}

            {!isLoading && data?.pages && (data?.pages[0]?.issues.length > 0) && (
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
            )}
        </>
    )
}

export default Issues
