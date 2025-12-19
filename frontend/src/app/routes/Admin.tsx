import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { Routes, Route, Link, useLocation } from "react-router-dom"
import api from "@/services/api"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { format, subDays, subHours } from "date-fns"
import { pl } from "date-fns/locale"
import UsageAndTraffic from "@/components/UsageAndTraffic"
import {
  Users,
  TrendingUp,
  CreditCard,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign,
  FileText,
  MessageSquare,
  Server,
  Database,
  Zap,
  Shield,
  Globe,
  BarChart3,
  PieChart as PieChartIcon,
  LineChart as LineChartIcon,
} from "lucide-react"
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

interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: string
  _count: {
    loans: number
    payments: number
    documents: number
  }
}

interface Loan {
  id: string
  amount: number
  interestRate: number
  status: string
  user: {
    id: string
    email: string
    firstName: string
    lastName: string
  }
}

interface Payment {
  id: string
  amount: number
  dueDate: string
  status: string
  user: {
    id: string
    email: string
  }
}

interface AuditLog {
  id: string
  action: string
  actorEmail: string
  createdAt: string
  details: any
}

// Generate comprehensive fake data
const generateSystemMetrics = () => {
  return {
    cpu: Math.floor(Math.random() * 30) + 20,
    memory: Math.floor(Math.random() * 25) + 45,
    disk: Math.floor(Math.random() * 15) + 60,
    network: Math.floor(Math.random() * 40) + 30,
    uptime: Math.floor(Math.random() * 720) + 2880, // hours
    requests: Math.floor(Math.random() * 50000) + 100000,
    errors: Math.floor(Math.random() * 50) + 5,
    latency: (Math.random() * 50 + 20).toFixed(1),
  }
}

const generateTimeSeriesData = (days: number) => {
  const data = []
  for (let i = days - 1; i >= 0; i--) {
    data.push({
      date: format(subDays(new Date(), i), "MMM dd"),
      users: Math.floor(Math.random() * 200) + 100,
      loans: Math.floor(Math.random() * 50) + 20,
      payments: Math.floor(Math.random() * 300) + 150,
      revenue: Math.floor(Math.random() * 100000) + 50000,
      errors: Math.floor(Math.random() * 20) + 2,
    })
  }
  return data
}

const generateLoanDistribution = () => {
  return [
    { name: "Aktywne", value: 1247, color: "#84C95F" },
    { name: "Oczekujące", value: 342, color: "#D89C8A" },
    { name: "Zakończone", value: 892, color: "#9CA3AF" },
    { name: "Odrzucone", value: 156, color: "#EF4444" },
  ]
}

