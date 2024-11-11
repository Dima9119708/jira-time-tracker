import Modal, { ModalBody, ModalFooter, ModalHeader, ModalTitle } from '@atlaskit/modal-dialog'
import { globalBooleanActions, useGlobalBoolean } from 'use-global-boolean'
import Button, { IconButton } from '@atlaskit/button/new'
import { Controller, useForm } from 'react-hook-form'
import Textfield from '@atlaskit/textfield'
import { ErrorMessage, Label } from '@atlaskit/form'
import CrossIcon from '@atlaskit/icon/glyph/cross'
import { Box, Flex, Text, xcss } from '@atlaskit/primitives'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useNotifications } from 'react-app/shared/lib/hooks/useNotifications'
import dayjs from 'dayjs'
import Image from '@atlaskit/image'
import Heading from '@atlaskit/heading'
import TextArea from '@atlaskit/textarea'
import CopyIcon from '@atlaskit/icon/glyph/copy'
import { Worklog } from 'react-app/entities/Worklogs'
import { DatePicker } from '@atlaskit/datetime-picker'
import { DATE_FORMAT } from 'react-app/shared/const'
import { TimeFormatGuide } from 'react-app/shared/components/TimeFormatGuide'
import { useWorklogCrud } from 'react-app/features/WorklogCrud'
import { secondsToUIFormat } from 'react-app/shared/lib/helpers/secondsToUIFormat'
import { ConfirmDelete } from 'react-app/shared/components/ConfirmDelete'
import { useCallback, useMemo, useState } from 'react'
import { SearchByIssuesExpanded } from 'react-app/features/SearchByIssues'
import { Issue } from 'react-app/shared/types/Jira/Issues'

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
    date: string
    timeSpent: string
    description: string
    worklog: Worklog | undefined
}

const DEFAULT_VALUES: FormValues = {
    date: dayjs().format(DATE_FORMAT),
    timeSpent: '',
    description: '',
    worklog: undefined,
}

