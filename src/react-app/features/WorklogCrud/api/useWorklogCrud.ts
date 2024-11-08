import { useWorklogsGET } from 'react-app/entities/Worklogs'
import { useIssueWorklogDELETE, useIssueWorklogPOST, useIssueWorklogPUT } from 'react-app/entities/IssueWorklogs'
import { useNotifications } from 'react-app/shared/lib/hooks/useNotifications'
import { UseGetWorklogsProps } from 'react-app/entities/Worklogs/api/useWorklogsGET'
import { useQuery } from '@tanstack/react-query'
import { axiosInstance } from 'react-app/shared/config/api/api'
import { PLUGINS, useGlobalState } from 'react-app/shared/lib/hooks/useGlobalState'
import { useFilterPUT } from 'react-app/entities/Filters'
import { useCallback } from 'react'

interface UseWorklogCrudProps extends UseGetWorklogsProps {}

enum TimeTrackingProviderKeys {
    JIRA = 'JIRA',
    TEMPO = 'is.origo.jira.tempo-plugin__timetracking-provider',
}

export const useWorklogCrud = (props: UseWorklogCrudProps) => {
    const { from, to } = props
    const notify = useNotifications()

    const filterPUT = useFilterPUT({
        titleLoading: ' ',
        titleSuccess: ' ',
    })

    const timeTrackingProvider = useQuery({
        queryKey: ['time tracking provider'],
        queryFn: async (context) => {
            const [provider] = await Promise.allSettled([
                axiosInstance.get<{ key: string, name: string }>('/configuration-timetracking-provider', {
                    signal: context.signal
                })
            ])

            if (provider.status === 'fulfilled') {
                if (provider.value.data.key === TimeTrackingProviderKeys.JIRA) {
                    return null
                }
                if (provider.value.data.key === TimeTrackingProviderKeys.TEMPO) {
                    return PLUGINS.TEMPO
                }
            }

            if (provider.status === 'rejected' && provider.reason.response.status !== 403) {
                throw new Error(JSON.stringify(provider.reason.response.data))
            }

            return 403
        },
        staleTime: 15 * 60 * 1000,
        enabled: false,
        notifyOnChangeProps: []
    })

    const prefetch = useCallback(async () => {
        if (!timeTrackingProvider.isStale) return

        const provider = await timeTrackingProvider.refetch()

        const currentPluginName = useGlobalState.getState().settings.plugin

        if (provider.data !== currentPluginName && provider.data !== 403) {
            await filterPUT.mutateAsync({
                settings: {
                    plugin: provider.data,
                }
            })
        }

        if (provider.data === 403) {
            useGlobalState.setState((state) => {
                state.hasJiraTimeTrackingPermission = false
            })
        }
    }, [timeTrackingProvider.isStale])

    const worklogs = useWorklogsGET({
        from: from,
        to: to,
        prefetch: prefetch
    })

    const worklogPOST = useIssueWorklogPOST({
        prefetch: prefetch
    })

    const worklogPUT = useIssueWorklogPUT({
        prefetch: prefetch,
        onMutate: () => {
            return notify.loading({
                title: 'Worklog issue',
            })
        },
        onSuccess: (data, variables, context) => {
            context?.()
            notify.success({
                title: 'Success worklog issue',
            })
            worklogs.refetch()
        },
        onError: (error, variables, context) => {
            context?.()
            notify.error({
                title: `Error worklog issue`,
                description: JSON.stringify(error.response?.data),
            })

            worklogs.refetch()
        },
    })

    const worklogDelete = useIssueWorklogDELETE({
        prefetch: prefetch,
        onMutate: () => {
            return notify.loading({
                title: 'Worklog issue',
            })
        },
        onSuccess: (data, variables, context) => {
            context?.()
            notify.success({
                title: 'Success worklog issue',
            })
            worklogs.refetch()
        },
        onError: (error, variables, context) => {
            context?.()
            notify.error({
                title: `Error worklog issue`,
                description: JSON.stringify(error.response?.data),
            })

            worklogs.refetch()
        },
    })

    return {
        worklogPOST,
        worklogDelete,
        worklogPUT,
        worklogs
    }
}
