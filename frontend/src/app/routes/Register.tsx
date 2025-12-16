import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { authService } from "@/services/auth"
import { useAuthStore } from "@/store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"

const registerSchema = z.object({
  email: z.string().email("Nieprawidłowy adres email"),
  password: z.string().min(8, "Hasło musi mieć co najmniej 8 znaków"),
  firstName: z.string().min(1, "Imię jest wymagane"),
  lastName: z.string().min(1, "Nazwisko jest wymagane"),
  phone: z.string().optional(),
  gdprConsent: z.boolean().refine((val) => val === true, {
    message: "Musisz wyrazić zgodę na przetwarzanie danych",
  }),
})

type RegisterForm = z.infer<typeof registerSchema>

export default function Register() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { setAuth } = useAuthStore()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      gdprConsent: false,
    },
  })

  const gdprConsent = watch("gdprConsent")

  const onSubmit = async (data: RegisterForm) => {
    setError(null)
    setLoading(true)

    try {
      const response = await authService.register({
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
      })
      setAuth(response.user)
      navigate("/dashboard")
    } catch (err: any) {
      setError(err.response?.data?.error || "Rejestracja nie powiodła się")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto flex min-h-[calc(100vh-80px)] items-center justify-center px-6 py-12">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-3xl">{t("common.register")}</CardTitle>
          <CardDescription>Utwórz nowe konto w FastFinance</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {error && (
              <div className="rounded-lg bg-destructive/10 p-4 text-sm text-destructive">
                {error}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">{t("auth.firstName")}</Label>
                <Input id="firstName" {...register("firstName")} />
                {errors.firstName && (
                  <p className="text-sm text-destructive">{errors.firstName.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">{t("auth.lastName")}</Label>
                <Input id="lastName" {...register("lastName")} />
                {errors.lastName && (
                  <p className="text-sm text-destructive">{errors.lastName.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">{t("auth.email")}</Label>
              <Input
                id="email"
                type="email"
                {...register("email")}
                placeholder="jan.kowalski@example.pl"
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">{t("auth.phone")} (opcjonalnie)</Label>
              <Input
                id="phone"
                type="tel"
                {...register("phone")}
                placeholder="+48 123 456 789"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">{t("auth.password")}</Label>
              <Input
                id="password"
                type="password"
                {...register("password")}
                placeholder="••••••••"
              />
              {errors.password && (
                <p className="text-sm text-destructive">{errors.password.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-start gap-3">
                <Checkbox
                  id="gdprConsent"
                  checked={gdprConsent}
                  onCheckedChange={(checked) => setValue("gdprConsent", checked === true)}
                />
                <Label htmlFor="gdprConsent" className="text-sm leading-relaxed cursor-pointer">
                  {t("gdpr.consent")}
                </Label>
              </div>
              {errors.gdprConsent && (
                <p className="text-sm text-destructive">{errors.gdprConsent.message}</p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? t("common.loading") : t("common.register")}
            </Button>

            <div className="text-center text-sm">
              <span className="text-muted-foreground">{t("auth.alreadyHaveAccount")} </span>
              <Link to="/login" className="text-primary hover:underline">
                {t("common.login")}
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

