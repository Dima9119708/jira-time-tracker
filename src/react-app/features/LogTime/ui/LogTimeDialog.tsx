import Modal, { ModalBody, ModalFooter, ModalHeader, ModalTitle } from '@atlaskit/modal-dialog'
import { globalBooleanActions, useGlobalBoolean } from 'use-global-boolean'
import Button, { IconButton } from '@atlaskit/button/new'
import { Controller, useForm } from 'react-hook-form'
import Textfield from '@atlaskit/textfield'
import { ErrorMessage, Label } from '@atlaskit/form'
import CrossIcon from '@atlaskit/icon/glyph/cross'
import { Box, Flex, Text, xcss } from '@atlaskit/primitives'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { AxiosError, AxiosResponse } from 'axios'
import { IssuesTrackingResponse, WorklogIssueDelete, WorklogIssueMutation, WorklogResponse } from 'react-app/pages/Issues/types/types'
import { ErrorType } from 'react-app/shared/types/jiraTypes'
import { axiosInstance } from 'react-app/shared/config/api/api'
import { useNotifications } from 'react-app/shared/lib/hooks/useNotifications'
import dayjs from 'dayjs'
import Image from '@atlaskit/image'
import Heading from '@atlaskit/heading'
import TextArea from '@atlaskit/textarea'
import TrashIcon from '@atlaskit/icon/glyph/trash'
import { convertJiraTimeToSeconds } from 'react-app/entities/IssueWorklogs'
import { DATE_FORMAT } from 'react-app/shared/const'
import { getWorklogComment, worklogCommentTemplate } from 'react-app/entities/IssueWorklogs'
import { useGlobalState } from 'react-app/shared/lib/hooks/useGlobalState'

export const LogTimeButton = (props: { issueId: string; uniqueNameBoolean: string }) => {
    return (
        <Button
            appearance="discovery"
            onClick={() => {
                globalBooleanActions.setTrue(props.uniqueNameBoolean, props.issueId)
            }}
        >
            Log time
        </Button>
    )
}

type FormValues = {
    timeSpent: string
    description: string
    worklog: WorklogResponse['worklogs'][number] | undefined
}

