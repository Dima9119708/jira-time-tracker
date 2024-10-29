import { Flex, Text, xcss } from '@atlaskit/primitives'
import Badge from '@atlaskit/badge'
import Image from '@atlaskit/image'
import dayjs from 'dayjs'
import { DATE_FORMAT } from 'react-app/shared/const'
import React, { memo, useMemo } from 'react'

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

    const dateFormat = useMemo(() => dayjs(created).format(`${DATE_FORMAT} HH:mm:ss`), [created])

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
                <Flex xcss={styles.badgeInner}>
                    <Text
                        weight="bold"
                        size="small"
                    >
                        created: {dateFormat}
                    </Text>
                </Flex>
            </Badge>
        </Flex>
    )
}

export default memo(CardDetailsBadges)