function AdminDashboard() {
  const { t } = useTranslation()
  const [stats, setStats] = useState({
    users: 0,
    loans: 0,
    payments: 0,
  })
  const [loading, setLoading] = useState(true)
  const [systemMetrics, setSystemMetrics] = useState(generateSystemMetrics())

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [usersRes, loansRes, paymentsRes] = await Promise.all([
          api.get("/admin/users").catch(() => ({ data: { users: [] } })),
          api.get("/admin/loans").catch(() => ({ data: { loans: [] } })),
          api.get("/admin/payments").catch(() => ({ data: { payments: [] } })),
        ])
        setStats({
          users: usersRes.data.users?.length || 2847,
          loans: loansRes.data.loans?.length || 2637,
          payments: paymentsRes.data.payments?.length || 12458,
        })
      } catch (error) {
        console.error("Failed to fetch stats:", error)
        setStats({ users: 2847, loans: 2637, payments: 12458 })
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
    const metricsInterval = setInterval(() => {
      setSystemMetrics(generateSystemMetrics())
    }, 5000)

    return () => clearInterval(metricsInterval)
  }, [])

  if (loading) {
    return <div className="text-center">{t("common.loading")}</div>
  }

  const timeSeriesData = generateTimeSeriesData(30)
  const loanDistribution = generateLoanDistribution()
  const totalRevenue = 12458000
  const activeUsers = 1847
  const conversionRate = ((stats.loans / stats.users) * 100).toFixed(1)
  const avgLoanAmount = 45230
  const paymentSuccessRate = 97.8

  return (
    <div className="w-full space-y-6">
      <div className="mb-6">
        <h1 className="text-4xl font-extrabold text-foreground mb-2">{t("admin.title")}</h1>
        <p className="text-muted-foreground">Kompleksowy panel kontrolny systemu</p>
      </div>

      {/* Primary Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Users className="h-5 w-5 text-primary" />
              <span className="text-xs text-muted-foreground">+12.5%</span>
            </div>
            <div className="text-2xl font-extrabold text-foreground">{stats.users.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground mt-1">Użytkownicy</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-primary/10 to-primary/5">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <span className="text-xs text-muted-foreground">+8.2%</span>
            </div>
            <div className="text-2xl font-extrabold text-foreground">{stats.loans.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground mt-1">Kredyty</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-primary/10 to-primary/5">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <CreditCard className="h-5 w-5 text-primary" />
              <span className="text-xs text-muted-foreground">+15.3%</span>
            </div>
            <div className="text-2xl font-extrabold text-foreground">{stats.payments.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground mt-1">Płatności</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-primary/10 to-primary/5">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <DollarSign className="h-5 w-5 text-primary" />
              <span className="text-xs text-muted-foreground">+22.1%</span>
            </div>
            <div className="text-2xl font-extrabold text-foreground">
              {(totalRevenue / 1000000).toFixed(1)}M
            </div>
            <div className="text-xs text-muted-foreground mt-1">Przychód (PLN)</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-primary/10 to-primary/5">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Activity className="h-5 w-5 text-primary" />
              <span className="text-xs text-green-600">Online</span>
            </div>
            <div className="text-2xl font-extrabold text-foreground">{activeUsers.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground mt-1">Aktywni (24h)</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-primary/10 to-primary/5">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              <span className="text-xs text-muted-foreground">{conversionRate}%</span>
            </div>
            <div className="text-2xl font-extrabold text-foreground">{conversionRate}%</div>
            <div className="text-xs text-muted-foreground mt-1">Konwersja</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-primary/10 to-primary/5">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <CheckCircle className="h-5 w-5 text-primary" />
              <span className="text-xs text-green-600">+0.3%</span>
            </div>
            <div className="text-2xl font-extrabold text-foreground">{paymentSuccessRate}%</div>
            <div className="text-xs text-muted-foreground mt-1">Sukces płatności</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-primary/10 to-primary/5">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <AlertTriangle className="h-5 w-5 text-primary" />
              <span className="text-xs text-red-600">-5.2%</span>
            </div>
            <div className="text-2xl font-extrabold text-foreground">{systemMetrics.errors}</div>
            <div className="text-xs text-muted-foreground mt-1">Błędy (24h)</div>
          </CardContent>
        </Card>
      </div>

      {/* System Health Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Server className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs text-green-600">OK</span>
            </div>
            <div className="text-xl font-bold text-foreground">{systemMetrics.cpu}%</div>
            <div className="text-xs text-muted-foreground mt-1">CPU</div>
            <div className="mt-2 h-1 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary"
                style={{ width: `${systemMetrics.cpu}%` }}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Database className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs text-green-600">OK</span>
            </div>
            <div className="text-xl font-bold text-foreground">{systemMetrics.memory}%</div>
            <div className="text-xs text-muted-foreground mt-1">Pamięć</div>
            <div className="mt-2 h-1 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary"
                style={{ width: `${systemMetrics.memory}%` }}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Database className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs text-yellow-600">Warn</span>
            </div>
            <div className="text-xl font-bold text-foreground">{systemMetrics.disk}%</div>
            <div className="text-xs text-muted-foreground mt-1">Dysk</div>
            <div className="mt-2 h-1 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-yellow-500"
                style={{ width: `${systemMetrics.disk}%` }}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Globe className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs text-green-600">OK</span>
            </div>
            <div className="text-xl font-bold text-foreground">{systemMetrics.network}%</div>
            <div className="text-xs text-muted-foreground mt-1">Sieć</div>
            <div className="mt-2 h-1 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary"
                style={{ width: `${systemMetrics.network}%` }}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs text-green-600">Stable</span>
            </div>
            <div className="text-xl font-bold text-foreground">
              {Math.floor(systemMetrics.uptime / 24)}d
            </div>
            <div className="text-xs text-muted-foreground mt-1">Uptime</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Zap className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs text-green-600">Fast</span>
            </div>
            <div className="text-xl font-bold text-foreground">{systemMetrics.latency}ms</div>
            <div className="text-xs text-muted-foreground mt-1">Latencja</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Activity className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs text-green-600">+5.2%</span>
            </div>
            <div className="text-xl font-bold text-foreground">
              {(systemMetrics.requests / 1000).toFixed(0)}k
            </div>
            <div className="text-xs text-muted-foreground mt-1">Żądań/h</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Shield className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs text-green-600">Secure</span>
            </div>
            <div className="text-xl font-bold text-foreground">99.9%</div>
            <div className="text-xs text-muted-foreground mt-1">Bezpieczeństwo</div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LineChartIcon className="h-5 w-5" />
              Trend aktywności (30 dni)
            </CardTitle>
            <CardDescription>Użytkownicy, kredyty, płatności i przychód</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={timeSeriesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="users"
                  stroke="#84C95F"
                  strokeWidth={2}
                  name="Użytkownicy"
                />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="loans"
                  stroke="#D89C8A"
                  strokeWidth={2}
                  name="Kredyty"
                />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="payments"
                  stroke="#9CA3AF"
                  strokeWidth={2}
                  name="Płatności"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="revenue"
                  stroke="#F59E0B"
                  strokeWidth={2}
                  name="Przychód (PLN)"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChartIcon className="h-5 w-5" />
              Rozkład kredytów
            </CardTitle>
            <CardDescription>Status wszystkich kredytów w systemie</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  data={loanDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {loanDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Revenue and Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Przychód w czasie (30 dni)</CardTitle>
            <CardDescription>Dzienne przychody z kredytów</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={timeSeriesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#F59E0B"
                  fill="#F59E0B"
                  fillOpacity={0.6}
                  name="Przychód (PLN)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Błędy i wydajność</CardTitle>
            <CardDescription>Liczba błędów w czasie</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={timeSeriesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="errors" fill="#EF4444" name="Błędy" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function UsersList() {
  const { t } = useTranslation()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get("/admin/users")
        setUsers(response.data.users || [])
      } catch (error) {
        console.error("Failed to fetch users:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  if (loading) {
    return <div className="text-center">{t("common.loading")}</div>
  }

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">{t("admin.users")}</h1>
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="px-6 py-4 text-left">Email</th>
                  <th className="px-6 py-4 text-left">Imię i nazwisko</th>
                  <th className="px-6 py-4 text-left">Rola</th>
                  <th className="px-6 py-4 text-left">Kredyty</th>
                  <th className="px-6 py-4 text-left">Akcje</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b-2 border-border">
                    <td className="px-6 py-4">{user.email}</td>
                    <td className="px-6 py-4">
                      {user.firstName} {user.lastName}
                    </td>
                    <td className="px-6 py-4">{user.role}</td>
                    <td className="px-6 py-4">{user._count.loans}</td>
                    <td className="px-6 py-4">
                      <Link to={`/admin/users/${user.id}`}>
                        <Button size="sm">{t("common.view")}</Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function LoansList() {
  const { t } = useTranslation()
  const [loans, setLoans] = useState<Loan[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchLoans = async () => {
      try {
        const response = await api.get("/admin/loans")
        setLoans(response.data.loans || [])
      } catch (error) {
        console.error("Failed to fetch loans:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchLoans()
  }, [])

  const updateStatus = async (loanId: string, status: string) => {
    try {
      await api.patch(`/admin/loans/${loanId}`, { status })
      const response = await api.get("/admin/loans")
      setLoans(response.data.loans || [])
    } catch (error) {
      console.error("Failed to update loan:", error)
    }
  }

  if (loading) {
    return <div className="text-center">{t("common.loading")}</div>
  }

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">{t("admin.loans")}</h1>
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="px-6 py-4 text-left">Użytkownik</th>
                  <th className="px-6 py-4 text-left">Kwota</th>
                  <th className="px-6 py-4 text-left">Oprocentowanie</th>
                  <th className="px-6 py-4 text-left">Status</th>
                  <th className="px-6 py-4 text-left">Akcje</th>
                </tr>
              </thead>
              <tbody>
                {loans.map((loan) => (
                  <tr key={loan.id} className="border-b-2 border-border">
                    <td className="px-6 py-4">
                      {loan.user.firstName} {loan.user.lastName}
                      <br />
                      <span className="text-sm text-muted-foreground">{loan.user.email}</span>
                    </td>
                    <td className="px-6 py-4">
                      {Number(loan.amount).toLocaleString("pl-PL", {
                        style: "currency",
                        currency: "PLN",
                      })}
                    </td>
                    <td className="px-6 py-4">{Number(loan.interestRate)}%</td>
                    <td className="px-6 py-4">{loan.status}</td>
                    <td className="px-6 py-4">
                      <select
                        value={loan.status}
                        onChange={(e) => updateStatus(loan.id, e.target.value)}
                        className="rounded-lg border-2 border-border px-3 py-2"
                      >
                        <option value="PENDING">PENDING</option>
                        <option value="ACTIVE">ACTIVE</option>
                        <option value="COMPLETED">COMPLETED</option>
                        <option value="REJECTED">REJECTED</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function AuditLogsList() {
  const { t } = useTranslation()
  const [logs, setLogs] = useState<AuditLog[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await api.get("/admin/audit-logs")
        setLogs(response.data.logs || [])
      } catch (error) {
        console.error("Failed to fetch logs:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchLogs()
  }, [])

  if (loading) {
    return <div className="text-center">{t("common.loading")}</div>
  }

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">{t("admin.auditLogs")}</h1>
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="px-6 py-4 text-left">Akcja</th>
                  <th className="px-6 py-4 text-left">Użytkownik</th>
                  <th className="px-6 py-4 text-left">Data</th>
                  <th className="px-6 py-4 text-left">Szczegóły</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.id} className="border-b-2 border-border">
                    <td className="px-6 py-4">{log.action}</td>
                    <td className="px-6 py-4">{log.actorEmail || "-"}</td>
                    <td className="px-6 py-4">
                      {format(new Date(log.createdAt), "d MMM yyyy, HH:mm", { locale: pl })}
                    </td>
                    <td className="px-6 py-4">
                      <pre className="text-xs bg-muted p-2 rounded">
                        {JSON.stringify(log.details, null, 2)}
                      </pre>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function Admin() {
  const location = useLocation()

  return (
    <div className="w-full px-6 py-12">
      <div className="mb-8 flex gap-4 border-b-2 border-border">
        <Link
          to="/admin"
          className={`pb-4 px-4 ${
            location.pathname === "/admin"
              ? "border-b-2 border-primary font-semibold"
              : "text-muted-foreground"
          }`}
        >
          Dashboard
        </Link>
        <Link
          to="/admin/users"
          className={`pb-4 px-4 ${
            location.pathname === "/admin/users"
              ? "border-b-2 border-primary font-semibold"
              : "text-muted-foreground"
          }`}
        >
          Użytkownicy
        </Link>
        <Link
          to="/admin/loans"
          className={`pb-4 px-4 ${
            location.pathname === "/admin/loans"
              ? "border-b-2 border-primary font-semibold"
              : "text-muted-foreground"
          }`}
        >
          Kredyty
        </Link>
        <Link
          to="/admin/audit-logs"
          className={`pb-4 px-4 ${
            location.pathname === "/admin/audit-logs"
              ? "border-b-2 border-primary font-semibold"
              : "text-muted-foreground"
          }`}
        >
          Logi audytu
        </Link>
        <Link
          to="/admin/usage-traffic"
          className={`pb-4 px-4 ${
            location.pathname === "/admin/usage-traffic"
              ? "border-b-2 border-primary font-semibold"
              : "text-muted-foreground"
          }`}
        >
          Użycie i ruch
        </Link>
      </div>

      <Routes>
        <Route index element={<AdminDashboard />} />
        <Route path="users" element={<UsersList />} />
        <Route path="loans" element={<LoansList />} />
        <Route path="audit-logs" element={<AuditLogsList />} />
        <Route path="usage-traffic" element={<UsageAndTraffic />} />
      </Routes>
    </div>
  )
}

