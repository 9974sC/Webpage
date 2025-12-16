import { Link, useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { useAuthStore } from "@/store"
import { authService } from "@/services/auth"
import { Button } from "@/components/ui/button"
import { LogOut, User } from "lucide-react"

export default function Header() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { user, clearAuth } = useAuthStore()

  const handleLogout = async () => {
    try {
      await authService.logout()
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      clearAuth()
      navigate("/login")
    }
  }

  return (
    <header className="border-b-2 border-border bg-card">
      <nav className="container mx-auto flex items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
            <span className="text-xl font-bold text-primary-foreground">FF</span>
          </div>
          <span className="text-xl font-bold text-foreground">FastFinance</span>
        </Link>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              {user.role === "ADMIN" && (
                <Link to="/admin">
                  <Button variant="ghost">{t("admin.title")}</Button>
                </Link>
              )}
              <Link to="/dashboard">
                <Button variant="ghost">
                  <User className="h-5 w-5" />
                  {user.firstName}
                </Button>
              </Link>
              <Button variant="ghost" onClick={handleLogout}>
                <LogOut className="h-5 w-5" />
                {t("common.logout")}
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost">{t("common.login")}</Button>
              </Link>
              <Link to="/register">
                <Button>{t("common.register")}</Button>
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  )
}

