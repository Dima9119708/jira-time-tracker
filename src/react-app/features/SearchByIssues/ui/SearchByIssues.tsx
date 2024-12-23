import Textfield from '@atlaskit/textfield'
import { FormEvent, memo, useCallback, useEffect, useState } from 'react'
import { QueryObserver, useQuery, useQueryClient } from '@tanstack/react-query'
import { axiosInstance } from 'react-app/shared/config/api/api'
import EditorSearchIcon from '@atlaskit/icon/glyph/editor/search'
import EditorExpandIcon from '@atlaskit/icon/glyph/editor/expand'
import { IconButton } from '@atlaskit/button/new'
import { Box, xcss } from '@atlaskit/primitives'
import debounce from 'lodash.debounce'
import Spinner from '@atlaskit/spinner'
import { useErrorNotifier } from 'react-app/shared/lib/hooks/useErrorNotifier'
import EditorErrorIcon from '@atlaskit/icon/glyph/editor/error';
import ErrorIcon from '@atlaskit/icon/glyph/error';
import { token } from '@atlaskit/tokens'

interface Issue {
    id: number;
    key: string;
    keyHtml: string;
    img: string;
    summary: string;
    summaryText: string;
}

interface Section {
    label: string;
    id: string;
    msg?: string;
    sub?: string;
    issues: Issue[];
}

interface SearchResponse {
    sections: Section[];
}

export type SearchData = {
    issueIds: Issue['id'][],
    value: string
}

interface SearchByIssuesProps {
    width?: string
    value?: string
    isShowExpanded?: boolean
    onChange: (data: SearchData) => void
}

const SearchByIssues = (props: SearchByIssuesProps) => {
    const { onChange, width = '40%', value = '', isShowExpanded = true } = props

    const [searchValue, setSearchValue] = useState(value)
    const [previousValue, setPreviousValue] = useState(value)
    const [expanded, setExpanded] = useState(false)
    const queryClient = useQueryClient()

    const { refetch, isFetching, data, error } = useQuery({
        queryKey: ['searchIssues'],
        queryFn: async ({ signal }) => {
            if (searchValue === '') {
                onChange({
                    issueIds: [],
                    value: ''
                })

                return 1
            }

            const response = await axiosInstance.get<SearchResponse>('/issue/picker', {
                params: {
                    currentJQL: 'project in projectsWhereUserHasPermission("Work on issues")',
                    showSubTasks: true,
                    showSubTaskParent: true,
                    query: searchValue,
                },
                signal,
            })

            const data = response.data.sections.reduce((acc, section) => {

                acc.push(...section.issues.map((issue) => issue.id))

                return acc
            }, [] as SearchData['issueIds'])

            const filterDuplicates = new Set(data)

            onChange({
                issueIds: Array.from(filterDuplicates.values()),
                value: searchValue
            })

            return filterDuplicates.size
        },
        enabled: false,
        gcTime: 0
    })

    useErrorNotifier(error)

    useEffect(() => {
        const debouncedRefetch = debounce(() => {
            if (searchValue !== previousValue) {
                refetch()
                setPreviousValue(searchValue)
            }
        }, 500)

        debouncedRefetch()

        return () => {
            debouncedRefetch.cancel()
        }
    }, [searchValue, previousValue, refetch])

    useEffect(() => {
        if (value === '') {
            setSearchValue('')
            queryClient.removeQueries({
                queryKey: ['searchIssues']
            })
        }
    }, [value])

    const handleSearchChange = useCallback((e: FormEvent<HTMLInputElement>) => {
        setSearchValue(e.currentTarget.value)
    }, [])

    return (
        <Box xcss={xcss({ width: expanded ? '100%' : width })}>
            <Textfield
                isInvalid={data === 0}
                isCompact
                elemBeforeInput={data === 0 ? <ErrorIcon label="search issues" primaryColor={token('color.text.danger')} /> : <EditorSearchIcon label="search issues" />}
                elemAfterInput={
                    isShowExpanded && <IconButton
                        onClick={() => {
                            if (isFetching) return

                            if (searchValue.length > 0) {
                               return setSearchValue('')
                            }

                            setExpanded((prevState) => !prevState)
                        }}
                        icon={searchValue ? EditorErrorIcon : isFetching ? Spinner : EditorExpandIcon}
                        label="search issues expand"
                    />
                }
                value={searchValue}
                placeholder="Search issues"
                onChange={handleSearchChange}
            />
        </Box>
    )
}

export default memo(SearchByIssues)
