import { Flex, xcss } from '@atlaskit/primitives'
import Textfield from '@atlaskit/textfield'
import { IconButton } from '@atlaskit/button/new'
import AddIcon from '@atlaskit/icon/glyph/add'
import { useRef } from 'react'

interface AddGroupProps {
    isLoading?: boolean,
    onAdd: (nameGroup: string) => void
}

const AddGroup = (props: AddGroupProps) => {
    const { isLoading, onAdd } = props
    const inputRef = useRef<HTMLInputElement>(null)

    return (
        <Flex
            xcss={xcss({
                height: '30px',
                marginBottom: 'space.100',
                // marginTop: 'space.300',
                // @ts-ignore
                '& > div, & > button': {
                    height: 'inherit',
                },
            })}
            alignItems="center"
            columnGap="space.100"
        >
            <Textfield ref={inputRef} />
            <IconButton
                appearance="primary"
                icon={AddIcon}
                label="add"
                isLoading={isLoading}
                onClick={() => {
                    if (inputRef.current) {
                        onAdd(inputRef.current.value)

                        inputRef.current.value = ''
                    }
                }}
            />
        </Flex>
    );
};

export default AddGroup;
