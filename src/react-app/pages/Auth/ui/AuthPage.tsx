import React from 'react'
import { Container, Title, Paper, Box, Button } from '@mantine/core'
import { AuthByEmailAndToken } from '../../../features/AuthByEmailAndToken'
import { Logo } from '../../../shared/components/Logo'
import JiraLogo from '../../../shared/assets/images/jira_logo.svg'
import { OAuth2 } from '../../../features/OAuth2'

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
                        <JiraLogo />
                    </Title>

                    <AuthByEmailAndToken />

                    <OAuth2 className="mt-[2rem]" />
                </Paper>
            </Container>
        </Box>
    )
}

export default AuthPage
