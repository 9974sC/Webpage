import { useState } from "react"
import { useTranslation } from "react-i18next"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import api from "@/services/api"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"

const calculateSchema = z.object({
  amount: z.number().min(1000).max(500000),
  interestRate: z.number().min(1).max(30),
  durationMonths: z.number().min(6).max(120),
})

type CalculateForm = z.infer<typeof calculateSchema>

export default function Products() {
  const { t } = useTranslation()
  const [calculation, setCalculation] = useState<{
    monthlyPayment: number
    totalAmount: number
  } | null>(null)
  const [loading, setLoading] = useState(false)
  const [applying, setApplying] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CalculateForm>({
    resolver: zodResolver(calculateSchema),
    defaultValues: {
      amount: 50000,
      interestRate: 6.5,
      durationMonths: 60,
    },
  })

  const amount = watch("amount")
  const interestRate = watch("interestRate")
  const durationMonths = watch("durationMonths")

  const onCalculate = async (data: CalculateForm) => {
    setLoading(true)
    try {
      const response = await api.post("/loans/calculate", data)
      setCalculation(response.data)
    } catch (error) {
      console.error("Calculation failed:", error)
    } finally {
      setLoading(false)
    }
  }

  const onApply = async (data: CalculateForm) => {
    setApplying(true)
    try {
      await api.post("/loans/apply", data)
      alert("Wniosek został złożony pomyślnie!")
      setCalculation(null)
    } catch (error) {
      console.error("Application failed:", error)
      alert("Nie udało się złożyć wniosku")
    } finally {
      setApplying(false)
    }
  }

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-foreground">{t("loans.title")}</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Oblicz ratę i złóż wniosek o kredyt
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t("loans.calculate")}</CardTitle>
            <CardDescription>Wypełnij formularz, aby obliczyć ratę</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onCalculate)} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="amount">
                  {t("loans.amount")}: {amount.toLocaleString("pl-PL")} PLN
                </Label>
                <Slider
                  value={[amount]}
                  onValueChange={([value]) => setValue("amount", value)}
                  min={1000}
                  max={500000}
                  step={1000}
                />
                <Input
                  id="amount"
                  type="number"
                  {...register("amount", { valueAsNumber: true })}
                />
                {errors.amount && (
                  <p className="text-sm text-destructive">{errors.amount.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="interestRate">
                  {t("loans.interestRate")}: {interestRate}%
                </Label>
                <Slider
                  value={[interestRate]}
                  onValueChange={([value]) => setValue("interestRate", value)}
                  min={1}
                  max={30}
                  step={0.1}
                />
                <Input
                  id="interestRate"
                  type="number"
                  step="0.1"
                  {...register("interestRate", { valueAsNumber: true })}
                />
                {errors.interestRate && (
                  <p className="text-sm text-destructive">{errors.interestRate.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="durationMonths">
                  {t("loans.duration")}: {durationMonths} miesięcy
                </Label>
                <Slider
                  value={[durationMonths]}
                  onValueChange={([value]) => setValue("durationMonths", value)}
                  min={6}
                  max={120}
                  step={6}
                />
                <Input
                  id="durationMonths"
                  type="number"
                  {...register("durationMonths", { valueAsNumber: true })}
                />
                {errors.durationMonths && (
                  <p className="text-sm text-destructive">{errors.durationMonths.message}</p>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? t("common.loading") : t("loans.calculate")}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Wynik kalkulacji</CardTitle>
            <CardDescription>Szacunkowa rata i całkowita kwota</CardDescription>
          </CardHeader>
          <CardContent>
            {calculation ? (
              <div className="space-y-6">
                <div className="p-6 bg-secondary/20 rounded-lg">
                  <div className="mb-4">
                    <p className="text-sm text-muted-foreground">{t("loans.monthlyPayment")}</p>
                    <p className="text-3xl font-bold text-primary">
                      {calculation.monthlyPayment.toLocaleString("pl-PL", {
                        style: "currency",
                        currency: "PLN",
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{t("loans.totalAmount")}</p>
                    <p className="text-2xl font-bold text-foreground">
                      {calculation.totalAmount.toLocaleString("pl-PL", {
                        style: "currency",
                        currency: "PLN",
                      })}
                    </p>
                  </div>
                </div>

                <Button
                  onClick={handleSubmit(onApply)}
                  className="w-full"
                  disabled={applying}
                >
                  {applying ? t("common.loading") : t("loans.apply")}
                </Button>
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <p>Wypełnij formularz i kliknij "Oblicz ratę"</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

