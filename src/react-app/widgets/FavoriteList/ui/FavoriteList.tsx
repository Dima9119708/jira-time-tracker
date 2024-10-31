import { useQuery } from '@tanstack/react-query'
import { axiosInstance } from 'react-app/shared/config/api/api'
import { Issue } from 'react-app/shared/types/Jira/Issues'
import { useGlobalState } from 'react-app/shared/lib/hooks/useGlobalState'
import EmptyState from '@atlaskit/empty-state'
import Spinner from '@atlaskit/spinner'
import Heading from '@atlaskit/heading'
import { Box, Flex, Grid, xcss } from '@atlaskit/primitives'
import { WatchController } from 'use-global-boolean'
import ChevronUpIcon from '@atlaskit/icon/glyph/chevron-up'
import ChevronDownIcon from '@atlaskit/icon/glyph/chevron-down'
import { useEffect } from 'react'

type FavoriteListData = { name: string; issues: Issue[] }[]

const FavoriteRenderIssues = ({ issueIds, name }: { name: string; issueIds: Issue['id'][] }) => {
    const { isPending, data, isFetching, refetch } = useQuery<Issue[]>({
        queryKey: ['favorite group', name],
        queryFn: async (context) => {
            const filteringDuplicates = new Set(issueIds)

            const response = await Promise.allSettled(
                filteringDuplicates
                    .entries()
                    .map(([, id]) => axiosInstance.get<Issue>('/issue', { params: { id }, signal: context.signal }))
            )

            const issueMap = new Map<Issue['id'], Issue>()

            response.forEach((value) => {
                if (value.status === 'fulfilled') {
                    issueMap.set(value.value.data.id, value.value.data)
                }
            })

            return issueIds.reduce((acc, id) => {
                if (issueMap.has(id)) {
                    acc.push(issueMap.get(id)!)
                }

                return acc
            }, [] as Issue[])
        },
        enabled: false
    })

    useEffect(() => {
        refetch()
    }, [issueIds])

    return !data?.length ? (
        <EmptyState
            header={isFetching ? '' : 'No favorite issues yet'}
            description={isFetching ? <Spinner /> : 'Add issues to your favorites to access them quickly here.'}
        />
    ) : (
        data.map((issue) => (
            <div
                key={issue.id}
                style={{ height: 176 }}
            >
                {issue.fields.summary}
            </div>
        ))
    )
}

const FavoriteList = () => {
    const favoriteList = useGlobalState((state) => state.settings.favorites)

    return !favoriteList.length ? (
        <EmptyState
            header={'No favorite issues'}
            description={null}
        />
    ) : (
        <Box xcss={xcss({ maxHeight: '400px', overflowY: 'auto',  marginBottom: 'space.300' })}>
            {
                favoriteList.map(({ name, issueIds }) => {
                    return (
                        <Grid
                            key={name}
                            templateColumns={`20px auto`}
                            xcss={xcss({ marginBottom: 'space.200' })}
                        >
                            <WatchController>
                                {({ globalMethods }) => {
                                    const [isOpenGroup] = globalMethods.watchBoolean(name)
                                    return (
                                        <Box
                                            onClick={() => globalMethods.toggle(name)}
                                            xcss={xcss({
                                                gridColumn: '1 / -1',
                                                backgroundColor: 'color.background.neutral',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                height: 'size.300',
                                            })}
                                        >
                                            <Heading size="small">{name}</Heading>
                                            {isOpenGroup ? (
                                                <ChevronUpIcon label="arrow up favorite" />
                                            ) : (
                                                <ChevronDownIcon label="arrow down favorite" />
                                            )}
                                        </Box>
                                    )
                                }}
                            </WatchController>

                            <WatchController name={name}>
                                {({ localState }) => {
                                    const [opened] = localState

                                    return (
                                        opened && (
                                            <>
                                                <Box
                                                    xcss={xcss({
                                                        backgroundColor: 'color.background.neutral',
                                                        width: '20px',
                                                        overflow: 'hidden',
                                                        position: 'relative',
                                                    })}
                                                >
                                                    <Box
                                                        xcss={xcss({
                                                            textAlign: 'center',
                                                            transform: 'translate(-50%, -50%) rotate(270deg)',
                                                            position: 'absolute',
                                                            top: '50%',
                                                            left: `calc(20px / 2)`,
                                                        })}
                                                    >
                                                        <Heading size="small">{name}</Heading>
                                                    </Box>
                                                </Box>
                                                <Box>
                                                    <FavoriteRenderIssues
                                                        name={name}
                                                        issueIds={issueIds}
                                                    />
                                                </Box>
                                            </>
                                        )
                                    )
                                }}
                            </WatchController>
                        </Grid>
                    )
                })
            }
        </Box>
    )
}

export default FavoriteList
