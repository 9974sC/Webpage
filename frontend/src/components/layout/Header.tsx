import { Link, useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { useAuthStore } from "@/store"
import { authService } from "@/services/auth"
import { Button } from "@/components/ui/button"
import { LogOut, User } from "lucide-react"
import LanguageSelector from "@/components/ui/language-selector"

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
    <header className="border-b-2 border-border bg-card sticky top-0 z-50">
      <nav className="container mx-auto flex items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
            <span className="text-xl font-bold text-primary-foreground">A</span>
          </div>
          <span className="text-xl font-bold text-foreground">Ascendia</span>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-base font-medium text-foreground hover:text-primary transition-calm">
            Strona główna
          </Link>
          <Link to="/" className="text-base font-medium text-foreground hover:text-primary transition-calm">
            Oblicz
          </Link>
          <Link to="/dashboard" className="text-base font-medium text-foreground hover:text-primary transition-calm">
            Moje Konto
          </Link>
          <Link to="/about" className="text-base font-medium text-foreground hover:text-primary transition-calm">
            {t("landing.about")}
          </Link>
          <Link to="/education" className="text-base font-medium text-foreground hover:text-primary transition-calm">
            Edukacja
          </Link>
          <Link to="/support" className="text-base font-medium text-foreground hover:text-primary transition-calm">
            Wsparcie
          </Link>
          <Link to="/contact" className="text-base font-medium text-foreground hover:text-primary transition-calm">
            {t("landing.contact")}
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <LanguageSelector />
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
                  <span className="hidden sm:inline">{user.firstName}</span>
                </Button>
              </Link>
              <Button variant="ghost" onClick={handleLogout}>
                <LogOut className="h-5 w-5" />
                <span className="hidden sm:inline">{t("common.logout")}</span>
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

