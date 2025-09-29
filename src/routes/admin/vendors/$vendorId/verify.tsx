import { createFileRoute } from '@tanstack/react-router'

const RouteComponent = () => {

}

export const Route = createFileRoute('/admin/vendors/$vendorId/verify')({
  component: RouteComponent,
})