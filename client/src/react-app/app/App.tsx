import React from 'react'
import { Route, Routes, Navigate } from 'react-router-dom'
import LayoutRoot from './LayoutRoot/LayoutRoot'
import AuthPage from '../pages/Auth/ui/AuthPage'
import { useAuthByEmailAndToken } from '../features/authByEmailAndToken'
import { Loader } from '@mantine/core'
import { ProjectsPage } from '../pages/Projects'

const App = () => {
    const { isFetching, isAuthorized } = useAuthByEmailAndToken()

    if (!isAuthorized && isFetching) {
        return (
            <div className="h-[100vh] flex-center">
                <Loader />
            </div>
        )
    }

    return (
        <Routes>
            <Route
                path="/"
                element={isAuthorized && !isFetching ? <LayoutRoot /> : <Navigate to="/auth" />}
            >
                <Route
                    index
                    path="/projects"
                    element={<ProjectsPage />}
                />
            </Route>
            <Route
                path="/auth"
                element={<AuthPage />}
            />
        </Routes>
    )
}

export default App
