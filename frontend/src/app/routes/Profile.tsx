import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { useAuthStore } from "@/store"
import { authService } from "@/services/auth"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function Profile() {
  const { t } = useTranslation()
  const { user, setUser } = useAuthStore()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await authService.getCurrentUser()
        setUser(response.user)
      } catch (error) {
        console.error("Failed to fetch user:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [setUser])

  if (loading) {
    return (
      <div className="container mx-auto px-6 py-12">
        <div className="text-center">{t("common.loading")}</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-foreground">{t("profile.title")}</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          {t("profile.personalInfo")}
        </p>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>{t("profile.personalInfo")}</CardTitle>
          <CardDescription>Twoje dane osobowe</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Imię i nazwisko</p>
              <p className="text-lg font-semibold">
                {user?.firstName} {user?.lastName}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="text-lg font-semibold">{user?.email}</p>
            </div>
            {user?.phone && (
              <div>
                <p className="text-sm text-muted-foreground">Telefon</p>
                <p className="text-lg font-semibold">{user.phone}</p>
              </div>
            )}
            <div>
              <p className="text-sm text-muted-foreground">Rola</p>
              <p className="text-lg font-semibold">{user?.role}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
