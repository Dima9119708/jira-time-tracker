import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactNode } from 'react'

interface QueryClientProvideProps {
    children: ReactNode
}

export const queryClient = new QueryClient()

const QueryClientProvide = (props: QueryClientProvideProps) => {
    const { children } = props

    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}

export default QueryClientProvide
