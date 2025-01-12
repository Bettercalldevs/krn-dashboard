import { createLazyFileRoute } from '@tanstack/react-router'

import AuthPage from '@/pages/Auth'

export const Route = createLazyFileRoute('/')({
  component: AuthPage,
})
