'use client'
import { useAppSelector } from './store/hooks'
import LoginPage from './(auth)/loginPage'
import DashboardPage from './(dashboard)/dashboardPage'
import StudienplanerPage from './(projects)/studienplaner/landingPage'

export default function PageContainer() {
  const { isLoggedIn, currentView } = useAppSelector(s => s.auth)

  if (!isLoggedIn) return <LoginPage />

  switch (currentView) {
    case 'studienplaner': return <StudienplanerPage />
    case 'dashboard':
    default:             return <DashboardPage />
  }
}
