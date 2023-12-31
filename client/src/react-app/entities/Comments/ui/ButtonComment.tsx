import { Button } from '@mantine/core'
import React from 'react'
import { useComment } from '../lib/useComment'

const ButtonComment = () => {
    return (
        <Button
            size="compact-sm"
            onClick={() => useComment.getState().setToggle()}
        >
            Comments
        </Button>
    )
}

export default ButtonComment
