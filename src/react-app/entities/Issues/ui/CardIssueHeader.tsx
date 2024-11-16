import { Box, Flex, Text, xcss } from '@atlaskit/primitives'
import Heading from '@atlaskit/heading'
import Badge from '@atlaskit/badge'
import React, { memo, useMemo } from 'react'
import { token } from '@atlaskit/tokens'
import { Issue } from 'react-app/shared/types/Jira/Issues'
import { secondsToUIFormat } from 'react-app/shared/lib/helpers/secondsToUIFormat'
import Tooltip from '@atlaskit/tooltip'
import dayjs from 'dayjs'
import { DATE_FORMAT } from 'react-app/shared/const'

interface CardIssueHeader extends Pick<Issue['fields'], 'duedate' | 'summary' | 'timespent' | 'timeoriginalestimate'> {}

const CardHeader = (props: CardIssueHeader) => {
    const { summary, timespent, timeoriginalestimate, duedate } = props

    const dateUIFormat = useMemo(() => {
        const format: { timespent: string; timeoriginalestimate: string, due?: { formattedTime: string; isOverdue: boolean, originalTime: string } | null } = {
            due: null,
            timespent: '',
            timeoriginalestimate: '',
        }

        if (dayjs(duedate).isValid()) {
            const now = dayjs()
            const due = dayjs(duedate)

            const differenceInMinutes = due.diff(now, 'minute');
            const isOverdue = differenceInMinutes < 0;

            const absMinutes = Math.abs(differenceInMinutes);
            const hours = Math.floor(absMinutes / 60);
            const minutes = absMinutes % 60;

            const formattedTime = `${isOverdue ? '-' : ''} ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}h`;

            format.due = {
                formattedTime,
                isOverdue,
                originalTime: dayjs(duedate).format(DATE_FORMAT),
            }
        }

        format.timespent = secondsToUIFormat(timespent)
        format.timeoriginalestimate = timeoriginalestimate ? secondsToUIFormat(timeoriginalestimate) : '-'

        return format
    }, [timespent, timeoriginalestimate, duedate])

    return (
        <Flex justifyContent="space-between">
            <Box xcss={xcss({ marginRight: 'space.200' })}>
                <Heading size="medium">{summary}</Heading>
            </Box>

            <Flex
                gap="space.100"
                direction="column"
                xcss={xcss({
                    flexShrink: '0',
                })}
            >
                {(dateUIFormat.due) && (
                    <Badge appearance={dateUIFormat.due.isOverdue ? 'removed' : 'default'}>
                        <Flex columnGap="space.075">
                            <Text
                                weight="medium"
                                size="large"
                            >
                                Due:
                            </Text>
                            <Text
                                weight="medium"
                                size="large"
                            >
                                <Tooltip content={`${dateUIFormat.due.isOverdue ? 'Overdue' : 'Due'}: ${dateUIFormat.due.originalTime}`}>
                                    {(triggerProps) => <span {...triggerProps}>{dateUIFormat.due?.formattedTime}</span>}
                                </Tooltip>
                            </Text>
                        </Flex>
                    </Badge>
                )}
                <Badge>
                    <Flex columnGap="space.075">
                        <Text
                            weight="medium"
                            size="large"
                        >
                            <Tooltip content="Logged">{(triggerProps) => <span {...triggerProps}>{dateUIFormat.timespent}</span>}</Tooltip>
                        </Text>
                        <Text
                            weight="medium"
                            size="large"
                        >
                            /
                        </Text>
                        <Text
                            weight="medium"
                            size="large"
                        >
                            <Tooltip content="Original estimate">
                                {(triggerProps) => <span {...triggerProps}>{dateUIFormat.timeoriginalestimate}</span>}
                            </Tooltip>
                        </Text>
                    </Flex>
                </Badge>
            </Flex>
        </Flex>
    )
}

export default memo(CardHeader)
