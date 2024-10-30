import { Box, Flex, Text, xcss } from '@atlaskit/primitives'
import Heading from '@atlaskit/heading'
import Badge from '@atlaskit/badge'
import React, { memo } from 'react'
import { token } from '@atlaskit/tokens'

interface CardIssueHeader {
    summary: string
    timespent: string
    timeoriginalestimate: string
}

const CardHeader = (props: CardIssueHeader) => {
    const { summary, timespent, timeoriginalestimate } = props

    return (
        <Flex justifyContent="space-between">
            <Heading size="medium">{summary}</Heading>

            <Badge appearance="primary">
                <Box
                    as="span"
                    xcss={xcss({ padding: 'space.050' })}
                >
                    <Box
                        as="span"
                        xcss={xcss({
                            marginRight: 'space.075',
                            // @ts-ignore
                            '& > *': {
                                color: `${token('color.text.inverse')}!important`,
                            },
                        })}
                    >
                        <Text weight="bold">{timespent}</Text>
                    </Box>
                    <Box
                        as="span"
                        xcss={xcss({
                            marginRight: 'space.075',
                            // @ts-ignore
                            '& > *': {
                                color: `${token('color.text.inverse')}!important`,
                            },
                        })}
                    >
                        <Text weight="bold">/</Text>
                    </Box>
                    <Box
                        as="span"
                        xcss={xcss({
                            // @ts-ignore
                            '& > *': {
                                color: token('color.text.inverse'),
                            },
                        })}
                    >
                        <Text weight="bold">{timeoriginalestimate}</Text>
                    </Box>
                </Box>
            </Badge>
        </Flex>
    )
}

export default memo(CardHeader)