export const LogTimeDialog = (props: { issueId: string; queryKey: string; uniqueNameBoolean: string }) => {
    const { issueId: issueIdProps, queryKey, uniqueNameBoolean } = props
    const { setFalse } = useGlobalBoolean()
    const queryClient = useQueryClient()
    const [issueId, setIssueId] = useState(issueIdProps)

    const { handleSubmit, control, setValue, reset, getValues } = useForm<FormValues>({
        mode: 'onBlur',
        defaultValues: DEFAULT_VALUES,
    })
    const notify = useNotifications()

    const { isFetching: isFetchingIssues } = useQuery({ queryKey: [queryKey], notifyOnChangeProps: ['isFetching'], enabled: false })

    const {
        worklogPUT: issueWorklogPUT,
        issueWorklogs,
        worklogPOST: issueWorklogPOST,
        worklogDELETE: issueWorklogDelete,
    } = useWorklogCrud({
        issueId: issueId,
        enabledGetWorklogs: false,
        enabledGetIssueWorklogs: true,
        post: {
            onSuccess: () => {
                reset(DEFAULT_VALUES)
            },
        },
        put: {
            onSuccess: () => {
                reset(DEFAULT_VALUES)
            },
        },
        delete: {
            onSuccess: (variables) => {
                if (getValues('worklog')?.id === variables.id) {
                    reset({
                        ...DEFAULT_VALUES,
                        worklog: undefined,
                    })
                }
            },
        },
    })

    const totalTime = useMemo(() => {
        if (issueWorklogs.data) {
            const total = issueWorklogs.data.reduce((acc, worklog) => acc + worklog.timeSpentSeconds, 0)

            return secondsToUIFormat(total, true)
        }

        return ''
    }, [issueWorklogs.data])

    const onChangeIssue = useCallback((issue: Issue) => {
        setIssueId(issue.id)
    }, [])

    const onSave = (data: FormValues) => {
        if (data.worklog) {
            issueWorklogPUT.mutate({
                issueId,
                id: data.worklog.id,
                timeSpent: data.timeSpent,
                startDate: data.date,
                description: data.description,
            })
        } else {
            issueWorklogPOST.mutate({
                issueId,
                startDate: data.date,
                timeSpent: data.timeSpent,
                description: data.description,
            })
        }
    }

    const onCancel = () => {
        if (issueWorklogPOST.isSuccess || issueWorklogPUT.isSuccess || issueWorklogDelete.isSuccess) {
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
                <SearchByIssuesExpanded
                    issueId={issueId}
                    onChange={onChangeIssue}
                />

                <Box xcss={xcss({ marginTop: 'space.100', marginBottom: 'space.100' })} />

                <Controller
                    name="date"
                    control={control}
                    rules={{
                        required: 'Required',
                    }}
                    render={({ field, fieldState }) => {
                        return (
                            <>
                                <Label htmlFor="date">Date</Label>
                                <DatePicker
                                    value={field.value}
                                    label="date"
                                    placeholder={DATE_FORMAT}
                                    dateFormat={DATE_FORMAT}
                                    onChange={field.onChange}
                                />
                                {!!fieldState.error?.message && <ErrorMessage>{fieldState.error?.message}</ErrorMessage>}
                            </>
                        )
                    }}
                />

                <Box xcss={xcss({ marginTop: 'space.100', marginBottom: 'space.100' })} />

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

                <TimeFormatGuide />

                <Box xcss={xcss({ paddingBottom: 'space.100' })}>
                    <Controller
                        name="description"
                        control={control}
                        render={({ field }) => {
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
                    {!!issueWorklogs.data?.length && (
                        <Box xcss={xcss({ marginBottom: 'space.075' })}>
                            <Heading size="small">Worklogs:</Heading>
                        </Box>
                    )}

                    {!issueWorklogs.isLoading && issueWorklogs?.data && issueWorklogs?.data?.length > 0 && (
                        <Box
                            xcss={xcss({
                                textAlign: 'center',
                                marginBottom: 'space.200',
                                backgroundColor: 'color.background.neutral',
                                padding: 'space.100',
                                borderRadius: 'border.radius.200',
                            })}
                        >
                            <Heading
                                as="h2"
                                size="small"
                            >
                                Total time: {totalTime}
                            </Heading>
                        </Box>
                    )}

                    <Controller
                        name="worklog"
                        control={control}
                        render={({ field }) => {
                            return (
                                <>
                                    {issueWorklogs.data?.map((worklog) => (
                                        <Box
                                            key={worklog.id}
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
                                                    setValue('date', '')
                                                } else {
                                                    field.onChange(worklog)
                                                    setValue('timeSpent', worklog.timeSpent)
                                                    setValue('description', worklog.description)
                                                    setValue('date', worklog.date)
                                                }
                                            }}
                                        >
                                            <Flex
                                                wrap="wrap"
                                                gap="space.100"
                                                columnGap="space.250"
                                            >
                                                <Flex columnGap="space.100">
                                                    <Text weight="bold">User:</Text>

                                                    <Flex columnGap="space.100">
                                                        <Image
                                                            src={worklog.author.avatarUrls?.['48x48']}
                                                            height="20px"
                                                            width="20px"
                                                        />
                                                        <Text weight="regular">{worklog.author.displayName}</Text>
                                                    </Flex>
                                                </Flex>
                                                <Flex columnGap="space.100">
                                                    <Text weight="bold">Date:</Text>
                                                    <Text weight="regular">{worklog.date}</Text>
                                                </Flex>
                                                <Flex columnGap="space.100">
                                                    <Text weight="bold">Logged:</Text>
                                                    <Text weight="regular">{secondsToUIFormat(worklog.timeSpentSeconds, true)}</Text>
                                                </Flex>
                                            </Flex>

                                            <Flex columnGap="space.100">
                                                <Box xcss={xcss({ flexShrink: 0 })}>
                                                    <Text weight="bold">Description: </Text>
                                                </Box>
                                                <Text weight="regular">{worklog.description}</Text>
                                            </Flex>

                                            <Flex
                                                justifyContent="end"
                                                columnGap="space.100"
                                            >
                                                <IconButton
                                                    icon={CopyIcon}
                                                    label="Copy"
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        setValue('timeSpent', worklog.timeSpent)
                                                        setValue('description', worklog.description)
                                                        setValue('worklog', undefined)
                                                    }}
                                                />

                                                <ConfirmDelete
                                                    id={`issue-worklog-delete-${worklog.id}`}
                                                    title="Are you sure you want to delete this worklog?"
                                                    stopPropagation
                                                    isLoading={
                                                        issueWorklogDelete.variables?.id === worklog.id && issueWorklogDelete.isPending
                                                    }
                                                    onYes={() => {
                                                        issueWorklogDelete.mutate({ issueId, id: worklog.id })
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
                    isLoading={isFetchingIssues}
                    appearance="default"
                    onClick={onCancel}
                >
                    Cancel
                </Button>
                <Button
                    isLoading={issueWorklogPUT.isPending || issueWorklogPOST.isPending}
                    onClick={handleSubmit(onSave)}
                    appearance="primary"
                >
                    Save
                </Button>
            </ModalFooter>
        </Modal>
    )
}
