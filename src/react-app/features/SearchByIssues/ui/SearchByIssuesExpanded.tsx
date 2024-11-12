import { Issue, IssueResponse } from 'react-app/shared/types/Jira/Issues'
import { InfiniteData, useInfiniteQuery, useQuery, useQueryClient } from '@tanstack/react-query'
import { axiosInstance } from 'react-app/shared/config/api/api'
import { Box, Flex, xcss, Text } from '@atlaskit/primitives'
import Image from '@atlaskit/image'
import ChevronDownIcon from '@atlaskit/icon/glyph/chevron-down'
import ChevronUpIcon from '@atlaskit/icon/glyph/chevron-up'
import { memo, useCallback, useEffect, useState } from 'react'
import { Popup, PopupProps } from '@atlaskit/popup'
import { SearchByIssues, SearchData } from 'react-app/features/SearchByIssues'
import { queryGetIssues } from 'react-app/entities/Issues'
import EmptyState from '@atlaskit/empty-state'
import Spinner from '@atlaskit/spinner'
import { DropdownItem } from '@atlaskit/dropdown-menu'
import { useInView } from 'react-intersection-observer'
import Button from '@atlaskit/button/new'

interface SearchByIssuesExpandedProps {
    issueId?: Issue['id'],
    onChange: (issue: Issue) => void,
    placement?: PopupProps['placement']
}

interface IssueItemProps {
    iconUrl: Issue['fields']['issuetype']['iconUrl']
    summary: Issue['fields']['summary']
    issueKey: Issue['key'],
    onSelect: (issueKey: IssueItemProps['issueKey']) => void
    isSelected: boolean
}

const styles = {
    wrap: xcss({
        wordBreak: 'break-all',
        backgroundColor: 'color.background.input',
        padding: 'space.050',
        paddingLeft: 'space.100',
        borderWidth: '1px',
        borderRadius: 'border.radius.100',
        borderStyle: 'solid',
        borderColor: 'color.border.input',
        cursor: 'pointer',
    }),
    content: xcss({
        padding: 'space.200',
    }),
    wrapIssues: xcss({
        marginTop: 'space.100',
        paddingBottom: 'space.300',
        maxHeight: '300px',
        overflow: 'auto',
    }),
}

const IssueItem = memo(
    (props: IssueItemProps) => {
        return (
            <DropdownItem isSelected={props.isSelected} onClick={() => props.onSelect(props.issueKey)}>
                <Flex
                    alignItems="start"
                    columnGap="space.150"
                >
                    <Image src={props.iconUrl} />
                    <Flex direction="column">
                        <Text>{props.issueKey}</Text>
                        <Text color="color.text.accent.gray">{props.summary}</Text>
                    </Flex>
                </Flex>
            </DropdownItem>
        )
    }
)

const Content = (props: SearchByIssuesExpandedProps & { issueKey: Issue['key'], onClose?: () => void }) => {
    const { issueKey, onChange } = props
    const { ref, inView } = useInView()
    const [jql, setJql] = useState('')
    const queryClient = useQueryClient()

    const issueQuery = useInfiniteQuery(
        queryGetIssues(() => ({
            queryKey: ['search issues', jql],
            jql: jql,
            maxResults: 8,
        }))
    )

    useEffect(() => {
        if (inView && !issueQuery.isFetching) {
            issueQuery.fetchNextPage()
        }
    }, [inView, issueQuery.isFetching])

    const onSearch = useCallback((searchData: SearchData) => {
        setJql(searchData.issueIds.length ? `issue in (${searchData.issueIds.join(',')})` : '')
    }, [])

    const onSelect = useCallback((issueKey: IssueItemProps['issueKey']) => {
        const issuesData = queryClient.getQueryData<InfiniteData<IssueResponse>>(['search issues', jql])

        if (issuesData) {
            for (const issues of issuesData.pages) {
                const currentIssue = issues.issues.find(({ key }) => key === issueKey)

                if (currentIssue) {
                    queryClient.setQueryData<Issue>(['issue', currentIssue.id], currentIssue)
                    onChange(currentIssue)
                    props.onClose?.()
                    break
                }
            }
        }
    }, [jql])

    return (
        <Box xcss={styles.content}>
            <SearchByIssues
                onChange={onSearch}
                width="100%"
                isShowExpanded={false}
            />

            <Box xcss={styles.wrapIssues}>
                {issueQuery.isLoading && (
                    <EmptyState
                        header=""
                        description={<Spinner />}
                    />
                )}

                {issueQuery.data?.pages.map((page) => {
                    return page.issues.map((issue) => (
                        <IssueItem
                            key={issue.id}
                            issueKey={issue.key}
                            iconUrl={issue.fields.issuetype.iconUrl}
                            summary={issue.fields.summary}
                            onSelect={onSelect}
                            isSelected={issue.key === issueKey}
                        />
                    ))
                })}

                <Box xcss={xcss({ marginTop: 'space.300' })} />

                <Button
                    appearance={issueQuery.isFetchingNextPage ? 'default' : issueQuery.hasNextPage ? 'primary' : 'default'}
                    onClick={() => issueQuery.fetchNextPage()}
                    shouldFitContainer
                >
                    {issueQuery.isFetchingNextPage
                        ? 'Loading more...'
                        : issueQuery.hasNextPage
                            ? 'Load More'
                            : 'Nothing more to load'}
                    <Box
                        ref={ref}
                        xcss={xcss({
                            display: issueQuery.isFetchingNextPage ? 'none' : 'block',
                        })}
                    />
                </Button>
            </Box>
        </Box>
    )
}

const SearchByIssuesExpanded = (props: SearchByIssuesExpandedProps) => {
    const { issueId, onChange, placement = 'bottom-start' } = props
    const [isOpen, setIsOpen] = useState(false)

    const currentIssueQuery = useQuery({
        queryKey: ['issue', issueId],
        queryFn: async (context) => {
            const response = await axiosInstance.get<Issue>('/issue', { params: { id: issueId }, signal: context.signal })
            return response.data
        },
        enabled: !!issueId,
    })

    const icon = currentIssueQuery.data?.fields?.issuetype.iconUrl || ''
    const key = currentIssueQuery.data?.key || ''
    const summary = currentIssueQuery.data?.fields?.summary || ''

    return (
        <Popup
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            placement={placement}
            shouldRenderToParent
            shouldFitContainer
            content={() => (
               isOpen && <Content onChange={onChange} issueKey={key} onClose={() => setIsOpen(false)} />
            )}
            trigger={(triggerProps) => (
                <Box
                    {...triggerProps}
                    xcss={styles.wrap}
                    onClick={() => setIsOpen((prevState) => !prevState)}
                >
                    <Flex
                        justifyContent="space-between"
                        alignItems="center"
                    >
                        {!currentIssueQuery.isLoading && currentIssueQuery.data && (
                            <Flex columnGap="space.100">
                                <Image src={icon} />
                                <Text>
                                    {key} · {summary}
                                </Text>
                            </Flex>
                        )}

                        {currentIssueQuery.isLoading && <Text>Loading...</Text>}

                        {!currentIssueQuery.isLoading && !currentIssueQuery.data && <Text>No issue selected</Text>}

                        {isOpen ? <ChevronUpIcon label="dropdown arrow" /> : <ChevronDownIcon label="dropdown arrow" />}
                    </Flex>
                </Box>
            )}
        />
    )
}

export default memo(SearchByIssuesExpanded)
