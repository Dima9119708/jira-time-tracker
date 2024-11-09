import { axiosInstance } from 'react-app/shared/config/api/api'
import { useQuery } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { JQLAutocompleteSuggestionsResponse } from '@atlaskit/jql-editor-autocomplete-rest'

interface StatusesResponse {
    values: Status[]
}

interface Status {
    name: string
    id: string
    statusCategory: 'TODO' | 'IN_PROGRESS' | 'DONE'
    usages: string[]
}

export const useStatusesSearchGET = (props: { projectIds: string[]; opened: boolean }) => {
    const { projectIds, opened } = props

    return useQuery({
        enabled: opened,
        queryKey: ['statuses'],
        queryFn: async () => {
            const reserveApi = async () => {
                const response = await axiosInstance.get<JQLAutocompleteSuggestionsResponse>('/jql-search', {
                    params: {
                        url: '/rest/api/latest/jql/autocompletedata/suggestions?fieldName=status',
                    },
                })

                return {
                    values: response.data.results.map((result) => {
                        return {
                            id: result.value,
                            name: result.displayName,
                            statusCategory: result.displayName.toUpperCase(),
                            usages: [],
                        }
                    }) as Status[],
                }
            }

            try {
                const requests = projectIds.length === 0
                    ? [
                        axiosInstance.get<StatusesResponse>('/statuses', {
                            params: { expand: 'workflowUsages,usages' },
                        }),
                    ]
                    : projectIds.map((projectId) =>
                        axiosInstance.get<StatusesResponse>('/statuses', {
                            params: { projectId, expand: 'workflowUsages,usages' },
                        })
                    );

                const responses = await Promise.all(requests);

                const uniqueStatuses = new Map<string, Status>();

                responses.forEach((response) => {
                    response.data.values
                        .filter((status) => status.usages.length > 0)
                        .forEach((status) => {
                            if (!uniqueStatuses.has(status.name)) {
                                uniqueStatuses.set(status.name, status);
                            }
                        });
                });

                const filteredValues = Array.from(uniqueStatuses.values());

                return filteredValues.length > 0
                    ? { values: filteredValues }
                    : await reserveApi();
            } catch (e) {
                if (e instanceof AxiosError) {
                    if (e.response?.status === 403) {
                        return await reserveApi()
                    }
                }
            }

        },
    })
}
