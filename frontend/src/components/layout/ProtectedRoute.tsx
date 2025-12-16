import { Navigate } from "react-router-dom"
import { useAuthStore } from "@/store"

interface ProtectedRouteProps {
  children: React.ReactNode
  requireAdmin?: boolean
}

export default function ProtectedRoute({
  children,
  requireAdmin = false,
}: ProtectedRouteProps) {
  const { user } = useAuthStore()

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (requireAdmin && user.role !== "ADMIN") {
    return <Navigate to="/dashboard" replace />
  }

  return <>{children}</>
}

