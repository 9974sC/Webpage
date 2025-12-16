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
import { format } from "date-fns"
import { pl } from "date-fns/locale"

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
  adminResponse?: string
  createdAt: string
  respondedAt?: string
}

export default function Support() {
  const { t } = useTranslation()
  const [messages, setMessages] = useState<SupportMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [chatbotMessage, setChatbotMessage] = useState("")
  const [chatbotResponse, setChatbotResponse] = useState("")

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
        setMessages(response.data.messages || [])
      } catch (error) {
        console.error("Failed to fetch messages:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchMessages()
  }, [])

  const onSubmit = async (data: MessageForm) => {
    setSending(true)
    try {
      await api.post("/support/messages", data)
      reset()
      const response = await api.get("/support/messages")
      setMessages(response.data.messages || [])
      alert("Wiadomość została wysłana")
    } catch (error) {
      console.error("Failed to send message:", error)
      alert("Nie udało się wysłać wiadomości")
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
    <div className="container mx-auto px-6 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-foreground">{t("support.title")}</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Skontaktuj się z nami lub użyj chatbota
        </p>
      </div>

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
    </div>
  )
}

