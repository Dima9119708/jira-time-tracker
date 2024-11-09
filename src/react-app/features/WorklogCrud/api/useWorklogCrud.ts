import { useWorklogsGET } from 'react-app/entities/Worklogs'
import { useIssueWorklogDELETE, useIssueWorklogPOST, useIssueWorklogPUT, useIssueWorklogsGET } from 'react-app/entities/IssueWorklogs'
import { useNotifications } from 'react-app/shared/lib/hooks/useNotifications'
import { UseGetWorklogsProps } from 'react-app/entities/Worklogs/api/useWorklogsGET'
import { useQuery } from '@tanstack/react-query'
import { axiosInstance } from 'react-app/shared/config/api/api'
import { PLUGINS, useGlobalState } from 'react-app/shared/lib/hooks/useGlobalState'
import { useFilterPUT } from 'react-app/entities/Filters'
import { useCallback } from 'react'
import { UseGetIssueWorklogs } from 'react-app/entities/IssueWorklogs/api/useIssueWorklogsGET'
import { PutIssueWorklog } from 'react-app/entities/IssueWorklogs/api/useIssueWorklogPUT'
import { DeleteIssueWorklog } from 'react-app/entities/IssueWorklogs/api/useIssueWorklogDELETE'
import { CreateIssueWorklog } from 'react-app/entities/IssueWorklogs/api/useIssueWorklogPOST'

interface UseWorklogCrudProps extends Pick<UseGetWorklogsProps, 'to' | 'from'>, Partial<Pick<UseGetIssueWorklogs, 'issueId'>> {
    enabledGetIssueWorklogs?: boolean
    enabledGetWorklogs?: boolean
    put?: {
        onSuccess: (variables: PutIssueWorklog) => void
    }
    post?: {
        onSuccess: (variables: CreateIssueWorklog) => void
    }
    delete?: {
        onSuccess: (variables: DeleteIssueWorklog) => void
    }
}

enum TimeTrackingProviderKeys {
    JIRA = 'JIRA',
    TEMPO = 'is.origo.jira.tempo-plugin__timetracking-provider',
}

export const useWorklogCrud = (props: UseWorklogCrudProps) => {
    const { from, to, enabledGetWorklogs = true, enabledGetIssueWorklogs = false, issueId = '' } = props
    const notify = useNotifications()

    const filterPUT = useFilterPUT({
        titleLoading: ' ',
        titleSuccess: ' ',
    })

    const timeTrackingProvider = useQuery({
        queryKey: ['time tracking provider'],
        queryFn: async (context) => {
            const [provider] = await Promise.allSettled([
                axiosInstance.get<{ key: string; name: string }>('/configuration-timetracking-provider', {
                    signal: context.signal,
                }),
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
        notifyOnChangeProps: [],
    })

    const prefetch = useCallback(async () => {
        if (!timeTrackingProvider.isStale) return

        const provider = await timeTrackingProvider.refetch()

        const currentPluginName = useGlobalState.getState().settings.plugin

        if (provider.data !== currentPluginName && provider.data !== 403) {
            await filterPUT.mutateAsync({
                settings: {
                    plugin: provider.data,
                },
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
        prefetch: prefetch,
        enabled: enabledGetWorklogs,
    })

    const issueWorklogs = useIssueWorklogsGET({
        from: from,
        to: to,
        issueId,
        prefetch: prefetch,
        enabled: enabledGetIssueWorklogs,
    })

    const worklogPOST = useIssueWorklogPOST({
        prefetch: prefetch,
        onMutate: () => {
            return notify.loading({
                title: 'Worklog issue',
            })
        },
        onSuccess: (data, variables, context) => {
            context?.()

            props.post?.onSuccess?.(variables)

            if (enabledGetWorklogs) {
                worklogs.refetch()
            }

            if (enabledGetIssueWorklogs) {
                issueWorklogs.refetch()
            }
        },
        onError: (error, variables, context) => {
            context?.()

            if (enabledGetWorklogs) {
                worklogs.refetch()
            }

            if (enabledGetIssueWorklogs) {
                issueWorklogs.refetch()
            }
        },
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

            props.put?.onSuccess?.(variables)

            if (enabledGetWorklogs) {
                worklogs.refetch()
            }

            if (enabledGetIssueWorklogs) {
                issueWorklogs.refetch()
            }
        },
        onError: (error, variables, context) => {
            context?.()
            notify.error({
                title: `Error worklog issue`,
                description: JSON.stringify(error.response?.data),
            })

            if (enabledGetWorklogs) {
                worklogs.refetch()
            }

            if (enabledGetIssueWorklogs) {
                issueWorklogs.refetch()
            }
        },
    })

    const worklogDELETE = useIssueWorklogDELETE({
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

            props.delete?.onSuccess?.(variables)

            if (enabledGetWorklogs) {
                worklogs.refetch()
            }

            if (enabledGetIssueWorklogs) {
                issueWorklogs.refetch()
            }
        },
        onError: (error, variables, context) => {
            context?.()
            notify.error({
                title: `Error worklog issue`,
                description: JSON.stringify(error.response?.data),
            })

            if (enabledGetWorklogs) {
                worklogs.refetch()
            }

            if (enabledGetIssueWorklogs) {
                issueWorklogs.refetch()
            }
        },
    })

    return {
        worklogPOST,
        worklogDELETE,
        worklogPUT,
        worklogs,
        issueWorklogs,
    }
}
