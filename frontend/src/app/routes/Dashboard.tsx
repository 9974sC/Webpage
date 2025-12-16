import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { useAuthStore } from "@/store"
import api from "@/services/api"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CreditCard, FileText, MessageCircle, TrendingUp } from "lucide-react"
import { format } from "date-fns"
import { pl } from "date-fns/locale"

interface Loan {
  id: string
  amount: number
  interestRate: number
  durationMonths: number
  status: string
  monthlyPayment: number
  totalAmount: number
}

interface Payment {
  id: string
  amount: number
  dueDate: string
  status: string
}

export default function Dashboard() {
  const { t } = useTranslation()
  const { user } = useAuthStore()
  const [loans, setLoans] = useState<Loan[]>([])
  const [upcomingPayments, setUpcomingPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [loansRes, paymentsRes] = await Promise.all([
          api.get("/loans/my-loans"),
          api.get("/payments/upcoming"),
        ])
        setLoans(loansRes.data.loans || [])
        setUpcomingPayments(paymentsRes.data.payments || [])
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

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
        <h1 className="text-4xl font-bold text-foreground">
          {t("dashboard.welcome")}, {user?.firstName}!
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Oto przegląd Twoich finansów
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{t("dashboard.myLoans")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{loans.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{t("payments.upcoming")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{upcomingPayments.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Aktywne kredyty</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">
              {loans.filter((l) => l.status === "ACTIVE").length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Całkowita kwota</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">
              {loans
                .filter((l) => l.status === "ACTIVE")
                .reduce((sum, l) => sum + Number(l.amount), 0)
                .toLocaleString("pl-PL", { style: "currency", currency: "PLN" })}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>{t("dashboard.myLoans")}</CardTitle>
            <CardDescription>Twoje kredyty</CardDescription>
          </CardHeader>
          <CardContent>
            {loans.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Nie masz jeszcze żadnych kredytów</p>
                <Link to="/products">
                  <Button className="mt-4">Złóż wniosek</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {loans.slice(0, 3).map((loan) => (
                  <div
                    key={loan.id}
                    className="flex items-center justify-between p-4 border-2 border-border rounded-lg"
                  >
                    <div>
                      <p className="font-semibold">
                        {Number(loan.amount).toLocaleString("pl-PL", {
                          style: "currency",
                          currency: "PLN",
                        })}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Rata: {Number(loan.monthlyPayment).toLocaleString("pl-PL", {
                          style: "currency",
                          currency: "PLN",
                        })}
                      </p>
                    </div>
                    <span className="px-3 py-1 rounded-full text-sm bg-secondary text-secondary-foreground">
                      {loan.status}
                    </span>
                  </div>
                ))}
                <Link to="/products">
                  <Button variant="outline" className="w-full">
                    Zobacz wszystkie
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("payments.upcoming")}</CardTitle>
            <CardDescription>Nadchodzące płatności</CardDescription>
          </CardHeader>
          <CardContent>
            {upcomingPayments.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <CreditCard className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Brak nadchodzących płatności</p>
              </div>
            ) : (
              <div className="space-y-4">
                {upcomingPayments.slice(0, 3).map((payment) => (
                  <div
                    key={payment.id}
                    className="flex items-center justify-between p-4 border-2 border-border rounded-lg"
                  >
                    <div>
                      <p className="font-semibold">
                        {Number(payment.amount).toLocaleString("pl-PL", {
                          style: "currency",
                          currency: "PLN",
                        })}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(payment.dueDate), "d MMMM yyyy", { locale: pl })}
                      </p>
                    </div>
                    <Link to="/payments">
                      <Button size="sm">Zapłać</Button>
                    </Link>
                  </div>
                ))}
                <Link to="/payments">
                  <Button variant="outline" className="w-full">
                    Zobacz wszystkie
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Link to="/products">
          <Card className="cursor-pointer transition-calm hover:border-primary/50">
            <CardHeader>
              <TrendingUp className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Kredyty</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Złóż wniosek o kredyt</p>
            </CardContent>
          </Card>
        </Link>

        <Link to="/payments">
          <Card className="cursor-pointer transition-calm hover:border-primary/50">
            <CardHeader>
              <CreditCard className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Płatności</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Zarządzaj płatnościami</p>
            </CardContent>
          </Card>
        </Link>

        <Link to="/support">
          <Card className="cursor-pointer transition-calm hover:border-primary/50">
            <CardHeader>
              <MessageCircle className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Wsparcie</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Skontaktuj się z nami</p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  )
}

