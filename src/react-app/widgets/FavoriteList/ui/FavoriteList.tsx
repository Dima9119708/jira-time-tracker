import { useQuery } from '@tanstack/react-query'
import { axiosInstance } from 'react-app/shared/config/api/api'
import { Issue } from 'react-app/shared/types/Jira/Issues'
import { useGlobalState } from 'react-app/shared/lib/hooks/useGlobalState'
import EmptyState from '@atlaskit/empty-state'
import Spinner from '@atlaskit/spinner'
import Heading from '@atlaskit/heading'
import { Box, Grid, xcss } from '@atlaskit/primitives'

type FavoriteListData = { name: string; issues: Issue[] }[]

const FavoriteList = () => {
    const favoriteList = useGlobalState((state) => state.settings.favorites)

    const { isPending, data } = useQuery<FavoriteListData>({
        queryKey: ['favorite list'],
        queryFn: async (context) => {
            const ids = favoriteList.reduce(
                (acc, favorite) => {
                    acc.push(...favorite.issueIds)

                    return acc
                },
                [] as Issue['id'][]
            )

            const filteringDuplicates = new Set(ids)

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

            return favoriteList.reduce((acc, favorite) => {
                const favoriteGroup: FavoriteListData[number] = {
                    issues: [],
                    name: favorite.name,
                }

                acc.push(favoriteGroup)

                favorite.issueIds.forEach((id) => {
                    if (issueMap.has(id)) {
                        favoriteGroup.issues.push(issueMap.get(id)!)
                    }
                })

                return acc
            }, [] as FavoriteListData)
        },
    })

    return !data?.length ? (
        <EmptyState
            header={isPending ? '' : 'No favorite issues'}
            description={isPending ? <Spinner /> : null}
        />
    ) : (
        data.map(({ name, issues }) => {
            return (
                <>
                    <Grid templateColumns="auto auto">
                        <Box xcss={xcss({ gridColumn: '1 / -1', backgroundColor: 'color.background.neutral' })}>
                            <Heading size="small">{name}</Heading>
                        </Box>
                        <Box xcss={xcss({ backgroundColor: 'color.background.neutral' })}>
                            <Heading size="small">{name}</Heading>
                        </Box>
                        <Box>
                            {issues.map((issue) => (
                                <div>{issue.fields.summary}</div>
                            ))}
                        </Box>
                    </Grid>
                </>
            )
        })
    )
}

export default FavoriteList
