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
import { IssueResponse, WorklogIssueDelete, WorklogIssueMutation } from 'react-app/pages/Issues/types/types'
import Image from '@atlaskit/image'
import { AxiosError, AxiosResponse } from 'axios'
import { ErrorType } from 'react-app/shared/types/jiraTypes'
import { useNotifications } from 'react-app/shared/lib/hooks/useNotifications'
import { DATE_FORMAT } from 'react-app/shared/const'
import { getWorklogComment, worklogCommentTemplate } from 'react-app/entities/IssueWorklogs/lib/comment'

const Timesheet = () => {
    const { setFalse } = useGlobalBoolean()
    const [date, setDate] = useState(() => dayjs().format(DATE_FORMAT))
    const notify = useNotifications()

    const worklogs = useQuery({
        queryKey: ['worklogs', date],
        queryFn: async () => {
            const response = await axiosInstance.post<IssueResponse>('/worklogs', {
                jql: `worklogDate = "${date}"`,
                fields: ['summary', 'status', 'issuetype', 'worklog'],
            })

            return response.data.issues
        },
    })

    const worklogMutationPut = useMutation<AxiosResponse<WorklogIssueMutation>, AxiosError<ErrorType>, WorklogIssueMutation, Function>({
        mutationFn: (variables) => {
            return axiosInstance.put<WorklogIssueMutation>('/worklog-task', variables)
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

    const worklogMutationDelete = useMutation<AxiosResponse<WorklogIssueDelete>, AxiosError<ErrorType>, WorklogIssueDelete, Function>({
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
                <Box xcss={xcss({ display: 'flex', justifyContent: 'center', marginBottom: 'space.200' })}>
                    <Box xcss={xcss({ borderRadius: 'border.radius.200', width: '100%' })}>
                        <DatePicker
                            value={date}
                            dateFormat="YYYY-MM-DD"
                            onChange={(newDate) => setDate(newDate ? newDate : date)}
                        />
                    </Box>
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
                        {worklogs.data?.map((issue) =>
                            issue.fields.worklog.worklogs.map((worklog, idx) => {
                                const worklogDate = dayjs(worklog.started).format('YYYY-MM-DD')

                                if (worklogDate !== date) {
                                    return null
                                }

                                return (
                                    <TableRow key={`${issue.id}${worklog.id}`}>
                                        <TableCell>
                                            <WatchController name={`timesheet date ${issue.id}${worklog.id}`}>
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
                                                                        value={worklog.updated}
                                                                        dateFormat={DATE_FORMAT}
                                                                        onChange={(newDate) => {
                                                                            worklogMutationPut.mutate({
                                                                                taskId: issue.id,
                                                                                id: worklog.id,
                                                                                started: dayjs(newDate).format('YYYY-MM-DDTHH:mm:ss.SSSZZ'),
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
                                                                    {worklogDate}
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
                                                <Image src={issue.fields.issuetype.iconUrl} />
                                                <Text>{issue.fields.summary}</Text>
                                            </Flex>
                                        </TableCell>
                                        <TableCell>
                                            <WatchController name={`timesheet description ${issue.id}${worklog.id}`}>
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
                                                                        defaultValue={worklog.comment?.content[0].content[0].text}
                                                                        onPointerEnterCapture={undefined}
                                                                        onPointerLeaveCapture={undefined}
                                                                        onBlur={(event) => {
                                                                            if (getWorklogComment(worklog) === event.target.value) return

                                                                            worklogMutationPut.mutate({
                                                                                taskId: issue.id,
                                                                                id: worklog.id,
                                                                                ...worklogCommentTemplate(event.target.value),
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
                                                                    {getWorklogComment(worklog)}
                                                                </Box>
                                                            )}
                                                        />
                                                    )
                                                }}
                                            </WatchController>
                                        </TableCell>
                                        <TableCell>
                                            <WatchController name={`timesheet logged ${issue.id}${worklog.id}`}>
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

                                                                            worklogMutationPut.mutate({
                                                                                taskId: issue.id,
                                                                                id: worklog.id,
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
                                                onClick={() => worklogMutationDelete.mutate({ taskId: issue.id, id: worklog.id })}
                                            />
                                        </TableCell>
                                    </TableRow>
                                )
                            })
                        )}
                    </TableBody>
                </Table>
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
