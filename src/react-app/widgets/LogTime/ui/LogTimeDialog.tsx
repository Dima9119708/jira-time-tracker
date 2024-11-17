import Modal, { ModalBody, ModalFooter, ModalHeader, ModalTitle } from '@atlaskit/modal-dialog'
import { globalBooleanActions, useGlobalBoolean } from 'use-global-boolean'
import Button, { IconButton } from '@atlaskit/button/new'
import { Control, Controller, FormProvider, useForm, useFormContext } from 'react-hook-form'
import Textfield from '@atlaskit/textfield'
import { ErrorMessage, Label } from '@atlaskit/form'
import CrossIcon from '@atlaskit/icon/glyph/cross'
import { Box, Flex, Text, xcss } from '@atlaskit/primitives'
import { useQueryClient } from '@tanstack/react-query'
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
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { SearchByIssuesExpanded } from 'react-app/features/SearchByIssues'
import { Issue } from 'react-app/shared/types/Jira/Issues'
import { IssueWorklogs } from 'react-app/entities/IssueWorklogs/api/useIssueWorklogsGET'
import { useGlobalState } from 'react-app/shared/lib/hooks/useGlobalState'
import { LogTimeErrorNotification, usePersistLostTime } from 'react-app/features/PersistLostTime'
import { Appearance } from '@atlaskit/button/new'
import { convertJiraTimeToSeconds } from 'react-app/entities/IssueWorklogs'
import { convertSecondsToJiraTime } from 'react-app/entities/IssueWorklogs/lib/convertJiraTimeToSeconds'

type FormValues = {
    date: string
    timeSpent: string
    description: string
    worklog: IssueWorklogs | undefined
}

interface RenderWorklogProps {
    isSelected: boolean
    isLoading: boolean
    onSelect: (bool: boolean, id: IssueWorklogs['id']) => void
    onCopy: (issueId: Issue['id']) => void
    onDelete: (issueId: Issue['id'], id: IssueWorklogs['id']) => void
    id: IssueWorklogs['id']
    authorAvatarUrl: IssueWorklogs['author']['avatarUrls']['16x16']
    authorDisplayName: IssueWorklogs['author']['displayName']
    description: IssueWorklogs['description']
    date: IssueWorklogs['date']
    issueId: Issue['id']
    timeSpentSeconds: IssueWorklogs['timeSpentSeconds']
}

const DEFAULT_VALUES: FormValues = {
    date: dayjs().format(DATE_FORMAT),
    timeSpent: '',
    description: '',
    worklog: undefined,
}

export const LogTimeButton = (props: { issueId: string; appearance?: Appearance }) => {
    return (
        <Button
            appearance={props.appearance ?? 'discovery'}
            onClick={() => {
                globalBooleanActions.setTrue('LOG_TIME_ISSUE', props.issueId)
            }}
        >
            Log time
        </Button>
    )
}

