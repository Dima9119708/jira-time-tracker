import React, { useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'
import LayoutRoot from './LayoutRoot/LayoutRoot'
import { axiosInstance } from '../shared/config/api/api'
import Auth from '../pages/Auth/ui/Auth'
import { useQuery } from 'react-query'

const App = () => {
    useEffect(() => {}, [])

    const { isLoading } = useQuery({
        queryKey: 'test',
        queryFn: () => {},
        enabled: true,
    })

    console.log('isLoading', isLoading)

    return (
        <Routes>
            <Route
                path="/"
                element={<LayoutRoot />}
            >
                <Route
                    path="/auth"
                    element={<Auth />}
                />
            </Route>
        </Routes>
    )
}

export default App