export const LogTimeDialog = (props: { issueId: string; queryKey: string; uniqueNameBoolean: string }) => {
    const { issueId, queryKey, uniqueNameBoolean } = props
    const { setFalse } = useGlobalBoolean()
    const queryClient = useQueryClient()

    const { handleSubmit, control, setValue } = useForm<FormValues>({
        mode: 'onBlur',
    })
    const notify = useNotifications()

    const { isFetching: isFetchingIssues } = useQuery({ queryKey: [queryKey], notifyOnChangeProps: ['isFetching'], enabled: false })

    const worklogUpdate = useMutation<
        AxiosResponse<WorklogIssueMutation>,
        AxiosError<ErrorType>,
        WorklogIssueMutation,
        { oldState: IssuesTrackingResponse | undefined }
    >({
        mutationFn: (variables) => {
            if (variables.id) return axiosInstance.put<WorklogIssueMutation>('/worklog-task', variables)
            else return axiosInstance.post<WorklogIssueMutation>('/worklog-task', variables)
        },
        onSuccess: () => {
            queryClient
                .invalidateQueries({
                    queryKey: [queryKey],
                })
                .then(() => {
                    notify.success({
                        title: 'Success worklog issue',
                    })
                    setFalse(uniqueNameBoolean)
                })
        },
        onError: (error) => {
            notify.error({
                title: `Error worklog issue`,
                description: JSON.stringify(error.response?.data),
            })
        },
    })

    const worklogs = useQuery<AxiosResponse<WorklogResponse>, AxiosError<ErrorType>, WorklogResponse>({
        queryKey: ['worklog issue', issueId],
        queryFn: () =>
            axiosInstance.get<WorklogResponse>('/worklog-task', {
                params: { id: issueId },
            }),
        select: (data) => {
            const worklogs = data.data.worklogs.toSorted((a, b) => (dayjs(a.started).isBefore(dayjs(b.started)) ? 1 : -1))

            return {
                ...data.data,
                worklogs: worklogs,
            }
        },
    })

    const worklogDelete = useMutation<AxiosResponse<WorklogIssueDelete>, AxiosError<ErrorType>, WorklogIssueDelete, Function>({
        mutationFn: (variables) => {
            return axiosInstance.delete<WorklogIssueDelete>('/issue-worklog', {
                params: variables,
            })
        },
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
        },
    })

    const onSave = (data: FormValues) => {
        const { workingHoursPerDay, workingDaysPerWeek } = useGlobalState.getState()

        worklogUpdate.mutate({
            taskId: issueId,
            ...(data.worklog ? { id: data.worklog.id } : undefined),
            timeSpentSeconds: convertJiraTimeToSeconds(data.timeSpent, workingDaysPerWeek, workingHoursPerDay),
            ...worklogCommentTemplate(data.description || ''),
        })
    }

    const onCancel = () => {
        if (worklogDelete.isSuccess) {
            queryClient
                .invalidateQueries({
                    queryKey: [queryKey],
                })
                .then(() => {
                    setFalse(uniqueNameBoolean)
                })
                .catch((error) => {
                    notify.error({
                        title: `Error worklog issue`,
                        description: JSON.stringify(error.response?.data),
                    })
                })
        } else {
            setFalse(uniqueNameBoolean)
        }
    }

    return (
        <Modal onClose={onCancel}>
            <ModalHeader>
                <ModalTitle>Log time</ModalTitle>

                <IconButton
                    appearance="subtle"
                    icon={CrossIcon}
                    label="Close Modal"
                    onClick={onCancel}
                />
            </ModalHeader>
            <ModalBody>
                <Controller
                    name="timeSpent"
                    control={control}
                    rules={{
                        required: 'Required',
                    }}
                    render={({ field, fieldState }) => {
                        return (
                            <>
                                <Label htmlFor="timeSpent">Time spent</Label>
                                <Textfield
                                    value={field.value}
                                    id="timeSpent"
                                    onChange={field.onChange}
                                    onBlur={field.onBlur}
                                    placeholder="Use the format 2w 3d 4h 5m"
                                />
                                {!!fieldState.error?.message && <ErrorMessage>{fieldState.error?.message}</ErrorMessage>}
                            </>
                        )
                    }}
                />
                <Box xcss={xcss({ marginTop: 'space.100', marginBottom: 'space.100' })}>
                    <Text>Use the format 2w 3d 4h 5m</Text>
                </Box>
                <ul>
                    <li>w = weeks</li>
                    <li>d = days</li>
                    <li>h = hours</li>
                    <li>m = minutes</li>
                </ul>

                <Box xcss={xcss({ paddingTop: 'space.100', paddingBottom: 'space.100' })}>
                    <Controller
                        name="description"
                        control={control}
                        render={({ field, fieldState }) => {
                            return (
                                <>
                                    <Label htmlFor="description">Description</Label>
                                    <TextArea
                                        resize="vertical"
                                        value={field.value}
                                        id="Description"
                                        onChange={field.onChange}
                                        onBlur={field.onBlur}
                                        placeholder="Description"
                                        onPointerEnterCapture={undefined}
                                        onPointerLeaveCapture={undefined}
                                    />
                                </>
                            )
                        }}
                    />
                </Box>

                <Box xcss={xcss({ paddingTop: 'space.150', paddingBottom: 'space.100' })}>
                    {!!worklogs.data?.worklogs.length && (
                        <Box xcss={xcss({ marginBottom: 'space.075' })}>
                            <Heading size="small">Worklogs:</Heading>
                        </Box>
                    )}

                    <Controller
                        name="worklog"
                        control={control}
                        render={({ field }) => {
                            return (
                                <>
                                    {worklogs.data?.worklogs.map((worklog) => (
                                        <Box
                                            xcss={xcss({
                                                boxShadow: 'elevation.shadow.overlay',
                                                display: 'grid',
                                                gap: 'space.100',
                                                borderRadius: 'border.radius.200',
                                                marginBottom: 'space.200',
                                                padding: 'space.200',
                                                cursor: 'pointer',
                                                backgroundColor:
                                                    field.value?.id === worklog.id
                                                        ? 'color.background.accent.blue.subtler'
                                                        : 'color.background.input',
                                            })}
                                            onClick={() => {
                                                if (field.value?.id === worklog.id) {
                                                    field.onChange(undefined)
                                                    setValue('timeSpent', '')
                                                    setValue('description', '')
                                                } else {
                                                    field.onChange(worklog)
                                                    setValue('timeSpent', worklog.timeSpent)
                                                    setValue('description', getWorklogComment(worklog))
                                                }
                                            }}
                                        >
                                            <Flex columnGap="space.100">
                                                <Text weight="bold">User:</Text>

                                                <Flex columnGap="space.100">
                                                    <Image
                                                        src={worklog.author.avatarUrls?.['48x48']}
                                                        height="20px"
                                                        width="20px"
                                                    />
                                                    <Text weight="medium">{worklog.author.displayName}</Text>
                                                </Flex>
                                            </Flex>
                                            <Flex columnGap="space.100">
                                                <Text weight="bold">Date:</Text>
                                                <Text weight="medium">{dayjs(worklog.started).format(DATE_FORMAT)}</Text>
                                            </Flex>
                                            <Flex columnGap="space.100">
                                                <Text weight="bold">Logged:</Text>
                                                <Text weight="medium">{worklog.timeSpent}</Text>
                                            </Flex>
                                            <Flex columnGap="space.100">
                                                <Text weight="bold">Description: </Text>
                                                <Text weight="medium">{getWorklogComment(worklog) || '==//=='}</Text>
                                            </Flex>

                                            <Flex justifyContent="end">
                                                <IconButton
                                                    icon={TrashIcon}
                                                    isLoading={worklogDelete.variables?.id === worklog.id && worklogDelete.isPending}
                                                    label="Delete"
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        setValue('worklog', undefined)
                                                        worklogDelete.mutate({ taskId: issueId, id: worklog.id })
                                                    }}
                                                />
                                            </Flex>
                                        </Box>
                                    ))}
                                </>
                            )
                        }}
                    />
                </Box>
            </ModalBody>
            <ModalFooter>
                <Button
                    appearance="default"
                    onClick={onCancel}
                >
                    Cancel
                </Button>
                <Button
                    isLoading={worklogUpdate.isPending || isFetchingIssues}
                    onClick={handleSubmit(onSave)}
                    appearance="primary"
                >
                    Save
                </Button>
            </ModalFooter>
        </Modal>
    )
}
