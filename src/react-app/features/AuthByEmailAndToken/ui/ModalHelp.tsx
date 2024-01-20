import { Group, Image, Modal, ScrollArea, Text, Title } from '@mantine/core'
import { IconHelp } from '@tabler/icons-react'
import ImageYourDomain from '../../../shared/assets/images/your-doman.png'
import ImageEmailJira from '../../../shared/assets/images/emai-jira.png'
import ImageApiTokenStep1 from '../../../shared/assets/images/apiToken-step-1.png'
import ImageApiTokenStep2 from '../../../shared/assets/images/apiToken-step-2.png'
import ImageApiTokenStep3 from '../../../shared/assets/images/apiToken-step-3.png'
import ImageApiTokenStep4 from '../../../shared/assets/images/apiToken-step-4.png'
import ImageApiTokenStep5 from '../../../shared/assets/images/apiToken-step-5.png'
import ImageApiTokenStep6 from '../../../shared/assets/images/apiToken-step-6.png'
import { useHelpModal } from '../lib/useHelpModal'

const ModalHelp = () => {
    const type = useHelpModal((state) => state.type)
    const open = !!type

    return (
        <Modal
            opened={open}
            onClose={useHelpModal.getState().onClose}
            size="100%"
            centered
            scrollAreaComponent={ScrollArea.Autosize}
            title={
                <Group gap={5}>
                    <IconHelp className="cursor-pointer" />
                    <Text>Help</Text>
                </Group>
            }
        >
            {type === 'your-domain' && (
                <Image
                    src={ImageYourDomain}
                    className="min-w-[60rem]"
                />
            )}
            {type === 'email' && (
                <Image
                    src={ImageEmailJira}
                    className="min-w-[60rem]"
                />
            )}
            {type === 'apiToken' && (
                <>
                    <Title
                        className="mb-[1rem]"
                        order={3}
                    >
                        Step 1
                    </Title>
                    <Image
                        src={ImageApiTokenStep1}
                        className="min-w-[60rem] mb-[2rem]"
                    />
                    <Title
                        className="mb-[1rem]"
                        order={3}
                    >
                        Step 2
                    </Title>
                    <Image
                        src={ImageApiTokenStep2}
                        className="min-w-[60rem] mb-[2rem]"
                    />
                    <Title
                        className="mb-[1rem]"
                        order={3}
                    >
                        Step 3
                    </Title>
                    <Image
                        src={ImageApiTokenStep3}
                        className="min-w-[60rem] mb-[2rem]"
                    />
                    <Title
                        className="mb-[1rem]"
                        order={3}
                    >
                        Step 4
                    </Title>
                    <Image
                        src={ImageApiTokenStep4}
                        className="min-w-[60rem] mb-[2rem]"
                    />
                    <Title
                        className="mb-[1rem]"
                        order={3}
                    >
                        Step 5
                    </Title>
                    <Image
                        src={ImageApiTokenStep5}
                        className="min-w-[60rem] mb-[2rem]"
                    />
                    <Title
                        className="mb-[1rem]"
                        order={3}
                    >
                        Step 6
                    </Title>
                    <Image
                        src={ImageApiTokenStep6}
                        className="min-w-[60rem] mb-[2rem]"
                    />
                </>
            )}
        </Modal>
    )
}

export default ModalHelp
