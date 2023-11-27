import React from 'react'
import { Container, Title, Paper, Box } from '@mantine/core'
import { AuthByEmailAndToken, BaseAuthFormFields } from '../../../features/authByEmailAndToken'
import { axiosInstance } from '../../../shared/config/api/api'

const AuthPage = () => {
    return (
        <Box bg="gray.2">
            <Container
                className="h-[100vh] flex flex-col justify-center"
                size={480}
                py={40}
            >
                <Title
                    size="h1"
                    c="indigo.7"
                    className="flex-center"
                >
                    Time Tracker
                </Title>

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
