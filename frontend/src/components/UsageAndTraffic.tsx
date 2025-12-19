import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import api from "@/services/api"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, TrendingUp, CreditCard, Activity, BarChart3 } from "lucide-react"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

interface Stats {
  users: {
    total: number
    newToday: number
    newThisMonth: number
    newLast7Days: number
  }
  loans: {
    total: number
    active: number
    pending: number
    totalAmount: number
  }
  payments: {
    total: number
    paid: number
    overdue: number
    totalPaidAmount: number
  }
  traffic: {
    totalLogins: number
    loginsLast7Days: number
    loginsLast30Days: number
    dailyActivity: Array<{
      date: string
      logins: number
      newUsers: number
    }>
  }
}

export default function UsageAndTraffic() {
  const { t } = useTranslation()
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get("/admin/stats")
        setStats(response.data)
      } catch (error) {
        console.error("Failed to fetch stats:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
    const interval = setInterval(fetchStats, 60000) // Refresh every minute
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return <div className="text-center">{t("common.loading")}</div>
  }

  if (!stats) {
    return <div className="text-center text-muted-foreground">Brak danych</div>
  }

  const chartData = stats.traffic.dailyActivity.map((day) => ({
    date: new Date(day.date).toLocaleDateString("pl-PL", {
      month: "short",
      day: "numeric",
    }),
    logins: day.logins,
    newUsers: day.newUsers,
  }))

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold text-foreground mb-2">
          Użycie i ruch
        </h1>
        <p className="text-lg text-muted-foreground">
          Statystyki użytkowania i aktywności w systemie
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Użytkownicy</CardTitle>
              <Users className="h-5 w-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-primary mb-2">
              {stats.users.total}
            </div>
            <div className="text-sm text-muted-foreground space-y-1">
              <div>Dzisiaj: +{stats.users.newToday}</div>
              <div>Ostatnie 7 dni: +{stats.users.newLast7Days}</div>
              <div>Ten miesiąc: +{stats.users.newThisMonth}</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Kredyty</CardTitle>
              <TrendingUp className="h-5 w-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-primary mb-2">
              {stats.loans.total}
            </div>
            <div className="text-sm text-muted-foreground space-y-1">
              <div>Aktywne: {stats.loans.active}</div>
              <div>Oczekujące: {stats.loans.pending}</div>
              <div className="font-semibold text-foreground">
                Suma: {Number(stats.loans.totalAmount).toLocaleString("pl-PL", {
                  style: "currency",
                  currency: "PLN",
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Płatności</CardTitle>
              <CreditCard className="h-5 w-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-primary mb-2">
              {stats.payments.total}
            </div>
            <div className="text-sm text-muted-foreground space-y-1">
              <div>Opłacone: {stats.payments.paid}</div>
              <div>Zaległe: {stats.payments.overdue}</div>
              <div className="font-semibold text-foreground">
                Suma: {Number(stats.payments.totalPaidAmount).toLocaleString("pl-PL", {
                  style: "currency",
                  currency: "PLN",
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Logowania</CardTitle>
              <Activity className="h-5 w-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-primary mb-2">
              {stats.traffic.totalLogins}
            </div>
            <div className="text-sm text-muted-foreground space-y-1">
              <div>Ostatnie 7 dni: {stats.traffic.loginsLast7Days}</div>
              <div>Ostatnie 30 dni: {stats.traffic.loginsLast30Days}</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Aktywność dzienna (ostatnie 7 dni)</CardTitle>
            <CardDescription>Logowania i nowi użytkownicy</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="logins"
                  stroke="#84C95F"
                  strokeWidth={2}
                  name="Logowania"
                />
                <Line
                  type="monotone"
                  dataKey="newUsers"
                  stroke="#D89C8A"
                  strokeWidth={2}
                  name="Nowi użytkownicy"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Aktywność dzienna (ostatnie 7 dni)</CardTitle>
            <CardDescription>Porównanie logowań i nowych użytkowników</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="logins" fill="#84C95F" name="Logowania" />
                <Bar dataKey="newUsers" fill="#D89C8A" name="Nowi użytkownicy" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Summary Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Podsumowanie
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="p-4 bg-muted rounded-lg">
              <div className="text-sm text-muted-foreground mb-1">Współczynnik aktywności</div>
              <div className="text-2xl font-extrabold text-foreground">
                {stats.users.total > 0
                  ? ((stats.traffic.loginsLast30Days / stats.users.total) * 100).toFixed(1)
                  : 0}
                %
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                Logowania na użytkownika (30 dni)
              </div>
            </div>

            <div className="p-4 bg-muted rounded-lg">
              <div className="text-sm text-muted-foreground mb-1">Wskaźnik konwersji</div>
              <div className="text-2xl font-extrabold text-foreground">
                {stats.users.total > 0
                  ? ((stats.loans.total / stats.users.total) * 100).toFixed(1)
                  : 0}
                %
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                Użytkownicy z kredytami
              </div>
            </div>

            <div className="p-4 bg-muted rounded-lg">
              <div className="text-sm text-muted-foreground mb-1">Wskaźnik spłaty</div>
              <div className="text-2xl font-extrabold text-foreground">
                {stats.payments.total > 0
                  ? ((stats.payments.paid / stats.payments.total) * 100).toFixed(1)
                  : 0}
                %
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                Opłacone płatności
              </div>
            </div>

            <div className="p-4 bg-muted rounded-lg">
              <div className="text-sm text-muted-foreground mb-1">Średnia wartość kredytu</div>
              <div className="text-2xl font-extrabold text-foreground">
                {stats.loans.active > 0
                  ? (Number(stats.loans.totalAmount) / stats.loans.active).toLocaleString("pl-PL", {
                      style: "currency",
                      currency: "PLN",
                    })
                  : "0 PLN"}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                Na aktywny kredyt
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
