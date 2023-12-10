import { Breadcrumbs as Mantine_Breadcrumbs, Anchor, BreadcrumbsProps as Mantine_BreadcrumbsProps } from '@mantine/core'
import { useNavigate } from 'react-router-dom'
import { useBreadcrumbsStore } from '../lib/hooks'

interface BreadcrumbsProps extends Omit<Mantine_BreadcrumbsProps, 'children'> {}

const Breadcrumbs = (props: BreadcrumbsProps) => {
    const navigate = useNavigate()

    const items = useBreadcrumbsStore((state) => state.items)

    if (!items.length) {
        return null
    }

    return (
        <Mantine_Breadcrumbs {...props}>
            {items.map(({ title, link }) => (
                <Anchor
                    key={link}
                    onClick={() => navigate(link)}
                >
                    {title}
                </Anchor>
            ))}
        </Mantine_Breadcrumbs>
    )
}

export default Breadcrumbs
