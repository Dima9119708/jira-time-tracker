import Modal, { ModalBody, ModalFooter, ModalHeader, ModalTitle } from '@atlaskit/modal-dialog'
import Button, { IconButton } from '@atlaskit/button/new'
import CrossIcon from '@atlaskit/icon/glyph/cross'
import { useMutation, useQuery } from '@tanstack/react-query'
import { axiosInstance } from 'react-app/shared/config/api/api'

import { DatePicker } from '@atlaskit/datetime-picker'
import { Box, Flex, Text, xcss } from '@atlaskit/primitives'
import { useMemo, useState } from 'react'
import dayjs from 'dayjs'
import { useGlobalBoolean, WatchController } from 'use-global-boolean'

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
import InlineEdit from '@atlaskit/inline-edit'

const Timesheet = () => {
    const { setFalse } = useGlobalBoolean()
    const [date, setDate] = useState(() => dayjs().format(DATE_FORMAT))

    const { worklogs, worklogPUT, worklogDelete } = useWorklogCrud({
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
                <Box xcss={xcss({ marginBottom: 'space.250' })}>
                    <Box xcss={xcss({  display: 'flex', justifyContent: 'center', borderRadius: 'border.radius.200', width: '100%' })}>
                        <Calendar
                            selected={[date]}
                            previouslySelected={[date]}
                            onSelect={(newDate) => {
                                setDate(newDate ? newDate.iso : date)
                            }}
                        />
                    </Box>
                </Box>

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
                {worklogs?.data?.map(([projectName, worklogs]) => {
                    const projectAvatarURL = worklogs[0].project.avatarUrl

                    const totalLogged = worklogs.reduce((acc, worklog) => acc + worklog.timeSpentSeconds, 0)

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
                                                <Flex columnGap="space.050" wrap="wrap">
                                                    <Image src={worklog.issue.icon} />
                                                    <Text>{worklog.issue.key}</Text>
                                                    <Text>{worklog.issue.summary}</Text>
                                                </Flex>
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
                                                                            minWidth: '30px',
                                                                            minHeight: '30px',
                                                                            backgroundColor: 'color.background.neutral',
                                                                        })}
                                                                    >
                                                                        <TimeFormatGuide />

                                                                        <Textfield
                                                                            isCompact
                                                                            defaultValue={worklog.timeSpent}
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
                                                                        {secondsToUIFormat(worklog.timeSpentSeconds, true)}
                                                                    </Box>
                                                                )}
                                                            />
                                                        )
                                                    }}
                                                </WatchController>
                                            </TableCell>
                                            <TableCell>
                                                <ConfirmDelete
                                                    title="Are you sure you want to delete this worklog?"
                                                    onYes={() => {
                                                        worklogDelete.mutate({
                                                            issueId: worklog.issue.id,
                                                            id: worklog.id,
                                                        })
                                                    }}
                                                />
                                            </TableCell>

                                            <TableRowDetail>
                                                <Box xcss={xcss({ gridColumn: '1 / 2', color: 'color.text.subtle', fontWeight: 'font.weight.bold', })}>Description</Box>
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
                                                                        xcss={xcss({
                                                                            wordBreak: 'break-all',
                                                                            gridColumn: '2 / -1',
                                                                        })}
                                                                    >
                                                                        {worklog.description || '==//=='}
                                                                    </Box>
                                                                )}
                                                            />
                                                        )
                                                    }}
                                                </WatchController>
                                            </TableRowDetail>
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
