import React, { useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'
import LayoutRoot from './LayoutRoot/LayoutRoot'
import { axiosInstance } from '../shared/config/api/api'

const App = () => {
    useEffect(() => {}, [])

    return (
        <Routes>
            <Route path="/" element={<LayoutRoot />}>
                <Route path="/auth" element={<div />} />
            </Route>
        </Routes>
    )
}

export default App
