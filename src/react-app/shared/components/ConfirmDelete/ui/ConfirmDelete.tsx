import { Popup } from '@atlaskit/popup'
import Button, { IconButton } from '@atlaskit/button/new'
import TrashIcon from '@atlaskit/icon/glyph/trash'
import { Box, Flex, xcss, Text } from '@atlaskit/primitives'
import { useState } from 'react'
import Heading from '@atlaskit/heading'

interface ConfirmDeleteProps {
    title: string,
    onYes?: () => void
    onNo?: () => void
}

const ConfirmDelete = (props: ConfirmDeleteProps) => {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <Popup
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            shouldRenderToParent
            content={() => (
                <Box xcss={xcss({ padding: 'space.150' })}>
                    <Text size="large">
                        {props.title}
                    </Text>
                    <Box xcss={xcss({ marginBottom: 'space.100' })} />
                    <Flex columnGap="space.100" justifyContent="end">
                        <Button
                            appearance="default"
                            onClick={() => {
                                setIsOpen(false)
                                props.onNo?.()
                            }}
                        >
                            No
                        </Button>
                        <Button
                            appearance="danger"
                            onClick={() => {
                                setIsOpen(false)
                                props.onYes?.()
                            }}
                        >
                            Yes
                        </Button>
                    </Flex>
                </Box>
            )}
            trigger={(triggerProps) => (
                <IconButton
                    {...triggerProps}
                    icon={TrashIcon}
                    label="Delete"
                    onClick={() => setIsOpen(prevState => !prevState)}
                />
            )}
        />
    )
}

export default ConfirmDelete
