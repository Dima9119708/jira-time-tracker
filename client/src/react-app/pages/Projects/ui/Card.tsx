import { Card as Mantine_Card, Image, Text } from '@mantine/core'
import { InView } from 'react-intersection-observer'
import { useNavigate } from 'react-router-dom'
import { CardProps } from '../types/types'

const Card = (props: CardProps) => {
    const { src, name, id } = props
    const navigate = useNavigate()

    const onProject = () => navigate(`/tasks/${id}`)

    return (
        <InView triggerOnce>
            {({ inView, ref }) => {
                return (
                    <Mantine_Card
                        className="flex flex-row items-center cursor-pointer"
                        shadow="sm"
                        radius="md"
                        mb="sm"
                        withBorder
                        h={60}
                        onClick={onProject}
                        ref={ref}
                    >
                        {inView && (
                            <>
                                <Image
                                    src={src}
                                    h={32}
                                    w={32}
                                    alt="Norway"
                                />

                                <Text
                                    fw={500}
                                    fz="sm"
                                    ml={20}
                                >
                                    {name}
                                </Text>
                            </>
                        )}
                    </Mantine_Card>
                )
            }}
        </InView>
    )
}

export default Card
