import { Popup, TriggerProps } from '@atlaskit/popup'
import Button, { IconButton } from '@atlaskit/button/new'
import TrashIcon from '@atlaskit/icon/glyph/trash'
import { Box, Flex, xcss, Text } from '@atlaskit/primitives'
import React, { FunctionComponent, useEffect, useRef, useState } from 'react'
import { CommonIconButtonProps } from '@atlaskit/button/dist/types/new-button/variants/icon/types'

interface ConfirmDeleteProps {
    id?: string
    title: string
    isLoading?: boolean
    isDisabled?: boolean
    stopPropagation?: boolean
    onYes?: () => void
    onNo?: () => void
    icon?: CommonIconButtonProps['icon']
    children?: FunctionComponent<{ triggerProps: TriggerProps, isOpen: boolean, setIsOpen: React.Dispatch<React.SetStateAction<boolean>> }>
}

const ConfirmDelete = (props: ConfirmDeleteProps) => {
    const { icon = TrashIcon, children } = props
    const [isOpen, setIsOpen] = useState(false)

    const buttonNoRef = useRef<HTMLButtonElement>(null)
    const buttonYesRef = useRef<HTMLButtonElement>(null)

    useEffect(() => {
        if (isOpen && props.id && props.stopPropagation) {
            const abortController = new AbortController()

            const element = document.getElementById(props.id)

            if (element) {
                element.addEventListener(
                    'click',
                    (ev) => {
                        ev.stopImmediatePropagation()
                    },
                    {
                        signal: abortController.signal,
                    }
                )

                if (buttonYesRef.current) {
                    buttonYesRef.current.addEventListener(
                        'click',
                        (ev) => {
                            setIsOpen(false)
                            props.onYes?.()
                        },
                        {
                            signal: abortController.signal,
                        }
                    )
                }
                if (buttonNoRef.current) {
                    buttonNoRef.current.addEventListener(
                        'click',
                        (ev) => {
                            setIsOpen(false)
                            props.onNo?.()
                        },
                        {
                            signal: abortController.signal,
                        }
                    )
                }
            }

            return () => {
                abortController.abort()
            }
        }
    }, [isOpen])

    return (
        <Popup
            id={props.id}
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            shouldRenderToParent
            content={() => (
                <Box xcss={xcss({ padding: 'space.150' })}>
                    <Text size="large">{props.title}</Text>
                    <Box xcss={xcss({ marginBottom: 'space.100' })} />
                    <Flex
                        columnGap="space.100"
                        justifyContent="end"
                    >
                        <Button
                            ref={buttonNoRef}
                            appearance="default"
                            onClick={() => {
                                setIsOpen(false)
                                props.onNo?.()
                            }}
                        >
                            No
                        </Button>
                        <Button
                            ref={buttonYesRef}
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
            trigger={(triggerProps) =>
                typeof children === 'function' ? (
                    children({
                        triggerProps,
                        isOpen,
                        setIsOpen
                    })
                ) : (
                    <IconButton
                        {...triggerProps}
                        icon={icon}
                        label="Delete"
                        isDisabled={props.isDisabled}
                        isLoading={props.isLoading}
                        onClick={(e) => {
                            if (props.stopPropagation) {
                                e.stopPropagation()
                            }

                            setIsOpen((prevState) => !prevState)
                        }}
                    />
                )
            }
        />
    )
}

export default ConfirmDelete
