import { useWorklogsGET } from 'react-app/entities/Worklogs'
import { useIssueWorklogDELETE, useIssueWorklogPOST, useIssueWorklogPUT, useIssueWorklogsGET } from 'react-app/entities/IssueWorklogs'
import { useNotifications } from 'react-app/shared/lib/hooks/useNotifications'
import { UseGetWorklogsProps } from 'react-app/entities/Worklogs/api/useWorklogsGET'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { axiosInstance } from 'react-app/shared/config/api/api'
import { PLUGINS, useGlobalState } from 'react-app/shared/lib/hooks/useGlobalState'
import { useFilterPUT } from 'react-app/entities/Filters'
import { useCallback, useMemo, useRef } from 'react'
import { UseGetIssueWorklogs } from 'react-app/entities/IssueWorklogs/api/useIssueWorklogsGET'
import { PutIssueWorklog } from 'react-app/entities/IssueWorklogs/api/useIssueWorklogPUT'
import { DeleteIssueWorklog } from 'react-app/entities/IssueWorklogs/api/useIssueWorklogDELETE'
import { CreateIssueWorklog } from 'react-app/entities/IssueWorklogs/api/useIssueWorklogPOST'
import { AxiosError } from 'axios'

interface UseWorklogCrudProps<MutatePost, MutatePut, MutateDelete> extends Pick<UseGetWorklogsProps, 'to' | 'from'>, Partial<Pick<UseGetIssueWorklogs, 'issueId'>> {
    enabledGetIssueWorklogs?: boolean
    enabledGetWorklogs?: boolean
    enabledAllNotifications?: boolean
    put?: {
        onMutate?: (variables: PutIssueWorklog) => MutatePut
        onSuccess?: (variables: PutIssueWorklog, context?: MutatePut) => void
        onError?: (error: AxiosError, variables: PutIssueWorklog, context: MutatePut | undefined) => void
    }
    post?: {
        onMutate?: (variables: CreateIssueWorklog) => MutatePost
        onSuccess?: (variables: CreateIssueWorklog, context?: MutatePost) => void
        onError?: (error: AxiosError, variables: CreateIssueWorklog, context: MutatePost | undefined) => void
    }
    delete?: {
        onMutate?: (variables: DeleteIssueWorklog) => MutateDelete
        onSuccess?: (variables: DeleteIssueWorklog, context?: MutateDelete) => void
        onError?: (error: AxiosError, variables: DeleteIssueWorklog, context: MutateDelete | undefined) => void
    }
}

enum TimeTrackingProviderKeys {
    JIRA = 'JIRA',
    TEMPO = 'is.origo.jira.tempo-plugin__timetracking-provider',
}

