import React, { useEffect } from 'react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import ThemeProvider from './Theme/Theme'
import LayoutRoot from './LayoutRoot/LayoutRoot'

const App = () => {
    useEffect(() => {
        // axios.get('http://localhost:8000')
        //     .then(() => {})
        //     .catch(() => {})
    }, [])

    return (
        <ThemeProvider>
            <MemoryRouter>
                <Routes>
                    <Route path="/" element={<LayoutRoot />}>
                        <Route path="/aa" element={<div />} />
                        <Route path="/ccccccc" element={<div />} />
                    </Route>
                </Routes>
            </MemoryRouter>
        </ThemeProvider>
    )
}

export default App
