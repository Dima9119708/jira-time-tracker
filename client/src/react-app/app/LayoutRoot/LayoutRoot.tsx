import { Outlet } from 'react-router-dom'

interface LayoutRootProps {
    className?: string
}

const LayoutRoot = (props: LayoutRootProps) => {
    const {} = props

    return (
        <div>
            <Outlet />{' '}
        </div>
    )
}

export default LayoutRoot
