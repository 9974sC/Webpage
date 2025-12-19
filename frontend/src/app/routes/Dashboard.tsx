import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { useAuthStore } from "@/store"
import api from "@/services/api"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CreditCard, FileText, MessageCircle, TrendingUp, Settings, DollarSign, Calendar, AlertCircle } from "lucide-react"
import { format, subDays } from "date-fns"
import { pl } from "date-fns/locale"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"

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

// Generate fake data
const generateFakeLoans = (): Loan[] => {
  return [
    {
      id: "1",
      amount: 50000,
      interestRate: 8.5,
      durationMonths: 60,
      status: "ACTIVE",
      monthlyPayment: 1025.50,
      totalAmount: 61530,
    },
    {
      id: "2",
      amount: 25000,
      interestRate: 7.2,
      durationMonths: 36,
      status: "ACTIVE",
      monthlyPayment: 775.80,
      totalAmount: 27928.80,
    },
    {
      id: "3",
      amount: 100000,
      interestRate: 9.1,
      durationMonths: 120,
      status: "PENDING",
      monthlyPayment: 1280.00,
      totalAmount: 153600,
    },
  ]
}

const generateFakePayments = (): Payment[] => {
  const payments: Payment[] = []
  const today = new Date()
  for (let i = 0; i < 5; i++) {
    payments.push({
      id: `p${i + 1}`,
      amount: 1025.50 + i * 100,
      dueDate: format(subDays(today, -i * 7), "yyyy-MM-dd"),
      status: i === 0 ? "OVERDUE" : "PENDING",
    })
  }
  return payments
}

const generatePaymentHistory = () => {
  const data = []
  for (let i = 29; i >= 0; i--) {
    data.push({
      date: format(subDays(new Date(), i), "MMM dd"),
      amount: Math.floor(Math.random() * 2000) + 500,
      paid: Math.floor(Math.random() * 1500) + 400,
    })
  }
  return data
}

const generateLoanStatusData = () => {
  return [
    { name: "Aktywne", value: 2, color: "#84C95F" },
    { name: "Oczekujące", value: 1, color: "#D89C8A" },
    { name: "Zakończone", value: 0, color: "#9CA3AF" },
  ]
}

const generateMonthlyTrend = () => {
  const months = ["Sty", "Lut", "Mar", "Kwi", "Maj", "Cze", "Lip", "Sie", "Wrz", "Paź", "Lis", "Gru"]
  return months.map((month, index) => ({
    month,
    wydatki: Math.floor(Math.random() * 5000) + 2000,
    wpływy: Math.floor(Math.random() * 8000) + 5000,
    oszczędności: Math.floor(Math.random() * 3000) + 1000,
  }))
}

export default function Dashboard() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const [loans, setLoans] = useState<Loan[]>([])
  const [upcomingPayments, setUpcomingPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [loansRes, paymentsRes] = await Promise.all([
          api.get("/loans/my-loans").catch(() => ({ data: { loans: [] } })),
          api.get("/payments/upcoming").catch(() => ({ data: { payments: [] } })),
        ])
        const fetchedLoans = loansRes.data.loans || []
        const fetchedPayments = paymentsRes.data.payments || []
        
        // Use fake data if API returns empty
        setLoans(fetchedLoans.length > 0 ? fetchedLoans : generateFakeLoans())
        setUpcomingPayments(fetchedPayments.length > 0 ? fetchedPayments : generateFakePayments())
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error)
        // Fallback to fake data
        setLoans(generateFakeLoans())
        setUpcomingPayments(generateFakePayments())
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const paymentHistory = generatePaymentHistory()
  const loanStatusData = generateLoanStatusData()
  const monthlyTrend = generateMonthlyTrend()
  
  const totalActiveLoans = loans.filter((l) => l.status === "ACTIVE").length
  const totalLoanAmount = loans
    .filter((l) => l.status === "ACTIVE")
    .reduce((sum, l) => sum + Number(l.amount), 0)
  const totalMonthlyPayments = loans
    .filter((l) => l.status === "ACTIVE")
    .reduce((sum, l) => sum + Number(l.monthlyPayment), 0)
  const overduePayments = upcomingPayments.filter((p) => p.status === "OVERDUE").length

  if (loading) {
    return (
      <div className="container mx-auto px-6 py-12">
        <div className="text-center">{t("common.loading")}</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-extrabold text-foreground">
            {t("dashboard.welcome")}, {user?.firstName}!
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Oto przegląd Twoich finansów
          </p>
        </div>
        {user?.role === "ADMIN" && (
          <Button
            onClick={() => navigate("/admin/usage-traffic")}
            size="lg"
            className="flex items-center gap-2"
          >
            <Settings className="h-5 w-5" />
            Panel administracyjny
          </Button>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-medium">{t("dashboard.myLoans")}</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{loans.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {totalActiveLoans} aktywnych
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-medium">{t("payments.upcoming")}</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{upcomingPayments.length}</div>
            {overduePayments > 0 && (
              <p className="text-xs text-destructive mt-1 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {overduePayments} zaległych
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-medium">Miesięczna rata</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">
              {totalMonthlyPayments.toLocaleString("pl-PL", { style: "currency", currency: "PLN" })}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Suma wszystkich rat
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-medium">Całkowita kwota</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">
              {totalLoanAmount.toLocaleString("pl-PL", { style: "currency", currency: "PLN" })}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Wszystkie aktywne kredyty
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 md:grid-cols-2 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Historia płatności (30 dni)</CardTitle>
            <CardDescription>Wykres płatności i wpłat</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={paymentHistory}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="amount"
                  stackId="1"
                  stroke="#84C95F"
                  fill="#84C95F"
                  name="Kwota do zapłaty"
                />
                <Area
                  type="monotone"
                  dataKey="paid"
                  stackId="2"
                  stroke="#D89C8A"
                  fill="#D89C8A"
                  name="Zapłacone"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Status kredytów</CardTitle>
            <CardDescription>Rozkład kredytów według statusu</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={loanStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {loanStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Trend finansowy (12 miesięcy)</CardTitle>
            <CardDescription>Wydatki, wpływy i oszczędności</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={monthlyTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="wydatki" fill="#D89C8A" name="Wydatki" />
                <Bar dataKey="wpływy" fill="#84C95F" name="Wpływy" />
                <Bar dataKey="oszczędności" fill="#9CA3AF" name="Oszczędności" />
              </BarChart>
            </ResponsiveContainer>
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

