import { AxiosError, AxiosResponse } from 'axios'
import { useMutation } from '@tanstack/react-query'
import { axiosInstance } from 'react-app/shared/config/api/api'
import { Filter } from 'react-app/shared/types/Jira/Filter'
import { UseGlobalState, useGlobalState } from 'react-app/shared/lib/hooks/useGlobalState'
import { useNotifications } from 'react-app/shared/lib/hooks/useNotifications'
import { useCallback } from 'react'
import { useErrorNotifier } from 'react-app/shared/lib/hooks/useErrorNotifier'
import { useSuccessNotifier } from 'react-app/shared/lib/hooks/useSuccessNotifier'

interface FilterPUT<TCustomVariable> {
    settings?: Partial<UseGlobalState['settings']>
    jql?: Filter['jql']
    variables?: TCustomVariable
}

export const useFilterPUT = <TCustomVariable>(props?: {
    titleLoading?: string
    titleSuccess?: string
    titleError?: string
    onMutate?: (variables: FilterPUT<TCustomVariable>) => void
    onSuccess?: (data: Filter, variables: FilterPUT<TCustomVariable>) => void
    onError?: (error: AxiosError, variables: FilterPUT<TCustomVariable>) => void
}) => {
    const titleLoading = props?.titleLoading ?? 'Loading...'
    const titleSuccess = props?.titleSuccess
    const titleError = props?.titleError
    const notify = useNotifications()

    const handleError = useErrorNotifier()
    const handleSuccess = useSuccessNotifier()

    const isFormEmpty = useCallback((values: any) => {
        if (typeof values === 'object' && values !== null) {
            return Object.values(values).every(isFormEmpty)
        }
        return values === ''
    }, [])

    return useMutation<AxiosResponse<Filter>, AxiosError, FilterPUT<TCustomVariable>, Function | undefined>({
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
        onMutate: (variables) => {
            props?.onMutate?.(variables)

            if (titleLoading && titleLoading.trim()) {
                return notify.loading({
                    title: titleLoading,
                })
            }
        },
        onSuccess: (data, variables, context) => {
            context?.()

            if (titleSuccess && titleSuccess.trim()) {
               handleSuccess(data)
            }

            useGlobalState.getState().updateJQL(data.data.jql)
            useGlobalState.getState().parseAndSaveSetting(data.data.description)

            props?.onSuccess?.(data.data, variables)
        },
        onError: (error, variables, context) => {
            context?.()

            if (titleError && titleError.trim()) {
               handleError(error)
            }

            props?.onError?.(error, variables)
        },
    })
}
