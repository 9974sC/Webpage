import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import api from "@/services/api"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { format, subDays, subHours } from "date-fns"
import { pl } from "date-fns/locale"
import {
  MessageSquare,
  AlertCircle,
  CheckCircle,
  Clock,
  TrendingUp,
  Users,
  Activity,
  BarChart3,
  Filter,
  Search,
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

const messageSchema = z.object({
  subject: z.string().min(1, "Temat jest wymagany"),
  message: z.string().min(1, "Wiadomość jest wymagana"),
})

type MessageForm = z.infer<typeof messageSchema>

interface SupportMessage {
  id: string
  subject: string
  message: string
  status: string
  priority: string
  category: string
  adminResponse?: string
  createdAt: string
  respondedAt?: string
  userId?: string
  userName?: string
  email?: string
}

// Generate fake support tickets
const generateFakeTickets = (): SupportMessage[] => {
  const categories = ["Kredyt", "Płatność", "Konto", "Techniczne", "Inne"]
  const priorities = ["NISKA", "ŚREDNIA", "WYSOKA", "KRYTYCZNA"]
  const statuses = ["OTWARTE", "W_TRAKCIE", "OCZEKUJE", "ZAMKNIĘTE"]
  const subjects = [
    "Problem z płatnością",
    "Pytanie o kredyt",
    "Nie mogę się zalogować",
    "Błąd w aplikacji",
    "Zmiana danych konta",
    "Anulowanie kredytu",
    "Pytanie o oprocentowanie",
    "Problem z dokumentami",
  ]

  const tickets: SupportMessage[] = []
  for (let i = 0; i < 50; i++) {
    const createdAt = subHours(new Date(), Math.floor(Math.random() * 720))
    const respondedAt = Math.random() > 0.3 ? subHours(createdAt, -Math.floor(Math.random() * 24)) : undefined
    tickets.push({
      id: `ticket-${i + 1}`,
      subject: subjects[Math.floor(Math.random() * subjects.length)],
      message: `Szczegółowy opis problemu ${i + 1}. Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      priority: priorities[Math.floor(Math.random() * priorities.length)],
      category: categories[Math.floor(Math.random() * categories.length)],
      adminResponse: respondedAt ? `Odpowiedź administracyjna dla zgłoszenia ${i + 1}.` : undefined,
      createdAt: createdAt.toISOString(),
      respondedAt: respondedAt?.toISOString(),
      userId: `user-${Math.floor(Math.random() * 100)}`,
      userName: `Użytkownik ${i + 1}`,
      email: `user${i + 1}@example.com`,
    })
  }
  return tickets.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

const generateTicketStats = (tickets: SupportMessage[]) => {
  const open = tickets.filter((t) => t.status === "OTWARTE").length
  const inProgress = tickets.filter((t) => t.status === "W_TRAKCIE").length
  const waiting = tickets.filter((t) => t.status === "OCZEKUJE").length
  const closed = tickets.filter((t) => t.status === "ZAMKNIĘTE").length

  const critical = tickets.filter((t) => t.priority === "KRYTYCZNA").length
  const high = tickets.filter((t) => t.priority === "WYSOKA").length
  const medium = tickets.filter((t) => t.priority === "ŚREDNIA").length
  const low = tickets.filter((t) => t.priority === "NISKA").length

  const avgResponseTime = tickets
    .filter((t) => t.respondedAt)
    .reduce((sum, t) => {
      const responseTime = new Date(t.respondedAt!).getTime() - new Date(t.createdAt).getTime()
      return sum + responseTime
    }, 0) / (tickets.filter((t) => t.respondedAt).length || 1)

  const avgResponseHours = Math.floor(avgResponseTime / (1000 * 60 * 60))

  return {
    total: tickets.length,
    open,
    inProgress,
    waiting,
    closed,
    critical,
    high,
    medium,
    low,
    avgResponseHours,
    resolutionRate: tickets.length > 0 ? ((closed / tickets.length) * 100).toFixed(1) : "0",
  }
}

const generateTicketTrend = () => {
  const data = []
  for (let i = 29; i >= 0; i--) {
    data.push({
      date: format(subDays(new Date(), i), "MMM dd"),
      otwarte: Math.floor(Math.random() * 20) + 5,
      zamkniete: Math.floor(Math.random() * 25) + 10,
      w_trakcie: Math.floor(Math.random() * 15) + 3,
    })
  }
  return data
}

const generateCategoryData = (tickets: SupportMessage[]) => {
  const categoryCount: Record<string, number> = {}
  tickets.forEach((ticket) => {
    categoryCount[ticket.category] = (categoryCount[ticket.category] || 0) + 1
  })
  return Object.entries(categoryCount).map(([name, value]) => ({
    name,
    value,
  }))
}

export default function Support() {
  const { t } = useTranslation()
  const [messages, setMessages] = useState<SupportMessage[]>([])
  const [allTickets, setAllTickets] = useState<SupportMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [chatbotMessage, setChatbotMessage] = useState("")
  const [chatbotResponse, setChatbotResponse] = useState("")
  const [showAdminView, setShowAdminView] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("ALL")

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<MessageForm>({
    resolver: zodResolver(messageSchema),
  })

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await api.get("/support/messages")
        const fetchedMessages = response.data.messages || []
        setMessages(fetchedMessages)
        // Generate fake tickets for admin view
        const fakeTickets = generateFakeTickets()
        setAllTickets(fakeTickets)
      } catch (error: any) {
        if (error.response?.status === 401) {
          setMessages([])
        } else {
          console.error("Failed to fetch messages:", error)
        }
        // Fallback to fake data
        const fakeTickets = generateFakeTickets()
        setAllTickets(fakeTickets)
      } finally {
        setLoading(false)
      }
    }

    fetchMessages()
  }, [])

  const ticketStats = generateTicketStats(allTickets)
  const ticketTrend = generateTicketTrend()
  const categoryData = generateCategoryData(allTickets)

  const filteredTickets = allTickets.filter((ticket) => {
    const matchesSearch =
      ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.email?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = filterStatus === "ALL" || ticket.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const onSubmit = async (data: MessageForm) => {
    setSending(true)
    try {
      await api.post("/support/messages", data)
      reset()
      try {
        const response = await api.get("/support/messages")
        setMessages(response.data.messages || [])
      } catch {
        setMessages([])
      }
      alert("Wiadomość została wysłana")
    } catch (error: any) {
      console.error("Failed to send message:", error)
      if (error.response?.status === 401) {
        alert("Musisz się zalogować, aby wysłać wiadomość")
      } else {
        alert("Nie udało się wysłać wiadomości")
      }
    } finally {
      setSending(false)
    }
  }

  const handleChatbot = async () => {
    if (!chatbotMessage.trim()) return

    try {
      const response = await api.post("/support/chatbot", { message: chatbotMessage })
      setChatbotResponse(response.data.response)
    } catch (error) {
      console.error("Chatbot failed:", error)
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
    <div className="w-full px-6 py-12">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-extrabold text-foreground">{t("support.title")}</h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Skontaktuj się z nami lub użyj chatbota
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => setShowAdminView(!showAdminView)}
          className="flex items-center gap-2"
        >
          <BarChart3 className="h-4 w-4" />
          {showAdminView ? "Widok użytkownika" : "Panel administracyjny"}
        </Button>
      </div>

      {showAdminView ? (
        <div className="space-y-6">
          {/* Stats Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            <Card className="bg-gradient-to-br from-primary/10 to-primary/5">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <MessageSquare className="h-5 w-5 text-primary" />
                  <span className="text-xs text-muted-foreground">Total</span>
                </div>
                <div className="text-2xl font-extrabold text-foreground">{ticketStats.total}</div>
                <div className="text-xs text-muted-foreground mt-1">Zgłoszenia</div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-red-500/10 to-red-500/5">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <AlertCircle className="h-5 w-5 text-red-500" />
                  <span className="text-xs text-red-600">{ticketStats.critical}</span>
                </div>
                <div className="text-2xl font-extrabold text-foreground">{ticketStats.open}</div>
                <div className="text-xs text-muted-foreground mt-1">Otwarte</div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-yellow-500/10 to-yellow-500/5">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <Clock className="h-5 w-5 text-yellow-500" />
                  <span className="text-xs text-yellow-600">{ticketStats.high}</span>
                </div>
                <div className="text-2xl font-extrabold text-foreground">{ticketStats.inProgress}</div>
                <div className="text-xs text-muted-foreground mt-1">W trakcie</div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-500/10 to-blue-500/5">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <Clock className="h-5 w-5 text-blue-500" />
                  <span className="text-xs text-blue-600">{ticketStats.medium}</span>
                </div>
                <div className="text-2xl font-extrabold text-foreground">{ticketStats.waiting}</div>
                <div className="text-xs text-muted-foreground mt-1">Oczekuje</div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-500/10 to-green-500/5">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-xs text-green-600">+5.2%</span>
                </div>
                <div className="text-2xl font-extrabold text-foreground">{ticketStats.closed}</div>
                <div className="text-xs text-muted-foreground mt-1">Zamknięte</div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-500/10 to-purple-500/5">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <TrendingUp className="h-5 w-5 text-purple-500" />
                  <span className="text-xs text-purple-600">{ticketStats.resolutionRate}%</span>
                </div>
                <div className="text-2xl font-extrabold text-foreground">{ticketStats.resolutionRate}%</div>
                <div className="text-xs text-muted-foreground mt-1">Rozwiązane</div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-500/10 to-orange-500/5">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <Activity className="h-5 w-5 text-orange-500" />
                  <span className="text-xs text-orange-600">Avg</span>
                </div>
                <div className="text-2xl font-extrabold text-foreground">{ticketStats.avgResponseHours}h</div>
                <div className="text-xs text-muted-foreground mt-1">Czas odpowiedzi</div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-pink-500/10 to-pink-500/5">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <Users className="h-5 w-5 text-pink-500" />
                  <span className="text-xs text-pink-600">Active</span>
                </div>
                <div className="text-2xl font-extrabold text-foreground">
                  {ticketStats.open + ticketStats.inProgress}
                </div>
                <div className="text-xs text-muted-foreground mt-1">Aktywne</div>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Trend zgłoszeń (30 dni)</CardTitle>
                <CardDescription>Dzienna liczba otwartych i zamkniętych zgłoszeń</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={ticketTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="otwarte"
                      stackId="1"
                      stroke="#EF4444"
                      fill="#EF4444"
                      name="Otwarte"
                    />
                    <Area
                      type="monotone"
                      dataKey="zamkniete"
                      stackId="2"
                      stroke="#84C95F"
                      fill="#84C95F"
                      name="Zamknięte"
                    />
                    <Area
                      type="monotone"
                      dataKey="w_trakcie"
                      stackId="3"
                      stroke="#F59E0B"
                      fill="#F59E0B"
                      name="W trakcie"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Zgłoszenia według kategorii</CardTitle>
                <CardDescription>Rozkład zgłoszeń w różnych kategoriach</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={["#84C95F", "#D89C8A", "#9CA3AF", "#F59E0B", "#EF4444"][index % 5]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Tickets Table */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Wszystkie zgłoszenia</CardTitle>
                  <CardDescription>Zarządzaj zgłoszeniami wsparcia</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Szukaj..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 w-64"
                    />
                  </div>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="rounded-lg border-2 border-border px-3 py-2"
                  >
                    <option value="ALL">Wszystkie</option>
                    <option value="OTWARTE">Otwarte</option>
                    <option value="W_TRAKCIE">W trakcie</option>
                    <option value="OCZEKUJE">Oczekuje</option>
                    <option value="ZAMKNIĘTE">Zamknięte</option>
                  </select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold">ID</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">Temat</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">Kategoria</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">Priorytet</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">Status</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">Użytkownik</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">Data</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTickets.slice(0, 20).map((ticket) => (
                      <tr key={ticket.id} className="border-b-2 border-border hover:bg-muted/50">
                        <td className="px-4 py-3 text-sm">{ticket.id}</td>
                        <td className="px-4 py-3 text-sm font-medium">{ticket.subject}</td>
                        <td className="px-4 py-3 text-sm">{ticket.category}</td>
                        <td className="px-4 py-3">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              ticket.priority === "KRYTYCZNA"
                                ? "bg-red-500/20 text-red-600"
                                : ticket.priority === "WYSOKA"
                                ? "bg-orange-500/20 text-orange-600"
                                : ticket.priority === "ŚREDNIA"
                                ? "bg-yellow-500/20 text-yellow-600"
                                : "bg-blue-500/20 text-blue-600"
                            }`}
                          >
                            {ticket.priority}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              ticket.status === "ZAMKNIĘTE"
                                ? "bg-green-500/20 text-green-600"
                                : ticket.status === "W_TRAKCIE"
                                ? "bg-blue-500/20 text-blue-600"
                                : ticket.status === "OCZEKUJE"
                                ? "bg-yellow-500/20 text-yellow-600"
                                : "bg-red-500/20 text-red-600"
                            }`}
                          >
                            {ticket.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm">{ticket.email}</td>
                        <td className="px-4 py-3 text-sm text-muted-foreground">
                          {format(new Date(ticket.createdAt), "d MMM yyyy, HH:mm", { locale: pl })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <>

      <div className="grid gap-8 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t("support.newMessage")}</CardTitle>
            <CardDescription>Wyślij wiadomość do wsparcia</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="subject">{t("support.subject")}</Label>
                <Input id="subject" {...register("subject")} />
                {errors.subject && (
                  <p className="text-sm text-destructive">{errors.subject.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">{t("support.message")}</Label>
                <textarea
                  id="message"
                  {...register("message")}
                  className="flex min-h-[120px] w-full rounded-lg border-2 border-border bg-input px-4 py-2 text-base transition-calm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
                {errors.message && (
                  <p className="text-sm text-destructive">{errors.message.message}</p>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={sending}>
                {sending ? t("common.loading") : t("support.send")}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("support.chatbot")}</CardTitle>
            <CardDescription>Zadaj pytanie chatbotowi</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="chatbot">{t("support.typeMessage")}</Label>
                <Input
                  id="chatbot"
                  value={chatbotMessage}
                  onChange={(e) => setChatbotMessage(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleChatbot()}
                />
              </div>
              <Button onClick={handleChatbot} className="w-full">
                Wyślij
              </Button>
              {chatbotResponse && (
                <div className="p-4 bg-secondary/20 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-2">Odpowiedź:</p>
                  <p>{chatbotResponse}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>{t("support.messages")}</CardTitle>
          <CardDescription>Twoje wiadomości</CardDescription>
        </CardHeader>
        <CardContent>
          {messages.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>Brak wiadomości</p>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((msg) => (
                <div key={msg.id} className="p-4 border-2 border-border rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-semibold">{msg.subject}</p>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(msg.createdAt), "d MMMM yyyy, HH:mm", { locale: pl })}
                      </p>
                    </div>
                    <span className="px-3 py-1 rounded-full text-sm bg-secondary text-secondary-foreground">
                      {msg.status}
                    </span>
                  </div>
                  <p className="mb-2">{msg.message}</p>
                  {msg.adminResponse && (
                    <div className="mt-4 p-4 bg-primary/5 rounded-lg">
                      <p className="text-sm font-semibold mb-1">Odpowiedź:</p>
                      <p className="text-sm">{msg.adminResponse}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
        </>
      )}
    </div>
  )
}

