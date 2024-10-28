import { AxiosError, AxiosResponse } from 'axios'
import { useMutation } from '@tanstack/react-query'
import { axiosInstance } from 'react-app/shared/config/api/api'
import { Filter } from 'react-app/shared/types/Filter'
import { UseGlobalState, useGlobalState } from 'react-app/shared/lib/hooks/useGlobalState'
import { useNotifications } from 'react-app/shared/lib/hooks/useNotifications'

interface FilterPUT {
    settings?: Partial<UseGlobalState['settings']>
    jql?: Filter['jql']
}

export const useFilterPUT = (props?: {
    titleLoading?: string
    titleSuccess?: string
    titleError?: string
    onSuccess?: (data: Filter, variables: FilterPUT) => void
    onError?: (error: AxiosError, variables: FilterPUT) => void
}) => {
    const titleLoading = props?.titleLoading ?? 'Loading...'
    const titleSuccess = props?.titleSuccess ?? 'Update settings'
    const titleError = props?.titleError ?? 'Update settings'
    const notify = useNotifications()

    return useMutation<AxiosResponse<Filter>, AxiosError, FilterPUT, Function | undefined>({
        mutationFn: async (data) => {
            const bodyData = { jql: data.jql }

            const description = JSON.stringify({
                ...useGlobalState.getState().settings,
                ...data.settings,
            })

            Object.assign(bodyData, {
                description: description,
            })

            return await axiosInstance.put('/filter', bodyData, {
                params: {
                    id: useGlobalState.getState().filterId,
                },
            })
        },
        onMutate: () => {
            return notify.loading({
                title: titleLoading,
            })
        },
        onSuccess: (data, variables, context) => {
            context?.()

            if (titleSuccess) {
                notify.success({
                    title: titleSuccess,
                })
            }

            useGlobalState.getState().updateJQL(data.data.jql)
            useGlobalState.getState().parseAndSaveSetting(data.data.description)

            props?.onSuccess?.(data.data, variables)
        },
        onError: (error, variables, context) => {
            context?.()

            if (titleError) {
                notify.error({
                    title: titleError,
                    description: JSON.stringify(error.response?.data),
                })
            }

            props?.onError?.(error, variables)
        },
    })
}
