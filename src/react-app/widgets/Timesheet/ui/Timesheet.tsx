import Modal, { ModalFooter, ModalHeader, ModalTitle, ModalBody } from '@atlaskit/modal-dialog'
import Button, { IconButton } from '@atlaskit/button/new'
import CrossIcon from '@atlaskit/icon/glyph/cross'
import { useQuery } from '@tanstack/react-query'
import { axiosInstance } from 'react-app/shared/config/api/api'

import { DateTimePicker } from '@atlaskit/datetime-picker'
import { Box, xcss } from '@atlaskit/primitives'
import { useState } from 'react'
import dayjs from 'dayjs'
import { useGlobalBoolean } from 'use-global-boolean'

const Timesheet = () => {
    const { setFalse } = useGlobalBoolean()
    const [date, setDate] = useState(() => dayjs().format('YYYY-MM-DD'))

    const {} = useQuery({
        queryKey: ['worklog', date],
        queryFn: async () => {
            const response = await axiosInstance.post('/worklogs', {
                jql: `worklogDate >= "${date}" AND worklogDate <= "${date}" AND worklogAuthor = currentUser()`,
                fields: ['summary', 'status', 'issuetype', 'worklog'],
            })

            return response.data
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
                        <DateTimePicker
                            value={date}
                            timePickerProps={{
                                isDisabled: true,
                            }}
                            datePickerProps={{
                                dateFormat: 'YYYY-MM-DD',
                                shouldShowCalendarButton: true,
                                onChange: (date) => {
                                    setDate(date)
                                },
                            }}
                        />
                    </Box>
                </Box>
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
