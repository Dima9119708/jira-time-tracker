import { Avatar, Divider, Group, Text } from '@mantine/core'
import { IntlProvider } from 'react-intl'
import { ReactRenderer } from '@atlaskit/renderer'
import React from 'react'
import { CommentProps } from '../types/types'

const Comment = (props: CommentProps) => {
    const { document, displayName, created, avatarUrl } = props

    return (
        <>
            <Group>
                <Avatar
                    src={avatarUrl}
                    alt={displayName}
                    radius="xl"
                />
                <div>
                    <Text size="sm">{displayName}</Text>
                    <Text
                        size="xs"
                        c="dimmed"
                    >
                        {created} ago
                    </Text>
                </div>
            </Group>
            <Text
                pl={54}
                pt={5}
                mb={10}
                size="sm"
                component="div"
                className="[&_p]:!text-[1rem]"
            >
                <IntlProvider
                    locale="en"
                    messages={{}}
                >
                    <ReactRenderer document={document} />
                </IntlProvider>
            </Text>

            <Divider />
        </>
    )
}

export default Comment
