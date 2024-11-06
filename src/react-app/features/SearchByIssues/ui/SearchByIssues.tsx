import Textfield from '@atlaskit/textfield'
import { FormEvent, useCallback, useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { axiosInstance } from 'react-app/shared/config/api/api'
import EditorSearchIcon from '@atlaskit/icon/glyph/editor/search'
import EditorExpandIcon from '@atlaskit/icon/glyph/editor/expand'
import { IconButton } from '@atlaskit/button/new'
import { Box, xcss } from '@atlaskit/primitives'
import debounce from 'lodash.debounce'
import Spinner from '@atlaskit/spinner'
import { getValueFromJql } from 'react-app/shared/lib/utils/getValueFromJql'

interface SearchByIssuesProps {
    width?: string
    initialValue?: string
    onChange: (jql: string) => void
}

const SearchByIssues = (props: SearchByIssuesProps) => {
    const { onChange, width = '40%', initialValue = '' } = props

    const [searchValue, setSearchValue] = useState(initialValue)
    const [previousValue, setPreviousValue] = useState(initialValue)
    const [expanded, setExpanded] = useState(false)

    const { refetch, isFetching } = useQuery({
        queryKey: ['searchIssues'],
        queryFn: async ({ signal }) => {
            const responses = await Promise.allSettled([
                axiosInstance.get('/issues', {
                    params: {
                        jql: `text ~ "${searchValue}*" OR description ~ "${searchValue}*"`,
                    },
                    signal,
                }),
                axiosInstance.get('/issues', {
                    params: {
                        jql: `issueKey = "${searchValue}"`,
                    },
                    signal,
                }),
            ])

            const jqlArray: string[] = []

            responses.forEach((response) => {
                if (response.status === 'fulfilled') {
                    jqlArray.push(response.value.config.params.jql)
                }
            })

            onChange(jqlArray.join(' OR '))
        },
        enabled: false,
    })

    useEffect(() => {
        getValueFromJql<string>(initialValue, 'text')
            .then((value) => {
                const v = value.replace(/\*$/, '')

                setSearchValue(v)
                setPreviousValue(v)
            })
            .catch(() => {})
    }, [])

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

    const handleSearchChange = useCallback((e: FormEvent<HTMLInputElement>) => {
        setSearchValue(e.currentTarget.value)
    }, [])

    return (
        <Box xcss={xcss({ width: expanded ? '100%' : width })}>
            <Textfield
                isCompact
                elemBeforeInput={<EditorSearchIcon label="search issues" />}
                elemAfterInput={
                    <IconButton
                        onClick={() => (isFetching ? null : setExpanded((prevState) => !prevState))}
                        icon={isFetching ? Spinner : EditorExpandIcon}
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

export default SearchByIssues
