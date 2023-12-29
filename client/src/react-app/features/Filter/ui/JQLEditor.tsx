import { JQLEditorAsync } from '@atlassianlabs/jql-editor'
import { useAutocompleteProvider } from '@atlassianlabs/jql-editor-autocomplete-rest'
import { getInitialData, getSuggestions } from '../service/service'
import { cn } from '../../../shared/lib/classNames '
import { FilterProps } from '../types/types'
import { memo } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { axiosInstance } from '../../../shared/config/api/api'
import { FilterDetails } from '../../../pages/Issues/types/types'
import { useGlobalState } from '../../../shared/lib/hooks/useGlobalState'
import { AxiosError, AxiosResponse } from 'axios'
import { ErrorType } from '../../../shared/types/jiraTypes'
import { notifications } from '@mantine/notifications'
import { NOTIFICATION_AUTO_CLOSE, NOTIFICATION_VARIANT } from '../../../shared/const/notifications'
import { IconCheck } from '@tabler/icons-react'
import { rem } from '@mantine/core'

const JQLEditor = (props: FilterProps) => {
    const { className } = props
    const queryClient = useQueryClient()
    const query = useGlobalState((state) => state.jql)

    const { mutate, isPending } = useMutation<AxiosResponse<FilterDetails>, AxiosError<ErrorType>>({
        mutationFn: () =>
            axiosInstance.put<FilterDetails>(
                '/filter-details',
                {
                    jql: useGlobalState.getState().jql,
                },
                {
                    params: {
                        id: useGlobalState.getState().filterId,
                    },
                }
            ),
        onMutate: () => {
            const id = notifications.show({
                title: 'Searching',
                message: '',
                loading: true,
            })

            queryClient
                .invalidateQueries({ queryKey: ['tasks'] })
                .then(() => {
                    notifications.update({
                        id,
                        title: 'Searching',
                        message: '',
                        icon: <IconCheck style={{ width: rem(18), height: rem(18) }} />,
                        loading: false,
                        autoClose: NOTIFICATION_AUTO_CLOSE,
                    })
                })
                .catch(() => {
                    notifications.hide(id)
                })
        },
        onError: (error) => {
            notifications.show({
                title: `Error loading issue`,
                message: error.response?.data.errorMessages.join(', '),
                ...NOTIFICATION_VARIANT.ERROR,
            })
        },
    })

    const autocompleteProvider = useAutocompleteProvider('autocomplete', getInitialData, getSuggestions)

    return (
        <div className={cn('mb-[1.5rem] [&_div_div:nth-child(1)]:bg-[var(--mantine-color-default)]', className)}>
            <JQLEditorAsync
                isSearching={isPending}
                analyticsSource={'autocomplete'}
                query={query}
                onSearch={(jql, jast) => {
                    if (jast.errors.length === 0 && jast.represents !== useGlobalState.getState().jql) {
                        useGlobalState.getState().updateJQL(jql)
                        mutate()
                    }
                }}
                autocompleteProvider={autocompleteProvider}
                locale={'en'}
            />
        </div>
    )
}

export default memo(JQLEditor)
