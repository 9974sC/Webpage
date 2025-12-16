import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import api from "@/services/api"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { format } from "date-fns"
import { pl } from "date-fns/locale"

interface Payment {
  id: string
  amount: number
  dueDate: string
  status: string
  paidAt?: string
  transactionId?: string
  loan?: {
    id: string
    amount: number
  }
}

export default function Payments() {
  const { t } = useTranslation()
  const [upcoming, setUpcoming] = useState<Payment[]>([])
  const [history, setHistory] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState<string | null>(null)
  const [cardToken, setCardToken] = useState("")

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [upcomingRes, historyRes] = await Promise.all([
          api.get("/payments/upcoming"),
          api.get("/payments/history"),
        ])
        setUpcoming(upcomingRes.data.payments || [])
        setHistory(historyRes.data.payments || [])
      } catch (error) {
        console.error("Failed to fetch payments:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handlePay = async (paymentId: string) => {
    if (!cardToken) {
      alert("Wprowadź token karty")
      return
    }

    setProcessing(paymentId)
    try {
      await api.post(`/payments/${paymentId}/pay`, { cardToken })
      alert("Płatność została przetworzona pomyślnie!")
      // Refresh data
      const [upcomingRes, historyRes] = await Promise.all([
        api.get("/payments/upcoming"),
        api.get("/payments/history"),
      ])
      setUpcoming(upcomingRes.data.payments || [])
      setHistory(historyRes.data.payments || [])
      setCardToken("")
    } catch (error: any) {
      alert(error.response?.data?.error || "Płatność nie powiodła się")
    } finally {
      setProcessing(null)
    }
  }

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
        <h1 className="text-4xl font-bold text-foreground">{t("payments.title")}</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Zarządzaj swoimi płatnościami
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t("payments.upcoming")}</CardTitle>
            <CardDescription>Nadchodzące płatności do opłacenia</CardDescription>
          </CardHeader>
          <CardContent>
            {upcoming.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>Brak nadchodzących płatności</p>
              </div>
            ) : (
              <div className="space-y-4">
                {upcoming.map((payment) => (
                  <div
                    key={payment.id}
                    className="p-4 border-2 border-border rounded-lg"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-xl font-bold">
                          {Number(payment.amount).toLocaleString("pl-PL", {
                            style: "currency",
                            currency: "PLN",
                          })}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(payment.dueDate), "d MMMM yyyy", { locale: pl })}
                        </p>
                      </div>
                      <span className="px-3 py-1 rounded-full text-sm bg-secondary text-secondary-foreground">
                        {payment.status}
                      </span>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`token-${payment.id}`}>
                        {t("payments.cardToken")} (demo: tok_test)
                      </Label>
                      <Input
                        id={`token-${payment.id}`}
                        value={cardToken}
                        onChange={(e) => setCardToken(e.target.value)}
                        placeholder="tok_test123"
                      />
                    </div>
                    <Button
                      onClick={() => handlePay(payment.id)}
                      className="w-full mt-2"
                      disabled={processing === payment.id || !cardToken}
                    >
                      {processing === payment.id
                        ? t("payments.processing")
                        : t("payments.payNow")}
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("payments.history")}</CardTitle>
            <CardDescription>Historia opłaconych płatności</CardDescription>
          </CardHeader>
          <CardContent>
            {history.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>Brak historii płatności</p>
              </div>
            ) : (
              <div className="space-y-4">
                {history.map((payment) => (
                  <div
                    key={payment.id}
                    className="p-4 border-2 border-border rounded-lg"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-lg font-semibold">
                          {Number(payment.amount).toLocaleString("pl-PL", {
                            style: "currency",
                            currency: "PLN",
                          })}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {payment.paidAt &&
                            format(new Date(payment.paidAt), "d MMMM yyyy", { locale: pl })}
                        </p>
                        {payment.transactionId && (
                          <p className="text-xs text-muted-foreground mt-1">
                            ID: {payment.transactionId}
                          </p>
                        )}
                      </div>
                      <span className="px-3 py-1 rounded-full text-sm bg-primary/10 text-primary">
                        {payment.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

