import React from 'react'
import { Container, Title, Paper, Box } from '@mantine/core'
import { AuthByEmailAndToken } from '../../../features/AuthByEmailAndToken'
import { Logo } from '../../../shared/components/Logo'

const AuthPage = () => {
    return (
        <Box bg="gray.2">
            <Container
                className="h-[100vh] flex flex-col justify-center"
                size={480}
                py={40}
            >
                <Logo
                    size={1}
                    className="text-center"
                />

                <Paper
                    withBorder
                    shadow="md"
                    p={30}
                    mt={16}
                    radius="md"
                >
                    <Title
                        size="h2"
                        mb="md"
                        c="indigo.9"
                        className="flex-center"
                    >
                        Jira
                    </Title>

                    <AuthByEmailAndToken />
                </Paper>
            </Container>
        </Box>
    )
}

export default AuthPage
