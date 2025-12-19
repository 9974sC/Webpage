import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import api from "@/services/api"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"
import { pl } from "date-fns/locale"
import PaymentModal from "@/components/PaymentModal"
import {
  DollarSign,
  Calendar,
  FileText,
  History,
  ArrowRight,
  Download,
  CheckCircle,
  Clock,
  AlertCircle,
  CreditCard,
} from "lucide-react"

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

interface LoanOffer {
  id: string
  amount: number
  interestRate: number
  durationMonths: number
  monthlyPayment: number
  totalAmount: number
  createdAt: string
  questionnaireData?: any
}

interface LegalDocument {
  id: string
  name: string
  type: string
  url: string
  createdAt: string
}

// Generate fake data
const generateFakePayments = (): Payment[] => {
  const payments: Payment[] = []
  const today = new Date()
  
  // Upcoming payments
  for (let i = 0; i < 3; i++) {
    const dueDate = new Date(today)
    dueDate.setDate(dueDate.getDate() + (i + 1) * 7)
    payments.push({
      id: `upcoming-${i + 1}`,
      amount: 1025.50 + i * 50,
      dueDate: dueDate.toISOString(),
      status: i === 0 ? "OVERDUE" : "PENDING",
      loan: {
        id: `loan-${i + 1}`,
        amount: 50000,
      },
    })
  }
  
  return payments
}

const generateFakeHistory = (): Payment[] => {
  const history: Payment[] = []
  const today = new Date()
  
  for (let i = 1; i <= 12; i++) {
    const paidDate = new Date(today)
    paidDate.setMonth(paidDate.getMonth() - i)
    history.push({
      id: `history-${i}`,
      amount: 1025.50,
      dueDate: paidDate.toISOString(),
      status: "PAID",
      paidAt: paidDate.toISOString(),
      transactionId: `TXN-${String(i).padStart(6, "0")}`,
      loan: {
        id: "loan-1",
        amount: 50000,
      },
    })
  }
  
  return history
}

const generateFakeOffers = (): LoanOffer[] => {
  const offers: LoanOffer[] = []
  const today = new Date()
  
  for (let i = 0; i < 3; i++) {
    const amount = 50000 + i * 10000
    const rate = 6.5 + i * 0.5
    const duration = 60 + i * 12
    const monthlyRate = rate / 100 / 12
    const monthlyPayment = (amount * monthlyRate * Math.pow(1 + monthlyRate, duration)) /
      (Math.pow(1 + monthlyRate, duration) - 1)
    
    offers.push({
      id: `offer-${i + 1}`,
      amount,
      interestRate: rate,
      durationMonths: duration,
      monthlyPayment: Math.round(monthlyPayment * 100) / 100,
      totalAmount: Math.round(monthlyPayment * duration * 100) / 100,
      createdAt: new Date(today.getTime() - i * 86400000).toISOString(),
    })
  }
  
  return offers
}

const generateFakeDocuments = (): LegalDocument[] => {
  return [
    {
      id: "doc-1",
      name: "Umowa kredytowa",
      type: "PDF",
      url: "#",
      createdAt: new Date().toISOString(),
    },
    {
      id: "doc-2",
      name: "Regulamin",
      type: "PDF",
      url: "#",
      createdAt: new Date().toISOString(),
    },
    {
      id: "doc-3",
      name: "Polityka prywatności",
      type: "PDF",
      url: "#",
      createdAt: new Date().toISOString(),
    },
    {
      id: "doc-4",
      name: "Warunki kredytu",
      type: "PDF",
      url: "#",
      createdAt: new Date().toISOString(),
    },
  ]
}

