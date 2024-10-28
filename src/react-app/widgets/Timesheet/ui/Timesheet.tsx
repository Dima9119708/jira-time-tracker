import Modal, { ModalBody, ModalFooter, ModalHeader, ModalTitle } from '@atlaskit/modal-dialog'
import Button, { IconButton } from '@atlaskit/button/new'
import CrossIcon from '@atlaskit/icon/glyph/cross'
import { useMutation, useQuery } from '@tanstack/react-query'
import { axiosInstance } from 'react-app/shared/config/api/api'

import { DatePicker } from '@atlaskit/datetime-picker'
import { Box, Flex, Text, xcss } from '@atlaskit/primitives'
import { useState } from 'react'
import dayjs from 'dayjs'
import { useGlobalBoolean, WatchController } from 'use-global-boolean'

import { Table, TableBody, TableCell, TableHead, TableRow } from 'react-app/shared/ui/Table'
import TextArea from '@atlaskit/textarea'
import { Popup } from '@atlaskit/popup'
import TrashIcon from '@atlaskit/icon/glyph/trash'
import Image from '@atlaskit/image'
import { useNotifications } from 'react-app/shared/lib/hooks/useNotifications'
import { DATE_FORMAT } from 'react-app/shared/const'
import { useWorklogsGET } from 'react-app/entities/Worklogs'
import { convertJiraTimeToSeconds, useIssueWorklogDELETE, useIssueWorklogPUT } from 'react-app/entities/IssueWorklogs'
import { useGlobalState } from 'react-app/shared/lib/hooks/useGlobalState'
import Heading from '@atlaskit/heading'

