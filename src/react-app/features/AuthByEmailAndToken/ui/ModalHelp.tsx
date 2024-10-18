import ImageYourDomain from '../../../shared/assets/images/your-doman.png'
import ImageEmailJira from '../../../shared/assets/images/emai-jira.png'
import ImageApiTokenStep1 from '../../../shared/assets/images/apiToken-step-1.png'
import ImageApiTokenStep2 from '../../../shared/assets/images/apiToken-step-2.png'
import ImageApiTokenStep3 from '../../../shared/assets/images/apiToken-step-3.png'
import ImageApiTokenStep4 from '../../../shared/assets/images/apiToken-step-4.png'
import ImageApiTokenStep5 from '../../../shared/assets/images/apiToken-step-5.png'
import ImageApiTokenStep6 from '../../../shared/assets/images/apiToken-step-6.png'
import { useHelpModal } from '../lib/useHelpModal'
import Image from '@atlaskit/image'

import Modal, { ModalBody, ModalFooter, ModalHeader, ModalTitle, ModalTransition } from '@atlaskit/modal-dialog'

import CrossIcon from '@atlaskit/icon/glyph/cross'
import Button, { IconButton } from '@atlaskit/button/new'
import Heading from '@atlaskit/heading'

const ModalHelp = () => {
    const type = useHelpModal((state) => state.type)
    const open = !!type

    return (
        <ModalTransition>
            {open && (
                <Modal
                    width="x-large"
                    onClose={useHelpModal.getState().onClose}
                >
                    <ModalHeader>
                        <ModalTitle />

                        <IconButton
                            appearance="subtle"
                            icon={CrossIcon}
                            label="Close Modal"
                            onClick={useHelpModal.getState().onClose}
                        />
                    </ModalHeader>

                    <ModalBody>
                        {type === 'your-domain' && <Image src={ImageYourDomain} />}
                        {type === 'email' && <Image src={ImageEmailJira} />}
                        {type === 'apiToken' && (
                            <>
                                <Heading size="xlarge">Step 1</Heading>
                                <Image src={ImageApiTokenStep1} />
                                <Heading size="xlarge">Step 2</Heading>
                                <Image src={ImageApiTokenStep2} />
                                <Heading size="xlarge">Step 3</Heading>
                                <Image src={ImageApiTokenStep3} />
                                <Heading size="xlarge">Step 4</Heading>
                                <Image src={ImageApiTokenStep4} />
                                <Heading size="xlarge">Step 5</Heading>
                                <Image src={ImageApiTokenStep5} />
                                <Heading size="xlarge">Step 6</Heading>
                                <Image src={ImageApiTokenStep6} />
                            </>
                        )}
                    </ModalBody>
                    <ModalFooter>
                        <Button
                            appearance="subtle"
                            onClick={useHelpModal.getState().onClose}
                        >
                            Cancel
                        </Button>
                    </ModalFooter>
                </Modal>
            )}
        </ModalTransition>
    )
}

export default ModalHelp
