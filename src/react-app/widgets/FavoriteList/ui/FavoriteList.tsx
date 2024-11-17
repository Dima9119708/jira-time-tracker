import { useQuery } from '@tanstack/react-query'
import { axiosInstance } from 'react-app/shared/config/api/api'
import { Issue, IssueResponse } from 'react-app/shared/types/Jira/Issues'
import { useGlobalState } from 'react-app/shared/lib/hooks/useGlobalState'
import EmptyState from '@atlaskit/empty-state'
import Spinner from '@atlaskit/spinner'
import Heading from '@atlaskit/heading'
import { Box, Flex, Grid, xcss } from '@atlaskit/primitives'
import ChevronUpIcon from '@atlaskit/icon/glyph/chevron-up'
import ChevronDownIcon from '@atlaskit/icon/glyph/chevron-down'
import StarIcon from '@atlaskit/icon/glyph/star'
import { memo, useEffect, useState } from 'react'
import { useFavoriteControl, useFavoriteStore, EnumReasonLoading } from 'react-app/features/FavoriteIssue'
import { IconButton } from '@atlaskit/button/new'
import InlineEdit from '@atlaskit/inline-edit'
import Textfield from '@atlaskit/textfield'
import EditorEditIcon from '@atlaskit/icon/glyph/editor/edit';
import EditorRemoveIcon from '@atlaskit/icon/glyph/editor/remove';
import IssueComponent from './Issue'
import { ConfirmDelete } from 'react-app/shared/components/ConfirmDelete'
import { useErrorNotifier } from 'react-app/shared/lib/hooks/useErrorNotifier'

const FavoriteGroupIssues = memo(({ issueIds, name }: { name: string; issueIds: Issue['id'][] }) => {
    const queryKey = `favorite group ${name}`

    const { data, isFetching, refetch, error } = useQuery<Issue[]>({
        queryKey: [queryKey],
        queryFn: async (context) => {
            const filteringDuplicates = new Set(issueIds)

            const ids = Array.from(filteringDuplicates)

            const responses = await axiosInstance.get<IssueResponse>('/issues', {
                params: {
                    jql: `issue in (${ids.join(',')})`,
                    maxResults: ids.length,
                },
                signal: context.signal,
            })

            const issueMap = new Map<Issue['id'], Issue>()

            responses.data?.issues.forEach((issue) => {
                issueMap.set(issue.id, issue)
            })

            return issueIds.reduce((acc, id) => {
                if (issueMap.has(id)) {
                    acc.push(issueMap.get(id)!)
                }

                return acc
            }, [] as Issue[])
        },
    })

    useErrorNotifier(error)

    useEffect(() => {
        refetch()
    }, [issueIds])

    return !data?.length ? (
        <EmptyState
            header={isFetching ? '' : 'This group has no issues.'}
            description={isFetching ? <Spinner /> : ''}
        />
    ) : (
        data.map((issue, idx) => (
            <IssueComponent
                key={issue.id}
                fields={issue.fields}
                issueKey={issue.key}
                id={issue.id}
                queryKey={queryKey}
            />
        ))
    )
})

const FavoriteGroup = (props: { name: Issue['fields']['summary']; issueIds: Issue['id'][] }) => {
    const { name, issueIds } = props
    const [opened, setOpened] = useState(false)

    const [value, setValue] = useState(name)
    const [isEdit, setIsEdit] = useState(false)

    const { reasonLoading, onRemoveGroup, onEditGroup } = useFavoriteControl()

    return (
        <Grid
            templateColumns={`20px auto`}
            xcss={xcss({
                marginBottom: 'space.200',
                // @ts-ignore
                '&:last-child': {
                    marginBottom: 0,
                },
            })}
        >
            <Box

                xcss={xcss({
                    gridColumn: '1 / -1',
                    backgroundColor: 'color.background.neutral',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 'space.100',
                })}
            >
                <StarIcon label="favorite group" />

                <Box
                    xcss={xcss({
                        // @ts-ignore
                        '& > form, & > form > div': {
                            marginBottom: 0,
                            marginBlockStart: 0,
                        },
                    })}
                    onClick={() => {
                        if (!isEdit) {
                            setOpened((prevState) => !prevState)
                        }
                    }}
                >
                    <InlineEdit
                        isEditing={isEdit}
                        defaultValue={value}
                        editButtonLabel={value}
                        editView={({ errorMessage, ...fieldProps }) => (
                            <Textfield
                                {...fieldProps}
                                autoFocus
                            />
                        )}
                        readView={() => (
                            <Box xcss={xcss({ maxWidth: '200px', wordBreak: 'break-all' })}>
                                <Heading size="small">{value}</Heading>
                            </Box>
                        )}
                        onConfirm={(value) => {
                            if (!value) return
                            if (value === name) return

                            onEditGroup(name, value)
                            setValue(value)
                            setIsEdit((prevState) => !prevState)
                        }}
                        onCancel={() => setIsEdit((prevState) => !prevState)}
                    />
                </Box>

                {opened ? <ChevronUpIcon label="arrow up favorite" /> : <ChevronDownIcon label="arrow down favorite" />}

                <Box xcss={xcss({
                    display: 'flex',
                    columnGap: 'space.100',
                    // @ts-ignore
                    '& > button': {
                        height: '20px',
                    },
                })}>
                    <IconButton
                        icon={EditorEditIcon}
                        label="edit"
                        isDisabled={reasonLoading === EnumReasonLoading.choose || reasonLoading === EnumReasonLoading.remove}
                        isLoading={reasonLoading === EnumReasonLoading.edit}
                        onClick={(e) => {
                            e.stopPropagation()
                            setIsEdit((prevState) => !prevState)
                        }}
                    />
                    <ConfirmDelete
                        icon={EditorRemoveIcon}
                        title="Are you sure you want to delete this group?"
                        isLoading={reasonLoading === EnumReasonLoading.remove}
                        isDisabled={reasonLoading === EnumReasonLoading.choose || reasonLoading === EnumReasonLoading.edit}
                        onYes={() => {
                            onRemoveGroup(name)
                        }}
                    />
                </Box>
            </Box>

            {opened && (
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
                    <Box xcss={xcss({ paddingTop: 'space.100', paddingLeft: 'space.100', paddingRight: 'space.100' })}>
                        <FavoriteGroupIssues
                            name={name}
                            issueIds={issueIds}
                        />
                    </Box>
                </>
            )}
        </Grid>
    )
}

const FavoriteList = () => {
    const favoriteList = useFavoriteStore((state) => state.favorites)

    useEffect(() => {
        useFavoriteStore.setState((state) => {
            state.favorites = useGlobalState.getState().settings.favorites
        })
    }, [])

    return !favoriteList.length ? (
        <EmptyState
            header={'No groups have been added yet.'}
            description={null}
        />
    ) : (
        <Box xcss={xcss({ marginBottom: 'space.400', display: 'flex', columnGap: 'space.100' })}>
            <Box xcss={xcss({ width: '20px', backgroundColor: 'color.background.neutral', marginTop: 'space.negative.300' })} />

            <Box xcss={xcss({ flex: 1 })}>
                {favoriteList.map(({ name, issueIds }) => {
                    return (
                        <FavoriteGroup
                            key={name}
                            name={name}
                            issueIds={issueIds}
                        />
                    )
                })}
            </Box>
        </Box>
    )
}

export default FavoriteList
