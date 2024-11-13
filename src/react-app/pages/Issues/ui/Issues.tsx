import Issue from './Issue'
import { useEffect } from 'react'
import { useNotifications } from 'react-app/shared/lib/hooks/useNotifications'
import { useGlobalState } from 'react-app/shared/lib/hooks/useGlobalState'
import { useIssuesGET } from 'react-app/entities/Issues'
import { Box, xcss } from '@atlaskit/primitives'
import Button from '@atlaskit/button/new'
import { useInView } from 'react-intersection-observer'

const Issues = () => {
    const { ref, inView } = useInView()
    const notify = useNotifications()

    const { data, error, isLoading, isFetching, isFetchingNextPage, hasNextPage, fetchNextPage } = useIssuesGET({
        jql: () => useGlobalState.getState().jql,
        onFilteringIssues: (data) => {
            const tasksIDS = useGlobalState.getState().getIssueIdsSearchParams()

            return {
                ...data,
                issues: data.issues.filter((issue) => !tasksIDS.includes(issue.id)),
            }
        },
    })

    useEffect(() => {
        if (error) {
            notify.error({
                title: `Error loading task`,
                description: JSON.stringify(error.response?.data),
            })
        }
    }, [error])

    useEffect(() => {
        if (inView && !isFetching) {
            fetchNextPage()
        }
    }, [inView, isFetching])

    return (
        <>
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

            {!isLoading && (
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
