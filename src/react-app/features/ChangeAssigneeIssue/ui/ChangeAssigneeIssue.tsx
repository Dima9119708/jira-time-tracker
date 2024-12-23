import { useMutation, useQueryClient } from '@tanstack/react-query'
import { axiosInstance } from '../../../shared/config/api/api'
import AssignableSearchByIssueDropdown from 'react-app/entities/UserSearch/ui/AssignableSearchByIssueDropdown'
import { AxiosError, AxiosResponse } from 'axios'
import { ErrorType } from '../../../shared/types/Jira/ErrorType'
import { InfiniteData } from '@tanstack/react-query/build/modern/index'
import { produce } from 'immer'
import { ChangeAssigneeProps } from '../types/types'
import { useNotifications } from 'react-app/shared/lib/hooks/useNotifications'
import { Assignee, IssueResponse } from 'react-app/shared/types/Jira/Issues'
import { useErrorNotifier } from 'react-app/shared/lib/hooks/useErrorNotifier'

const ChangeAssigneeIssue = (props: ChangeAssigneeProps) => {
    const { issueKey, assignee, queryKeys, position = 'bottom-start', onSuccess } = props

    const queryClient = useQueryClient()

    const notify = useNotifications()

    const handleAxiosError = useErrorNotifier()

    const { mutate } = useMutation<
        AxiosResponse<Assignee>,
        AxiosError<ErrorType>,
        Assignee,
        { dismissFn: Function; oldStates: Array<[string, InfiniteData<IssueResponse> | IssueResponse['issues']]> | undefined; notificationMessage: string }
    >({
        mutationFn: (variables, ) =>
            axiosInstance.put<Assignee>('/issue-assignee', { accountId: variables.accountId }, { params: { issueKey: issueKey } }),
        onMutate: async (variables) => {

            const oldStates: Array<[string, InfiniteData<IssueResponse> | IssueResponse['issues']]>  = []

            for (const queryKey of queryKeys()) {
                await queryClient.cancelQueries({ queryKey: [queryKey] })

                const oldState = queryClient.getQueryData<InfiniteData<IssueResponse> | IssueResponse['issues']>([queryKey])

                if (oldState) {
                    queryClient.setQueryData(
                        [queryKey],
                        (old: InfiniteData<IssueResponse> | IssueResponse['issues']): InfiniteData<IssueResponse> | IssueResponse['issues'] => {
                            if (Array.isArray(old)) {
                                return produce(old, (draft) => {
                                    const issue = draft.find(({ key }) => key === issueKey)

                                    if (issue) {
                                        issue.fields.assignee = variables
                                    }
                                })
                            } else {
                                return produce(old, (draft) => {
                                    for (const page of draft.pages) {
                                        const issue = page.issues.find(({ key }) => key === issueKey);

                                        if (issue) {
                                            issue.fields.assignee = variables;
                                            break;
                                        }
                                    }
                                })
                            }
                        }
                    )

                    oldStates.push([queryKey, oldState])
                }
            }

            const notificationMessage = `from ${assignee?.displayName ?? 'Unassigned'} to ${variables.displayName}`

            const dismissFn = notify.loading({
                title: 'Assignee changes',
                description: notificationMessage,
            })

            return {
                oldStates,
                dismissFn,
                notificationMessage,
            }
        },
        onSuccess: (data, variables, context) => {
            context!.dismissFn()
            notify.success({
                title: 'Assignee changes',
                description: context!.notificationMessage,
            })

            if (typeof onSuccess === 'function') {
                onSuccess()
            }

            queryClient.invalidateQueries()
        },
        onError: (error, variables, context) => {
            context!.dismissFn()

            handleAxiosError(error)

            if (Array.isArray(context?.oldStates)) {
                for (const [queryKey, oldState] of context.oldStates) {
                    queryClient.setQueryData(
                        [queryKey],
                        (old: InfiniteData<IssueResponse> | IssueResponse['issues']): InfiniteData<IssueResponse> | IssueResponse['issues'] => {
                            return produce(old, (draft) => {
                                Object.assign(draft, oldState)
                            })
                        }
                    )
                }
            }
        },
    })

    return (
        <AssignableSearchByIssueDropdown
            assignee={assignee}
            issueKey={issueKey}
            onChange={mutate}
            position={position}
        />
    )
}

export default ChangeAssigneeIssue
