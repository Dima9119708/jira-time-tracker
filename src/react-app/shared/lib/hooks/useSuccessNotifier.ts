import { useNotifications } from './useNotifications'
import { AxiosResponse } from 'axios'

const SUCCESS_MESSAGES: Record<string, string> = {
    POST: 'Successfully created',
    PUT: 'Successfully updated',
    DELETE: 'Successfully deleted',
    DEFAULT: 'Operation completed successfully',
}

export const useSuccessNotifier = () => {
    const notify = useNotifications();

    const isAxiosResponse = (response: any): response is AxiosResponse => {
        return (
            response &&
            typeof response === 'object' &&
            'status' in response &&
            'config' in response
        );
    };

    return (response: any) => {
        if (isAxiosResponse(response)) {
            console.log('response =>', response)
            const method = response.config.method?.toUpperCase() || '';

            const methodMessage = SUCCESS_MESSAGES[method] || SUCCESS_MESSAGES.DEFAULT;

            notify.success({
                title: methodMessage,
            });
        } else {
            console.warn('Non-Exynos response detected:', response);
        }
    };
};
