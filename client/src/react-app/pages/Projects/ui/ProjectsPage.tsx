import { useQuery } from '@tanstack/react-query'
import { queryGetProjects } from '../model/queryOptions'
import Card from './Card'
import { Title } from '@mantine/core'

const ProjectsPage = () => {
    const { data = [] } = useQuery(queryGetProjects())

    return (
        <>
            <Title
                mb={10}
                order={2}
            >
                Projects
            </Title>
            {data.map(({ avatarUrls, id, name }) => (
                <Card
                    key={id}
                    id={id}
                    src={avatarUrls['32x32']}
                    name={name}
                />
            ))}
        </>
    )
}

export default ProjectsPage
