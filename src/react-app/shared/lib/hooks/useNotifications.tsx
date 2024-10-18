import { CreateFlagArgs, useFlags } from '@atlaskit/flag'
import Spinner from '@atlaskit/spinner'
import SuccessIcon from '@atlaskit/icon/glyph/check-circle'
import ErrorIcon from '@atlaskit/icon/glyph/error'
import { token } from '@atlaskit/tokens'

export const useNotifications = () => {
    const { showFlag } = useFlags()

    const loading = (args?: Partial<CreateFlagArgs>) =>
        showFlag({
            ...args,
            title: args?.title,
            description: args?.description,
            icon: <Spinner label="loading" />,
            appearance: 'normal',
        })

    const success = (args?: Partial<CreateFlagArgs>) =>
        showFlag({
            ...args,
            title: args?.title || 'Success',
            description: args?.description,
            icon: (
                <SuccessIcon
                    label="success"
                    secondaryColor={token('color.background.success.bold')}
                />
            ),
            appearance: 'success',
            isAutoDismiss: true,
        })

    const error = (args?: Partial<CreateFlagArgs>) =>
        showFlag({
            ...args,
            title: args?.title || 'Error',
            description: args?.description,
            icon: <ErrorIcon label="error" />,
            appearance: 'error',
            isAutoDismiss: true,
        })

    return {
        loading,
        success,
        error,
    }
}
