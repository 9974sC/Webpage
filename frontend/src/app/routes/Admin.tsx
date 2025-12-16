import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { Routes, Route, Link, useLocation } from "react-router-dom"
import api from "@/services/api"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"
import { pl } from "date-fns/locale"

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

function AdminDashboard() {
  const { t } = useTranslation()
  const [stats, setStats] = useState({
    users: 0,
    loans: 0,
    payments: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [usersRes, loansRes, paymentsRes] = await Promise.all([
          api.get("/admin/users"),
          api.get("/admin/loans"),
          api.get("/admin/payments"),
        ])
        setStats({
          users: usersRes.data.users?.length || 0,
          loans: loansRes.data.loans?.length || 0,
          payments: paymentsRes.data.payments?.length || 0,
        })
      } catch (error) {
        console.error("Failed to fetch stats:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) {
    return <div className="text-center">{t("common.loading")}</div>
  }

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">{t("admin.title")}</h1>
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>{t("admin.users")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{stats.users}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t("admin.loans")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{stats.loans}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t("admin.payments")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{stats.payments}</div>
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
    <div className="container mx-auto px-6 py-12">
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
      </div>

      <Routes>
        <Route index element={<AdminDashboard />} />
        <Route path="users" element={<UsersList />} />
        <Route path="loans" element={<LoansList />} />
        <Route path="audit-logs" element={<AuditLogsList />} />
      </Routes>
    </div>
  )
}

