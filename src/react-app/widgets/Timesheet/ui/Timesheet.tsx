import Modal, { ModalBody, ModalFooter, ModalHeader, ModalTitle } from '@atlaskit/modal-dialog'
import Button, { IconButton } from '@atlaskit/button/new'
import CrossIcon from '@atlaskit/icon/glyph/cross'
import { QueryObserverBaseResult, useQueryClient } from '@tanstack/react-query'

import { DatePicker } from '@atlaskit/datetime-picker'
import { Box, Flex, Text, xcss } from '@atlaskit/primitives'
import React, { forwardRef, memo, ReactNode, Ref, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react'
import dayjs from 'dayjs'
import { useGlobalBoolean } from 'use-global-boolean'

import { Table, TableBody, TableCell, TableHead, TableRow } from 'react-app/shared/ui/Table'
import TextArea from '@atlaskit/textarea'
import { Popup } from '@atlaskit/popup'
import Image from '@atlaskit/image'
import { DATE_FORMAT } from 'react-app/shared/const'
import Heading from '@atlaskit/heading'
import { secondsToUIFormat } from 'react-app/shared/lib/helpers/secondsToUIFormat'
import Textfield from '@atlaskit/textfield'
import EmptyState from '@atlaskit/empty-state'
import Spinner from '@atlaskit/spinner'
import { ConfirmDelete } from 'react-app/shared/components/ConfirmDelete'
import Calendar from '@atlaskit/calendar'
import { useWorklogCrud } from 'react-app/features/WorklogCrud'
import { TimeFormatGuide } from 'react-app/shared/components/TimeFormatGuide'
import { TableRowDetail } from 'react-app/shared/ui/Table/ui/Table'
import { SearchByIssuesExpanded } from 'react-app/features/SearchByIssues'
import { useNotifications } from 'react-app/shared/lib/hooks/useNotifications'
import { AxiosError } from 'axios'
import { Controller, useForm } from 'react-hook-form'
import { ErrorMessage, Label } from '@atlaskit/form'
import { Worklog } from 'react-app/entities/Worklogs'
import { token } from '@atlaskit/tokens'
import { useGlobalState } from 'react-app/shared/lib/hooks/useGlobalState'

interface LogTimeProps {
    date: string
    worklogRefetch: QueryObserverBaseResult['refetch']
}

type FormValues = {
    startDate: string
    issueId: string
    timeSpent: string
    description: string
}

const DEFAULT_VALUES: FormValues = {
    startDate: '',
    issueId: '',
    timeSpent: '',
    description: '',
}

interface RenderWorklogProps {
    id: Worklog['id']
    issueId: Worklog['issue']['id']
    timeSpent: Worklog['timeSpent']
    authorAvatarUrl: Worklog['author']['avatarUrls']['16x16']
    authorDisplayName: Worklog['author']['displayName']
    description: Worklog['description']
    date: Worklog['date']
    issueKey: Worklog['issue']['key']
    issueSummary: Worklog['issue']['summary']
    issueIcon: Worklog['issue']['icon']
    timeSpentSeconds: Worklog['timeSpentSeconds']
    worklogsQueryRefetch: QueryObserverBaseResult['refetch']
}

const styles = {
    editCell: xcss({
        // @ts-ignore
        '&:hover': {
            outlineWidth: '1px',
            outlineStyle: 'solid',
            outlineColor: token('color.blanket'),
        },
    }),
}

const LogTime = memo((props: LogTimeProps) => {
    const { date, worklogRefetch } = props
    const [isOpen, setOpen] = useState(false)

    const { worklogPOST } = useWorklogCrud({
        enabledGetIssueWorklogs: false,
        enabledGetWorklogs: false,
        post: {
            onSuccess: () => {
                worklogRefetch()
            },
            onError: () => {
                worklogRefetch()
            },
        },
    })

    const { control, handleSubmit } = useForm({
        values: {
            ...DEFAULT_VALUES,
            startDate: date,
        },
    })

    const onSave = (data: FormValues) => {
        worklogPOST.mutate(data)
        setOpen(false)
    }

    return (
        <Popup
            isOpen={isOpen}
            onClose={() => setOpen((prevState) => !prevState)}
            content={() =>
                isOpen && (
                    <Box
                        xcss={xcss({
                            padding: 'space.150',
                            backgroundColor: 'color.background.neutral',
                            minWidth: '300px',
                            maxWidth: '400px',
                        })}
                    >
                        <Controller
                            control={control}
                            rules={{
                                required: 'Required',
                            }}
                            name="issueId"
                            render={({ field, fieldState }) => {
                                return (
                                    <>
                                        <SearchByIssuesExpanded
                                            issueId={field.value}
                                            onChange={(issue) => field.onChange(issue.id)}
                                        />
                                        {!!fieldState.error?.message && <ErrorMessage>{fieldState.error?.message}</ErrorMessage>}
                                    </>
                                )
                            }}
                        />

                        <Box xcss={xcss({ marginTop: 'space.100', marginBottom: 'space.100' })} />

                        <Controller
                            control={control}
                            name="startDate"
                            render={({ field, fieldState }) => {
                                return (
                                    <>
                                        <Label htmlFor="startDate">Date</Label>
                                        <DatePicker
                                            value={field.value}
                                            label="startDate"
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

                        <Flex
                            justifyContent="end"
                            columnGap="space.100"
                        >
                            <Button
                                appearance="default"
                                onClick={() => setOpen((prevState) => !prevState)}
                            >
                                Cancel
                            </Button>
                            <Button
                                isLoading={worklogPOST.isPending}
                                onClick={handleSubmit(onSave)}
                                appearance="primary"
                            >
                                Save
                            </Button>
                        </Flex>
                    </Box>
                )
            }
            shouldRenderToParent
            trigger={(triggerProps) => (
                <Button
                    {...triggerProps}
                    onClick={() => setOpen((prevState) => !prevState)}
                    appearance="discovery"
                >
                    Log time
                </Button>
            )}
        />
    )
})

const RenderDescription = memo(
    ({
        description,
        onChange,
    }: Pick<RenderWorklogProps, 'description'> & { onChange: (newDescription: RenderWorklogProps['description']) => void }) => {
        const [isOpen, setOpen] = useState(false)

        return (
            <>
                <Box
                    xcss={xcss({
                        gridColumn: '1 / 2',
                        color: 'color.text.subtle',
                        fontWeight: 'font.weight.bold',
                    })}
                >
                    Description
                </Box>
                <Popup
                    isOpen={isOpen}
                    onClose={() => setOpen((prevState) => !prevState)}
                    placement="bottom-start"
                    content={() => (
                        <Box
                            xcss={xcss({
                                padding: 'space.150',
                                minHeight: '250px',
                                minWidth: '250px',
                                backgroundColor: 'color.background.neutral',
                            })}
                        >
                            <TextArea
                                style={{
                                    minHeight: 'inherit',
                                    minWidth: 'inherit',
                                }}
                                resize="auto"
                                defaultValue={description}
                                onPointerEnterCapture={undefined}
                                onPointerLeaveCapture={undefined}
                                onBlur={(event) => {
                                    if (description === event.target.value) return

                                    onChange(event.target.value)
                                }}
                            />
                        </Box>
                    )}
                    shouldRenderToParent
                    trigger={(triggerProps) => (
                        <Box
                            xcss={xcss({
                                wordBreak: 'break-all',
                                gridColumn: '2 / -1',
                            })}
                        >
                            <Box
                                as="span"
                                xcss={styles.editCell}
                                {...triggerProps}
                                onClick={() => setOpen((prevState) => !prevState)}
                            >
                                {description}
                            </Box>
                        </Box>
                    )}
                />
            </>
        )
    }
)

const RenderAction = memo(({ onDelete }: { onDelete: () => void }) => {
    return (
        <ConfirmDelete
            title="Are you sure you want to delete this worklog?"
            onYes={onDelete}
        />
    )
})

const RenderLogged = memo(
    ({
        timeSpentSeconds,
        timeSpent,
        onChange,
    }: Pick<RenderWorklogProps, 'timeSpent' | 'timeSpentSeconds'> & { onChange: (timeSpent: RenderWorklogProps['timeSpent']) => void }) => {
        const [isOpen, setOpen] = useState(false)

        return (
            <Popup
                isOpen={isOpen}
                onClose={() => setOpen((prevState) => !prevState)}
                placement="bottom-start"
                content={() => (
                    <Box
                        xcss={xcss({
                            padding: 'space.150',
                            minWidth: '30px',
                            minHeight: '30px',
                            backgroundColor: 'color.background.neutral',
                        })}
                    >
                        <TimeFormatGuide />

                        <Textfield
                            isCompact
                            defaultValue={timeSpent}
                            onBlur={(event) => {
                                if (timeSpent === event.target.value) return

                                onChange(event.target.value)
                            }}
                        />
                    </Box>
                )}
                shouldRenderToParent
                trigger={(triggerProps) => (
                    <Box
                        {...triggerProps}
                        onClick={() => setOpen((prevState) => !prevState)}
                    >
                        <Box
                            as="span"
                            xcss={styles.editCell}
                        >
                            {secondsToUIFormat(timeSpentSeconds, true)}
                        </Box>
                    </Box>
                )}
            />
        )
    }
)

const RenderIssue = memo(
    ({
        issueId,
        issueSummary,
        issueIcon,
        issueKey,
        onChange,
    }: Pick<RenderWorklogProps, 'issueId' | 'issueKey' | 'issueSummary' | 'issueIcon'> & {
        onChange: (newIssueId: RenderWorklogProps['issueId']) => void
    }) => {
        const [isOpen, setOpen] = useState(false)

        return (
            <Popup
                isOpen={isOpen}
                onClose={() => setOpen((prevState) => !prevState)}
                placement="bottom-start"
                content={() => (
                    <Box
                        xcss={xcss({
                            padding: 'space.150',
                            minWidth: '300px',
                            maxWidth: '400px',
                            backgroundColor: 'color.background.neutral',
                        })}
                    >
                        <SearchByIssuesExpanded
                            placement="top-start"
                            issueId={issueId}
                            onChange={async (newIssue) => {
                                setOpen((prevState) => !prevState)
                                onChange(newIssue.id)
                            }}
                        />
                    </Box>
                )}
                shouldRenderToParent
                trigger={(triggerProps) => (
                    <Box
                        {...triggerProps}
                        onClick={() => setOpen((prevState) => !prevState)}
                    >
                        <Flex
                            columnGap="space.050"
                            wrap="wrap"
                            xcss={styles.editCell}
                        >
                            <Image src={issueIcon} />
                            <Text>{issueKey}</Text>
                            <Text>{issueSummary}</Text>
                        </Flex>
                    </Box>
                )}
            />
        )
    }
)

const RenderAuthor = memo(({ authorAvatarUrl, authorDisplayName }: Pick<RenderWorklogProps, 'authorAvatarUrl' | 'authorDisplayName'>) => {
    return (
        <Flex
            columnGap="space.050"
            alignItems="center"
        >
            <Image
                height="20px"
                width="20px"
                src={authorAvatarUrl}
            />
            <Text>{authorDisplayName}</Text>
        </Flex>
    )
})

const RenderDate = memo(
    ({ date, onChange }: Pick<RenderWorklogProps, 'date'> & { onChange: (newDate: RenderWorklogProps['date']) => void }) => {
        const [isOpen, setOpen] = useState(false)

        return (
            <Popup
                isOpen={isOpen}
                onClose={() => setOpen((prevState) => !prevState)}
                placement="bottom-start"
                content={() => (
                    <Box
                        xcss={xcss({
                            padding: 'space.150',
                            width: '250px',
                            backgroundColor: 'color.background.neutral',
                        })}
                    >
                        <DatePicker
                            value={date}
                            dateFormat={DATE_FORMAT}
                            onChange={(newDate) => {
                                onChange(newDate)

                                setOpen((prevState) => !prevState)
                            }}
                        />
                    </Box>
                )}
                shouldRenderToParent
                trigger={(triggerProps) => (
                    <Box
                        {...triggerProps}
                        onClick={() => setOpen((prevState) => !prevState)}
                    >
                        <Box
                            as="span"
                            xcss={styles.editCell}
                        >
                            {' '}
                            {date}
                        </Box>
                    </Box>
                )}
            />
        )
    }
)

const RenderWorklog = memo((props: RenderWorklogProps) => {
    const {
        id,
        issueId,
        issueKey,
        issueSummary,
        issueIcon,
        timeSpent,
        authorAvatarUrl,
        authorDisplayName,
        description,
        date,
        timeSpentSeconds,
        worklogsQueryRefetch,
    } = props

    const notify = useNotifications()
    const refWorklog = useRef<Omit<RenderWorklogProps, 'worklogsQueryRefetch'>>({
        id,
        issueId,
        issueKey,
        issueSummary,
        issueIcon,
        timeSpent,
        authorAvatarUrl,
        authorDisplayName,
        description,
        date,
        timeSpentSeconds,
    })

    const { worklogPUT, worklogDELETE, worklogPOST } = useWorklogCrud({
        enabledGetIssueWorklogs: false,
        enabledGetWorklogs: false,
        put: {
            onSuccess: () => {
                worklogsQueryRefetch()
            },
            onError: () => {
                worklogsQueryRefetch()
            },
        },
        post: {
            onSuccess: () => {
                worklogsQueryRefetch()
            },
            onError: () => {
                worklogsQueryRefetch()
            },
        },
        delete: {
            onSuccess: (variables) => {
                if (variables.customFields?.isRefetchWorklogsAfterDelete !== false) {
                    worklogsQueryRefetch()
                }
            },
            onError: () => {
                worklogsQueryRefetch()
            },
        },
    })

    useEffect(() => {
        refWorklog.current = Object.assign(refWorklog.current, {
            id,
            issueId,
            issueKey,
            issueSummary,
            issueIcon,
            timeSpent,
            authorAvatarUrl,
            authorDisplayName,
            description,
            date,
            timeSpentSeconds,
        })
    }, [props])

    const onDate = useCallback((newDate: RenderWorklogProps['date']) => {
        worklogPUT.mutate({
            issueId: refWorklog.current.issueId,
            id: refWorklog.current.id,
            startDate: newDate,
            timeSpent: refWorklog.current.timeSpent,
            description: refWorklog.current.description,
        })
    }, [])

    const onIssue = useCallback(async (newIssueId: RenderWorklogProps['issueId']) => {
        try {
            await worklogDELETE.mutateAsync({
                issueId: refWorklog.current.issueId,
                id: refWorklog.current.id,
                customFields: {
                    isRefetchWorklogsAfterDelete: false,
                },
            })
            await worklogPOST.mutateAsync({
                issueId: newIssueId,
                startDate: refWorklog.current.date,
                timeSpent: refWorklog.current.timeSpent,
                description: refWorklog.current.description,
            })
        } catch (e) {
            if (e instanceof AxiosError) {
                notify.error({
                    title: JSON.stringify(e.response?.data || ''),
                })
            }
        }
    }, [])

    const onDescription = useCallback((newDescription: RenderWorklogProps['description']) => {
        worklogPUT.mutate({
            issueId: refWorklog.current.issueId,
            id: refWorklog.current.id,
            startDate: refWorklog.current.date,
            timeSpent: refWorklog.current.timeSpent,
            description: newDescription,
        })
    }, [])

    const onLogged = useCallback((timeSpent: RenderWorklogProps['timeSpent']) => {
        worklogPUT.mutate({
            issueId: refWorklog.current.issueId,
            id: refWorklog.current.id,
            startDate: refWorklog.current.date,
            timeSpent: timeSpent,
            description: refWorklog.current.description,
        })
    }, [])

    const onDelete = useCallback(() => {
        worklogDELETE.mutate({
            issueId: refWorklog.current.issueId,
            id: refWorklog.current.id,
        })
    }, [])

    return (
        <TableRow>
            {(worklogPUT.isPending || worklogDELETE.isPending || worklogPOST.isPending) && (
                <div
                    style={{
                        position: 'absolute',
                        inset: 0,
                        backgroundColor: token('color.background.neutral'),
                        zIndex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <Spinner />
                </div>
            )}
            <TableCell>
                <RenderDate
                    date={date}
                    onChange={onDate}
                />
            </TableCell>
            <TableCell>
                <RenderAuthor
                    authorAvatarUrl={authorAvatarUrl}
                    authorDisplayName={authorDisplayName}
                />
            </TableCell>
            <TableCell>
                <RenderIssue
                    issueId={issueId}
                    issueKey={issueKey}
                    issueSummary={issueSummary}
                    issueIcon={issueIcon}
                    onChange={onIssue}
                />
            </TableCell>
            <TableCell>
                <RenderLogged
                    timeSpent={timeSpent}
                    timeSpentSeconds={timeSpentSeconds}
                    onChange={onLogged}
                />
            </TableCell>
            <TableCell>
                <RenderAction onDelete={onDelete} />
            </TableCell>

            <TableRowDetail>
                <RenderDescription
                    description={description}
                    onChange={onDescription}
                />
            </TableRowDetail>
        </TableRow>
    )
})

const RenderTableWorklogs = memo(
    ({
        projectName,
        totalLogged,
        children,
        projectAvatarURL,
    }: {
        projectName: string
        totalLogged: number
        children: ReactNode
        projectAvatarURL: string
    }) => {
        return (
            <Box
                key={projectName}
                xcss={xcss({
                    marginBottom: 'space.300',
                    overflowX: 'auto',
                })}
            >
                <Box
                    xcss={xcss({
                        marginBottom: 'space.200',
                        backgroundColor: 'color.background.neutral',
                        padding: 'space.100',
                        borderRadius: 'border.radius.200',
                    })}
                >
                    <Flex
                        alignItems="center"
                        columnGap="space.100"
                    >
                        <Image
                            src={projectAvatarURL}
                            height="24px"
                            width="24px"
                        />
                        <Heading
                            as="h2"
                            size="small"
                        >
                            {' '}
                            Project: {projectName}
                        </Heading>
                    </Flex>
                </Box>

                <Table
                    gridTemplateColumns="auto auto auto auto 0.2fr"
                    minWidth="500px"
                >
                    <TableHead>
                        <TableCell>Date</TableCell>
                        <TableCell>User</TableCell>
                        <TableCell>Issue</TableCell>
                        <TableCell>
                            Logged{' '}
                            <div>
                                <Text color="color.text">({secondsToUIFormat(totalLogged, true)})</Text>
                            </div>
                        </TableCell>
                        <TableCell />
                    </TableHead>
                    <TableBody>{children}</TableBody>
                </Table>
            </Box>
        )
    }
)

const RenderCalendar = memo(({ date, setDate }: { date: string; setDate: React.Dispatch<React.SetStateAction<string>> }) => {
    const _date = useMemo(() => [date], [date])

    return (
        <Box xcss={xcss({ marginBottom: 'space.250' })}>
            <Box xcss={xcss({ display: 'flex', justifyContent: 'center', borderRadius: 'border.radius.200', width: '100%' })}>
                <Calendar
                    selected={_date}
                    previouslySelected={_date}
                    onSelect={(newDate) => {
                        setDate(newDate ? newDate.iso : date)
                    }}
                />
            </Box>
        </Box>
    )
})

const Timesheet = () => {
    const { setFalse } = useGlobalBoolean()
    const [isFetchingOtherQueries, setIsFetchingOtherQueries] = useState(false)
    const queryClient = useQueryClient()
    const [date, setDate] = useState(() => dayjs().format(DATE_FORMAT))

    const { worklogs, wasMutationSuccessfulAndCacheCleared } = useWorklogCrud({
        mutationGcTime: Infinity,
        from: dayjs(date).startOf('day'),
        to: dayjs(date).endOf('day'),
    })

    const totalTime = useMemo(() => {
        if (worklogs.data) {
            const total = worklogs.data.reduce((acc, [, worklogs]) => {
                const countWorklog = worklogs.reduce((acc, worklog) => acc + worklog.timeSpentSeconds, 0)

                return acc + countWorklog
            }, 0)

            return secondsToUIFormat(total, true)
        }

        return ''
    }, [worklogs.data])

    const onCancel = useCallback(async () => {
        if (wasMutationSuccessfulAndCacheCleared()) {
            setIsFetchingOtherQueries(true)

            await queryClient.invalidateQueries()

            setIsFetchingOtherQueries(isFetchingOtherQueries)
        }

        setFalse('timesheet')
    }, [])

    return (
        <Modal
            width="x-large"
            onClose={onCancel}
        >
            <ModalHeader>
                <ModalTitle>
                    <Flex
                        columnGap="space.100"
                        alignItems="center"
                    >
                        Timesheet
                        <LogTime
                            date={date}
                            worklogRefetch={worklogs.refetch}
                        />
                    </Flex>
                </ModalTitle>
                <IconButton
                    isLoading={isFetchingOtherQueries}
                    appearance="subtle"
                    icon={CrossIcon}
                    label="Close Modal"
                    onClick={onCancel}
                />
            </ModalHeader>
            <ModalBody>
                <RenderCalendar
                    date={date}
                    setDate={setDate}
                />

                {!worklogs.isLoading && worklogs?.data?.length === 0 && (
                    <EmptyState
                        header="Nothing logged for the selected date"
                        description="Currently, there’s no logged time for this date. Entries will appear here once they’re added."
                    />
                )}
                {worklogs.isFetching && !worklogs?.data && (
                    <EmptyState
                        header=""
                        description={<Spinner />}
                    />
                )}
                {!worklogs.isLoading && worklogs?.data && worklogs?.data?.length > 0 && (
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
                {worklogs?.data?.map(([projectName, _worklogs]) => {
                    const projectAvatarURL = _worklogs[0].project.avatarUrl

                    const totalLogged = _worklogs.reduce((acc, worklog) => acc + worklog.timeSpentSeconds, 0)

                    return (
                        <RenderTableWorklogs
                            key={projectName}
                            projectName={projectName}
                            totalLogged={totalLogged}
                            projectAvatarURL={projectAvatarURL}
                        >
                            {_worklogs.map((worklog) => {
                                return (
                                    <RenderWorklog
                                        key={worklog.id}
                                        issueId={worklog.issue.id}
                                        date={worklog.date}
                                        id={worklog.id}
                                        timeSpent={worklog.timeSpent}
                                        description={worklog.description}
                                        issueSummary={worklog.issue.summary}
                                        issueIcon={worklog.issue.icon}
                                        issueKey={worklog.issue.key}
                                        authorDisplayName={worklog.author.displayName}
                                        timeSpentSeconds={worklog.timeSpentSeconds}
                                        authorAvatarUrl={worklog.author.avatarUrls['16x16']}
                                        worklogsQueryRefetch={worklogs.refetch}
                                    />
                                )
                            })}
                        </RenderTableWorklogs>
                    )
                })}
            </ModalBody>
            <ModalFooter>
                <Button
                    isLoading={isFetchingOtherQueries}
                    appearance="default"
                    onClick={onCancel}
                >
                    Cancel
                </Button>
            </ModalFooter>
        </Modal>
    )
}

export default Timesheet
