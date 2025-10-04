import { createFileRoute } from '@tanstack/react-router'
import { NotFound } from '../components/NotFound'

const NotFoundPage = () => {
  return <NotFound />
}

export const Route = createFileRoute('/$')({
  component: NotFoundPage,
})