export const useWorklogCrud = <MutatePost = null, MutatePut = null, MutateDelete = null>(props: UseWorklogCrudProps<MutatePost, MutatePut, MutateDelete>) => {
    const { from, to, enabledGetWorklogs = true, enabledGetIssueWorklogs = false, issueId = '', enabledAllNotifications = true } = props
    const queryClient = useQueryClient()
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

    const mutationKey = 'mutation worklog'

    const issueWorklogs = useIssueWorklogsGET({
        from: from,
        to: to,
        issueId,
        prefetch: prefetch,
        enabled: enabledGetIssueWorklogs,
    })

    const worklogPOST = useIssueWorklogPOST({
        // gcTime: Infinity,
        mutationKey: [mutationKey],
        prefetch: prefetch,
        onMutate: ((variables) => {
            if (typeof props.post?.onMutate === 'function') {
                return props.post?.onMutate?.(variables)
            }

            return notify.loading({
                title: 'Worklog issue',
            })
        }),
        onSuccess: (data, variables, context) => {
            if (typeof props.post?.onMutate !== 'function') {
                // @ts-ignore
                context?.()
            }

            if (enabledAllNotifications) {
                notify.success({
                    title: `Worklog issue created`,
                })
            }

            props.post?.onSuccess?.(variables)

            if (enabledGetWorklogs) {
                worklogs.refetch()
            }

            if (enabledGetIssueWorklogs) {
                issueWorklogs.refetch()
            }
        },
        onError: (error, variables, context) => {
            if (typeof props.post?.onMutate !== 'function') {
                // @ts-ignore
                context?.()
            }

            if (typeof props.post?.onError === 'function') {
                // @ts-ignore
                props.post?.onError?.(error, variables, context)
            }

            if (enabledAllNotifications) {
                notify.error({
                    title: `Error worklog issue`,
                    description: JSON.stringify(error.response?.data),
                })
            }

            if (enabledGetWorklogs) {
                worklogs.refetch()
            }

            if (enabledGetIssueWorklogs) {
                issueWorklogs.refetch()
            }
        },
    })

    const worklogPUT = useIssueWorklogPUT({
        gcTime: Infinity,
        mutationKey: [mutationKey],
        prefetch: prefetch,
        onMutate: ((variables) => {
            if (typeof props.put?.onMutate === 'function') {
                return props.put?.onMutate(variables)
            }

            return notify.loading({
                title: 'Worklog issue',
            })
        }),
        onSuccess: (data, variables, context) => {
            if (typeof props.put?.onMutate !== 'function') {
                // @ts-ignore
                context?.()
            }

            if (enabledAllNotifications) {
                notify.success({
                    title: 'Success worklog issue',
                })
            }

            props.put?.onSuccess?.(variables)

            if (enabledGetWorklogs) {
                worklogs.refetch()
            }

            if (enabledGetIssueWorklogs) {
                issueWorklogs.refetch()
            }
        },
        onError: (error, variables, context) => {
            if (typeof props.put?.onMutate !== 'function') {
                // @ts-ignore
                context?.()
            }

            if (typeof props.put?.onError === 'function') {
                // @ts-ignore
                props.put?.onError?.(error, variables, context)
            }

            if (enabledAllNotifications) {
                notify.error({
                    title: `Error worklog issue`,
                    description: JSON.stringify(error.response?.data),
                })
            }

            if (enabledGetWorklogs) {
                worklogs.refetch()
            }

            if (enabledGetIssueWorklogs) {
                issueWorklogs.refetch()
            }
        },
    })

    const worklogDELETE = useIssueWorklogDELETE({
        gcTime: Infinity,
        mutationKey: [mutationKey],
        prefetch: prefetch,
        onMutate: (variables) => {
            if (typeof props.delete?.onMutate === 'function') {
                return props.delete?.onMutate?.(variables)
            }

            return notify.loading({
                title: 'Worklog issue',
            })
        },
        onSuccess: (data, variables, context) => {
            if (typeof props.delete?.onMutate !== 'function') {
                // @ts-ignore
                context?.()
            }

            if (enabledAllNotifications) {
                notify.success({
                    title: 'Success worklog issue',
                })
            }

            props.delete?.onSuccess?.(variables)

            if (enabledGetWorklogs && variables.customFields?.isRefetchWorklogsAfterDelete !== false) {
                worklogs.refetch()
            }

            if (enabledGetIssueWorklogs && variables.customFields?.isRefetchWorklogsAfterDelete !== false) {
                issueWorklogs.refetch()
            }
        },
        onError: (error, variables, context) => {
            if (typeof props.delete?.onMutate !== 'function') {
                // @ts-ignore
                context?.()
            }

            if (typeof props.delete?.onError === 'function') {
                // @ts-ignore
                props.delete?.onError?.(error, variables, context)
            }

            if (enabledAllNotifications) {
                notify.error({
                    title: `Error worklog issue`,
                    description: JSON.stringify(error.response?.data),
                })
            }


            if (enabledGetWorklogs) {
                worklogs.refetch()
            }

            if (enabledGetIssueWorklogs) {
                issueWorklogs.refetch()
            }
        },
    })

    const wasMutationSuccessfulAndCacheCleared = useCallback(() => {
        const mutationCache = queryClient.getMutationCache()

        const allMutations = mutationCache.findAll({ mutationKey: [mutationKey] })

        for (const mutationCacheElement of allMutations) {
           mutationCache.remove(mutationCacheElement)
        }

        return allMutations.length > 0
    }, [mutationKey])

    return {
        worklogPOST,
        worklogDELETE,
        worklogPUT,
        worklogs,
        issueWorklogs,
        wasMutationSuccessfulAndCacheCleared,
    }
}
