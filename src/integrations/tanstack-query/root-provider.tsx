import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

export const getContext = () => {
  const queryClient = new QueryClient()
  return {
    queryClient,
  }
}

export const Provider = ({
  children,
  queryClient,
}: {
  children: React.ReactNode
  queryClient: QueryClient
}) => {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}
