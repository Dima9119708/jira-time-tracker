import { Button } from '@mantine/core'
import IconAtlassianJira from '../../../shared/assets/images/atlassian_jira.svg'
import { electron } from '../../../shared/lib/electron/electron'
import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { axiosInstance } from '../../../shared/config/api/api'
import { useNavigate } from 'react-router-dom'

interface OAuth2Props {
    className?: string
}

const OAuth2 = (props: OAuth2Props) => {
    const { className } = props
    const navigate = useNavigate()

    const { refetch, isFetching, isSuccess } = useQuery({
        queryKey: ['login'],
        queryFn: async () => {
            const res = await axiosInstance.get('/login')
            return res.data
        },
        enabled: false,
    })

    useEffect(() => {
        if (isSuccess) {
            navigate('/issues')
        }
    }, [isSuccess])

    useEffect(() => {
        electron((methods) => {
            methods.ipcRenderer.on('REFETCH_LOGIN', () => refetch())
        })
    }, [])

    return (
        <Button
            onClick={() => {
                electron((methods) => methods.ipcRenderer.send('OPEN_OAuth2'))
            }}
            className={className}
            fullWidth
            variant="outline"
            loading={isFetching}
        >
            <IconAtlassianJira />
        </Button>
    )
}

export default OAuth2