export default function Payments() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [upcoming, setUpcoming] = useState<Payment[]>([])
  const [history, setHistory] = useState<Payment[]>([])
  const [offers, setOffers] = useState<LoanOffer[]>([])
  const [documents, setDocuments] = useState<LegalDocument[]>([])
  const [loading, setLoading] = useState(true)
  const [totalBorrowed, setTotalBorrowed] = useState(0)
  const [nextPayment, setNextPayment] = useState<Payment | null>(null)
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [upcomingRes, historyRes] = await Promise.all([
          api.get("/payments/upcoming").catch(() => ({ data: { payments: [] } })),
          api.get("/payments/history").catch(() => ({ data: { payments: [] } })),
        ])
        
        const fetchedUpcoming = upcomingRes.data.payments || []
        const fetchedHistory = historyRes.data.payments || []
        
        // Use fake data if API returns empty
        setUpcoming(fetchedUpcoming.length > 0 ? fetchedUpcoming : generateFakePayments())
        setHistory(fetchedHistory.length > 0 ? fetchedHistory : generateFakeHistory())
        setOffers(generateFakeOffers())
        setDocuments(generateFakeDocuments())
        
        // Calculate total borrowed
        const total = (fetchedUpcoming.length > 0 ? fetchedUpcoming : generateFakePayments())
          .reduce((sum, p) => sum + (p.loan?.amount || 0), 0)
        setTotalBorrowed(total)
        
        // Get next payment
        const next = (fetchedUpcoming.length > 0 ? fetchedUpcoming : generateFakePayments())
          .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())[0]
        setNextPayment(next || null)
      } catch (error) {
        console.error("Failed to fetch payments:", error)
        setUpcoming(generateFakePayments())
        setHistory(generateFakeHistory())
        setOffers(generateFakeOffers())
        setDocuments(generateFakeDocuments())
        setTotalBorrowed(150000)
        setNextPayment(generateFakePayments()[0])
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleReturnToOffer = (offer: LoanOffer) => {
    // Navigate to calculator with offer data
    navigate("/", { state: { offer } })
  }

  const handleMakePayment = (payment: Payment) => {
    setSelectedPayment(payment)
    setIsPaymentModalOpen(true)
  }

  const handleClosePaymentModal = () => {
    setIsPaymentModalOpen(false)
    setSelectedPayment(null)
  }

  const handlePaymentMethodSelect = (method: string) => {
    if (!selectedPayment) return
    
    // Here you would typically call an API to process the payment
    console.log(`Processing payment ${selectedPayment.id} with method ${method}`)
    
    // For now, just close the modal
    // In a real implementation, you'd show a loading state and handle the payment processing
    handleClosePaymentModal()
  }

  if (loading) {
    return (
      <div className="container mx-auto px-6 py-12">
        <div className="text-center">{t("common.loading")}</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-6 py-12 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold text-foreground">{t("payments.title")}</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Zarządzaj swoimi płatnościami i dokumentami
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="border-2">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <DollarSign className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground mb-1">Całkowita kwota pożyczona</p>
            <p className="text-3xl font-extrabold text-foreground">
              {totalBorrowed.toLocaleString("pl-PL", {
                style: "currency",
                currency: "PLN",
              })}
            </p>
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <Calendar className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground mb-1">Następna płatność</p>
            {nextPayment ? (
              <>
                <p className="text-3xl font-extrabold text-foreground">
                  {nextPayment.amount.toLocaleString("pl-PL", {
                    style: "currency",
                    currency: "PLN",
                  })}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {format(new Date(nextPayment.dueDate), "d MMMM yyyy", { locale: pl })}
                </p>
              </>
            ) : (
              <p className="text-lg text-muted-foreground">Brak nadchodzących płatności</p>
            )}
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <History className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground mb-1">Opłacone płatności</p>
            <p className="text-3xl font-extrabold text-foreground">{history.length}</p>
            <p className="text-sm text-muted-foreground mt-1">z {history.length + upcoming.length} łącznie</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Payment History */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                Historia płatności
              </CardTitle>
              <CardDescription>Wszystkie opłacone płatności</CardDescription>
            </CardHeader>
            <CardContent>
              {history.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>Brak historii płatności</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {history.slice(0, 10).map((payment) => (
                    <div
                      key={payment.id}
                      className="p-4 border-2 border-border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <CheckCircle className="h-5 w-5 text-green-600" />
                          <div>
                            <p className="text-lg font-semibold text-foreground">
                              {payment.amount.toLocaleString("pl-PL", {
                                style: "currency",
                                currency: "PLN",
                              })}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {payment.paidAt &&
                                format(new Date(payment.paidAt), "d MMMM yyyy, HH:mm", { locale: pl })}
                            </p>
                            {payment.transactionId && (
                              <p className="text-xs text-muted-foreground mt-1">
                                ID transakcji: {payment.transactionId}
                              </p>
                            )}
                          </div>
                        </div>
                        <span className="px-3 py-1 rounded-full text-sm bg-green-500/20 text-green-600 font-semibold">
                          Opłacone
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Upcoming Payments */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Nadchodzące płatności
              </CardTitle>
              <CardDescription>Płatności do opłacenia</CardDescription>
            </CardHeader>
            <CardContent>
              {upcoming.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>Brak nadchodzących płatności</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {upcoming.map((payment) => (
                    <div
                      key={payment.id}
                      className={`p-4 border-2 rounded-lg ${
                        payment.status === "OVERDUE"
                          ? "border-red-500/50 bg-red-500/5"
                          : "border-border hover:bg-muted/50"
                      } transition-colors`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          {payment.status === "OVERDUE" ? (
                            <AlertCircle className="h-5 w-5 text-red-600" />
                          ) : (
                            <Clock className="h-5 w-5 text-yellow-600" />
                          )}
                          <div>
                            <p className="text-lg font-semibold text-foreground">
                              {payment.amount.toLocaleString("pl-PL", {
                                style: "currency",
                                currency: "PLN",
                              })}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Termin: {format(new Date(payment.dueDate), "d MMMM yyyy", { locale: pl })}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-semibold ${
                              payment.status === "OVERDUE"
                                ? "bg-red-500/20 text-red-600"
                                : "bg-yellow-500/20 text-yellow-600"
                            }`}
                          >
                            {payment.status === "OVERDUE" ? "Zaległa" : "Oczekuje"}
                          </span>
                          <Button
                            onClick={() => handleMakePayment(payment)}
                            size="sm"
                            className="bg-primary hover:bg-primary/90"
                          >
                            <CreditCard className="h-4 w-4 mr-2" />
                            Zapłać teraz
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Loan Offers */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Twoje oferty
              </CardTitle>
              <CardDescription>Wróć do wypełnionych kwestionariuszy</CardDescription>
            </CardHeader>
            <CardContent>
              {offers.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>Brak zapisanych ofert</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {offers.map((offer) => (
                    <div
                      key={offer.id}
                      className="p-4 border-2 border-border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <p className="font-semibold text-foreground">
                            {offer.amount.toLocaleString("pl-PL", {
                              style: "currency",
                              currency: "PLN",
                            })}
                          </p>
                          <span className="text-xs text-muted-foreground">
                            {offer.interestRate.toFixed(2)}%
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Rata: {offer.monthlyPayment.toLocaleString("pl-PL", {
                            style: "currency",
                            currency: "PLN",
                          })} / {offer.durationMonths} miesięcy
                        </p>
                        <Button
                          onClick={() => handleReturnToOffer(offer)}
                          variant="outline"
                          size="sm"
                          className="w-full mt-2"
                        >
                          Wróć do oferty
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Legal Documents */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Dokumenty prawne
              </CardTitle>
              <CardDescription>Pobierz dokumenty kredytowe</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between p-3 border-2 border-border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium text-foreground">{doc.name}</p>
                        <p className="text-xs text-muted-foreground">{doc.type}</p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => window.open(doc.url, "_blank")}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Payment Modal */}
      {selectedPayment && (
        <PaymentModal
          isOpen={isPaymentModalOpen}
          onClose={handleClosePaymentModal}
          amount={selectedPayment.amount}
          referenceNumber={`REF-${selectedPayment.id.slice(-6).toUpperCase()}`}
          onPaymentMethodSelect={handlePaymentMethodSelect}
        />
      )}
    </div>
  )
}