export const RenderWorklog = memo((props: RenderWorklogProps) => {
    const {
        id,
        onCopy,
        onDelete,
        onSelect,
        issueId,
        isSelected,
        isLoading,
        description,
        timeSpentSeconds,
        date,
        authorAvatarUrl,
        authorDisplayName,
    } = props

    return (
        <Box
            xcss={xcss({
                boxShadow: 'elevation.shadow.overlay',
                display: 'grid',
                gap: 'space.100',
                borderRadius: 'border.radius.200',
                marginBottom: 'space.200',
                padding: 'space.200',
                cursor: 'pointer',
                backgroundColor: isSelected ? 'color.background.accent.blue.subtler' : 'color.background.input',
            })}
            onClick={() => {
                if (isSelected) {
                    onSelect(true, id)
                } else {
                    onSelect(false, id)
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
                            src={authorAvatarUrl}
                            height="20px"
                            width="20px"
                        />
                        <Text weight="regular">{authorDisplayName}</Text>
                    </Flex>
                </Flex>
                <Flex columnGap="space.100">
                    <Text weight="bold">Date:</Text>
                    <Text weight="regular">{date}</Text>
                </Flex>
                <Flex columnGap="space.100">
                    <Text weight="bold">Logged:</Text>
                    <Text weight="regular">{secondsToUIFormat(timeSpentSeconds, true)}</Text>
                </Flex>
            </Flex>

            <Flex columnGap="space.100">
                <Box xcss={xcss({ flexShrink: 0 })}>
                    <Text weight="bold">Description: </Text>
                </Box>
                <Text weight="regular">{description}</Text>
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
                        onCopy(id)
                    }}
                />

                <ConfirmDelete
                    id={`issue-worklog-delete-${issueId}`}
                    title="Are you sure you want to delete this worklog?"
                    stopPropagation
                    isLoading={isLoading}
                    onYes={() => {
                        onDelete(issueId, id)
                    }}
                />
            </Flex>
        </Box>
    )
})

export const RenderDate = memo(({ control }: { control: Control<FormValues> }) => {
    return (
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
    )
})

export const RenderTimeSpent = memo(({ control }: { control: Control<FormValues> }) => {
    return (
        <>
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
        </>
    )
})

export const RenderDescription = memo(({ control }: { control: Control<FormValues> }) => {
    return (
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
    )
})

export const LogTimeDialog = (props: { issueId: string }) => {
    const { issueId: issueIdProps } = props

    const { setFalse } = useGlobalBoolean()
    const [isFetchingOtherQueries, setIsFetchingOtherQueries] = useState(false)
    const queryClient = useQueryClient()
    const [issueId, setIssueId] = useState(issueIdProps)
    const refIssueWorklogs = useRef<IssueWorklogs[] | null>(null)
    const isAddToTimeSpentLostTimeRef = useRef(false)

    const { handleSubmit, control, setValue, reset, getValues } = useForm<FormValues>({
        mode: 'onBlur',
        defaultValues: DEFAULT_VALUES,
    })

    const { remove } = usePersistLostTime(issueId)

    const {
        worklogPUT: issueWorklogPUT,
        issueWorklogs,
        worklogPOST: issueWorklogPOST,
        worklogDELETE: issueWorklogDelete,
        wasMutationSuccessfulAndCacheCleared,
    } = useWorklogCrud({
        issueId: issueId,
        enabledGetWorklogs: false,
        enabledGetIssueWorklogs: true,
        mutationGcTime: Infinity,
        post: {
            onSuccess: () => {
                if (isAddToTimeSpentLostTimeRef.current) {
                    remove(issueId)
                }

                reset(DEFAULT_VALUES)
            },
        },
        put: {
            onSuccess: () => {
                if (isAddToTimeSpentLostTimeRef.current) {
                    remove(issueId)
                }
                reset(DEFAULT_VALUES)
            },
        },
        delete: {
            onSuccess: (variables) => {
                if (isAddToTimeSpentLostTimeRef.current) {
                    remove(issueId)
                }

                if (getValues('worklog')?.id === variables.id) {
                    reset(DEFAULT_VALUES)
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

    const onSelectWorklog = useCallback((bool: boolean, id: Worklog['id']) => {
        if (bool) {
            setValue('worklog', undefined)
            setValue('timeSpent', '')
            setValue('description', '')
            setValue('date', '')
        } else {
            if (refIssueWorklogs.current) {
                const worklog = refIssueWorklogs.current.find((worklog) => worklog.id === id)

                if (worklog) {
                    setValue('worklog', worklog)
                    setValue('timeSpent', worklog.timeSpent)
                    setValue('description', worklog.description)
                    setValue('date', worklog.date)
                }
            }
        }
    }, [])

    const onCopy = useCallback((id: IssueWorklogs['id']) => {
        if (refIssueWorklogs.current) {
            const worklog = refIssueWorklogs.current.find((worklog) => worklog.id === id)

            if (worklog) {
                setValue('timeSpent', worklog.timeSpent)
                setValue('description', worklog.description)
                setValue('worklog', undefined)
            }
        }
    }, [])

    const onDelete = useCallback((issueId: Issue['id'], id: IssueWorklogs['id']) => {
        issueWorklogDelete.mutate({ issueId, id })
    }, [])

    const onSave = useCallback((data: FormValues) => {
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
    }, [])

    const onCancel = useCallback(async () => {
        if (wasMutationSuccessfulAndCacheCleared()) {
            setIsFetchingOtherQueries(true)

            await queryClient.invalidateQueries()

            setIsFetchingOtherQueries(isFetchingOtherQueries)
        }

        setFalse('LOG_TIME_ISSUE')
    }, [])

    const onAddToTimeSpentLostTime = useCallback((timeSpentSeconds: number) => {
        const currentTimeSpent = getValues('timeSpent')

       const workingDaysPerWeek =  useGlobalState.getState().settings.workingDaysPerWeek
       const workingHoursPerDay =  useGlobalState.getState().settings.workingHoursPerDay

        if (currentTimeSpent) {
            const currentTimeSpentSeconds = convertJiraTimeToSeconds(
                currentTimeSpent,
                workingDaysPerWeek,
                workingHoursPerDay
            )
            setValue('timeSpent', convertSecondsToJiraTime(
                currentTimeSpentSeconds + timeSpentSeconds,
                workingDaysPerWeek,
                workingHoursPerDay
            ))
        } else {
            setValue('timeSpent', convertSecondsToJiraTime(
                timeSpentSeconds,
                workingDaysPerWeek,
                workingHoursPerDay
            ))
        }

        isAddToTimeSpentLostTimeRef.current = true
    }, [])

    useEffect(() => {
        refIssueWorklogs.current = issueWorklogs.data ?? null
    }, [issueWorklogs.data])

    return (
        <Modal onClose={onCancel}>
            <ModalHeader>
                <ModalTitle>Log time</ModalTitle>

                <IconButton
                    isLoading={isFetchingOtherQueries}
                    appearance="subtle"
                    icon={CrossIcon}
                    label="Close Modal"
                    onClick={onCancel}
                />
            </ModalHeader>
            <ModalBody>
                <LogTimeErrorNotification
                    issueId={issueId}
                    isAddToTimeSpentAction
                    isLogTimeAction={false}
                    onAddToTimeSpent={onAddToTimeSpentLostTime}
                />

                <Box xcss={xcss({ margin: 'space.200' })} />

                <SearchByIssuesExpanded
                    issueId={issueId}
                    onChange={onChangeIssue}
                />

                <Box xcss={xcss({ margin: 'space.150' })} />

                <RenderDate control={control} />

                <Box xcss={xcss({ margin: 'space.150' })} />

                <RenderTimeSpent control={control} />

                <Box xcss={xcss({ margin: 'space.150' })} />

                <RenderDescription control={control} />

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
                                        <RenderWorklog
                                            key={worklog.id}
                                            id={worklog.id}
                                            isSelected={field.value?.id === worklog.id}
                                            isLoading={issueWorklogDelete.variables?.id === worklog.id && issueWorklogDelete.isPending}
                                            date={worklog.date}
                                            issueId={issueId}
                                            timeSpentSeconds={worklog.timeSpentSeconds}
                                            description={worklog.description}
                                            authorAvatarUrl={worklog.author.avatarUrls['16x16']}
                                            authorDisplayName={worklog.author.displayName}
                                            onDelete={onDelete}
                                            onCopy={onCopy}
                                            onSelect={onSelectWorklog}
                                        />
                                    ))}
                                </>
                            )
                        }}
                    />
                </Box>
            </ModalBody>
            <ModalFooter>
                <Button
                    isLoading={isFetchingOtherQueries}
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