const Timesheet = () => {
    const { setFalse } = useGlobalBoolean()
    const [date, setDate] = useState(() => dayjs().format(DATE_FORMAT))
    const notify = useNotifications()

    const worklogs = useWorklogsGET({
        from: date,
        to: date,
    })

    const worklogPUT = useIssueWorklogPUT({
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

    const worklogDelete = useIssueWorklogDELETE({
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

    return (
        <Modal
            width="x-large"
            onClose={() => setFalse('timesheet')}
        >
            <ModalHeader>
                <ModalTitle>Timesheet</ModalTitle>
                <IconButton
                    appearance="subtle"
                    icon={CrossIcon}
                    label="Close Modal"
                    onClick={() => setFalse('timesheet')}
                />
            </ModalHeader>
            <ModalBody>
                <Box xcss={xcss({ display: 'flex', justifyContent: 'center', marginBottom: 'space.250' })}>
                    <Box xcss={xcss({ borderRadius: 'border.radius.200', width: '100%' })}>
                        <DatePicker
                            value={date}
                            dateFormat="YYYY-MM-DD"
                            onChange={(newDate) => setDate(newDate ? newDate : date)}
                        />
                    </Box>
                </Box>

                {worklogs?.data?.map(([projectName, worklogs]) => {
                    return (
                        <Box
                            xcss={xcss({
                                marginBottom: 'space.300',
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
                                <Heading
                                    as="h2"
                                    size="small"
                                >
                                    Project: {projectName}
                                </Heading>
                            </Box>

                            <Table gridTemplateColumns="0.7fr 1fr 1fr 1fr 1fr 0.2fr">
                                <TableHead>
                                    <TableCell>Date</TableCell>
                                    <TableCell>User</TableCell>
                                    <TableCell>Issue</TableCell>
                                    <TableCell>Description</TableCell>
                                    <TableCell>Logged</TableCell>
                                    <TableCell />
                                </TableHead>
                                <TableBody>
                                    {worklogs.map((worklog) => (
                                        <TableRow key={worklog.id}>
                                            <TableCell>
                                                <WatchController name={`timesheet date ${worklog.id}`}>
                                                    {({ localState }) => {
                                                        const [isOpen, { toggle }] = localState

                                                        return (
                                                            <Popup
                                                                isOpen={isOpen}
                                                                onClose={toggle}
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
                                                                            value={worklog.date}
                                                                            dateFormat={DATE_FORMAT}
                                                                            onChange={(newDate) => {
                                                                                worklogPUT.mutate({
                                                                                    issueId: worklog.issue.id,
                                                                                    id: worklog.id,
                                                                                    startDate: newDate,
                                                                                    timeSpent: worklog.timeSpent,
                                                                                })

                                                                                toggle()
                                                                            }}
                                                                        />
                                                                    </Box>
                                                                )}
                                                                shouldRenderToParent
                                                                trigger={(triggerProps) => (
                                                                    <Box
                                                                        {...triggerProps}
                                                                        onClick={toggle}
                                                                    >
                                                                        {worklog.date}
                                                                    </Box>
                                                                )}
                                                            />
                                                        )
                                                    }}
                                                </WatchController>
                                            </TableCell>
                                            <TableCell>
                                                <Flex
                                                    columnGap="space.050"
                                                    alignItems="center"
                                                >
                                                    <Image
                                                        height="20px"
                                                        width="20px"
                                                        src={worklog.author?.avatarUrls?.['16x16']}
                                                    />
                                                    <Text>{worklog.author.displayName}</Text>
                                                </Flex>
                                            </TableCell>
                                            <TableCell>
                                                <Flex columnGap="space.050">
                                                    <Image src={worklog.issue.icon} />
                                                    <Text>{worklog.issue.summary}</Text>
                                                </Flex>
                                            </TableCell>
                                            <TableCell>
                                                <WatchController name={`timesheet description ${worklog.id}`}>
                                                    {({ localState }) => {
                                                        const [isOpen, { toggle }] = localState

                                                        return (
                                                            <Popup
                                                                isOpen={isOpen}
                                                                onClose={toggle}
                                                                placement="bottom-start"
                                                                content={() => (
                                                                    <Box
                                                                        xcss={xcss({
                                                                            padding: 'space.150',
                                                                            minWidth: '250px',
                                                                            minHeight: '250px',
                                                                            backgroundColor: 'color.background.neutral',
                                                                        })}
                                                                    >
                                                                        <TextArea
                                                                            style={{
                                                                                minHeight: 'inherit',
                                                                                minWidth: 'inherit',
                                                                            }}
                                                                            resize="auto"
                                                                            defaultValue={worklog.description}
                                                                            onPointerEnterCapture={undefined}
                                                                            onPointerLeaveCapture={undefined}
                                                                            onBlur={(event) => {
                                                                                if (worklog.description === event.target.value) return

                                                                                worklogPUT.mutate({
                                                                                    issueId: worklog.issue.id,
                                                                                    id: worklog.id,
                                                                                    startDate: worklog.date,
                                                                                    timeSpent: worklog.timeSpent,
                                                                                    description: event.target.value,
                                                                                })
                                                                            }}
                                                                        />
                                                                    </Box>
                                                                )}
                                                                shouldRenderToParent
                                                                trigger={(triggerProps) => (
                                                                    <Box
                                                                        {...triggerProps}
                                                                        onClick={toggle}
                                                                    >
                                                                        {worklog.description || '==//=='}
                                                                    </Box>
                                                                )}
                                                            />
                                                        )
                                                    }}
                                                </WatchController>
                                            </TableCell>
                                            <TableCell>
                                                <WatchController name={`timesheet logged ${worklog.id}`}>
                                                    {({ localState }) => {
                                                        const [isOpen, { toggle }] = localState

                                                        return (
                                                            <Popup
                                                                isOpen={isOpen}
                                                                onClose={toggle}
                                                                placement="bottom-start"
                                                                content={() => (
                                                                    <Box
                                                                        xcss={xcss({
                                                                            padding: 'space.150',
                                                                            minWidth: '250px',
                                                                            minHeight: '250px',
                                                                            backgroundColor: 'color.background.neutral',
                                                                        })}
                                                                    >
                                                                        <TextArea
                                                                            style={{
                                                                                minHeight: 'inherit',
                                                                                minWidth: 'inherit',
                                                                            }}
                                                                            resize="auto"
                                                                            defaultValue={worklog.timeSpent}
                                                                            onPointerEnterCapture={undefined}
                                                                            onPointerLeaveCapture={undefined}
                                                                            onBlur={(event) => {
                                                                                if (worklog.timeSpent === event.target.value) return

                                                                                worklogPUT.mutate({
                                                                                    issueId: worklog.issue.id,
                                                                                    id: worklog.id,
                                                                                    startDate: worklog.date,
                                                                                    timeSpent: event.target.value,
                                                                                })
                                                                            }}
                                                                        />
                                                                    </Box>
                                                                )}
                                                                shouldRenderToParent
                                                                trigger={(triggerProps) => (
                                                                    <Box
                                                                        {...triggerProps}
                                                                        onClick={toggle}
                                                                    >
                                                                        {worklog.timeSpent}
                                                                    </Box>
                                                                )}
                                                            />
                                                        )
                                                    }}
                                                </WatchController>
                                            </TableCell>
                                            <TableCell>
                                                <IconButton
                                                    icon={TrashIcon}
                                                    label="Delete"
                                                    onClick={() =>
                                                        worklogDelete.mutate({
                                                            issueId: worklog.issue.id,
                                                            id: worklog.id,
                                                        })
                                                    }
                                                />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Box>
                    )
                })}
            </ModalBody>
            <ModalFooter>
                <Button
                    appearance="default"
                    onClick={() => setFalse('timesheet')}
                >
                    Cancel
                </Button>
            </ModalFooter>
        </Modal>
    )
}

export default Timesheet
