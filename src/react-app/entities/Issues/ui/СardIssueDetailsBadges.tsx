import { Flex, Text, xcss } from '@atlaskit/primitives'
import Badge from '@atlaskit/badge'
import Image from '@atlaskit/image'
import dayjs from 'dayjs'
import { DATE_FORMAT } from 'react-app/shared/const'
import React, { memo, useMemo } from 'react'
import Tooltip from '@atlaskit/tooltip'

interface CardDetailsBadgesProps {
    avatarUrl: string
    projectName: string
    priorityIconUrl: string
    priorityName: string
    issueTypeIconUrl: string
    issueTypeName: string
    issueKey: string
    created: string
}

const styles = {
    badgeInner: xcss({
        padding: 'space.050',
        textTransform: 'uppercase',
        alignItems: 'center',
        columnGap: 'space.075',
    }),
}

const CardDetailsBadges = (props: CardDetailsBadgesProps) => {
    const { priorityIconUrl, issueKey, priorityName, projectName, avatarUrl, issueTypeIconUrl, issueTypeName, created } = props

    const dateFormat = useMemo(() => {
        const relativeTimeString = dayjs(created).fromNow();
        const exactDate = dayjs(created).format('YYYY-MM-DD HH:mm:ss');

        return {
            relativeTimeString,
            exactDate
        }
    }, [created])

    return (
        <Flex
            gap="space.100"
            alignItems="center"
            wrap="wrap"
        >
            <Badge appearance="default">
                <Flex xcss={styles.badgeInner}>
                    <Image
                        src={avatarUrl}
                        height="15px"
                        width="15px"
                    />
                    <Text
                        weight="bold"
                        size="small"
                    >
                        Project: {projectName}
                    </Text>
                </Flex>
            </Badge>

            <Badge appearance="default">
                <Flex xcss={styles.badgeInner}>
                    <Image
                        src={priorityIconUrl}
                        height="15px"
                        width="15px"
                    />
                    <Text
                        weight="bold"
                        size="small"
                    >
                        priority: {priorityName}
                    </Text>
                </Flex>
            </Badge>

            <Badge appearance="default">
                <Flex xcss={styles.badgeInner}>
                    <Image
                        src={issueTypeIconUrl}
                        height="15px"
                        width="15px"
                    />
                    <Text
                        weight="bold"
                        size="small"
                    >
                        {issueTypeName} ({issueKey})
                    </Text>
                </Flex>
            </Badge>

            <Badge appearance="default">
                <Tooltip content={dateFormat.exactDate}>
                        <Text
                            weight="bold"
                            size="small"
                        >
                            CREATED: {dateFormat.relativeTimeString}
                        </Text>
                </Tooltip>

            </Badge>
        </Flex>
    )
}

export default memo(CardDetailsBadges)
