import { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check, Clock, FileText, Shield, AlertCircle, History, Lock, ArrowRight, Eye, X } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import Questionnaire from "@/components/Questionnaire"
import LoanCalculator from "@/components/LoanCalculator"
import LoanApplicationForm from "@/components/LoanApplicationForm"
import api from "@/services/api"

interface QuestionnaireData {
  firstName: string
  lastName: string
  age: string
  maritalStatus: string
  city: string
  monthlyIncome: number
  monthlyExpenses: number
  employmentType: string
  employmentDuration: string
  currentDebts: number
  loanAmount: number
  loanPurpose: string
  preferredDuration: string
}

interface Quote {
  id: string
  questionnaireData: QuestionnaireData
  loanAmount: number
  interestRate: number
  monthlyPayment: number
  totalAmount: number
  expiresAt: string
  createdAt: string
  isExpired: boolean
}

export default function Products() {
  const { t } = useTranslation()
  const [questionnaireComplete, setQuestionnaireComplete] = useState(false)
  const [questionnaireData, setQuestionnaireData] = useState<QuestionnaireData | null>(null)
  const [quotes, setQuotes] = useState<Quote[]>([])
  const [loadingQuotes, setLoadingQuotes] = useState(false)
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null)
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [showApplicationForm, setShowApplicationForm] = useState(false)
  const [applicationComplete, setApplicationComplete] = useState(false)
  const [currentCalculation, setCurrentCalculation] = useState<{
    monthlyPayment: number
    totalAmount: number
    totalInterest: number
  } | null>(null)

  const fetchQuotes = async () => {
    try {
      setLoadingQuotes(true)
      const response = await api.get("/loans/quotes")
      setQuotes(response.data.quotes || [])
    } catch (error: any) {
      // Silently fail if user is not authenticated - quotes are optional
      if (error.response?.status !== 401) {
        console.error("Failed to fetch quotes:", error)
      }
    } finally {
      setLoadingQuotes(false)
    }
  }

  useEffect(() => {
    fetchQuotes()
  }, [])

  const handleQuestionnaireComplete = async (data: QuestionnaireData) => {
    setQuestionnaireData(data)
    setQuestionnaireComplete(true)
    
    // Calculate the offer using LoanCalculator logic
    const calculateInterestRate = (data: QuestionnaireData): number => {
      let baseRate = 5.9
      const incomeRatio = data.monthlyIncome / 10000
      if (incomeRatio < 0.5) baseRate += 2.0
      else if (incomeRatio < 1) baseRate += 1.0
      else if (incomeRatio > 2) baseRate -= 0.5
      
      if (data.employmentType === "umowa-o-prace") baseRate -= 0.5
      else if (data.employmentType === "dzialalnosc-gospodarcza") baseRate += 0.5
      else if (data.employmentType === "umowa-zlecenie" || data.employmentType === "umowa-o-dzielo") baseRate += 1.0
      
      if (data.employmentDuration === "60+") baseRate -= 0.3
      else if (data.employmentDuration === "0-6") baseRate += 1.5
      
      const debtRatio = data.currentDebts / (data.monthlyIncome * 12)
      if (debtRatio > 0.5) baseRate += 1.5
      else if (debtRatio > 0.3) baseRate += 0.8
      
      const availableIncome = data.monthlyIncome - data.monthlyExpenses
      const loanToIncomeRatio = (data.loanAmount / (availableIncome * 12)) * 100
      if (loanToIncomeRatio > 80) baseRate += 1.0
      else if (loanToIncomeRatio < 30) baseRate -= 0.5
      
      return Math.max(4.5, Math.min(15.0, baseRate))
    }

    const calculateLoanPayment = (
      amount: number,
      interestRate: number,
      durationMonths: number
    ): { monthlyPayment: number; totalAmount: number } => {
      const monthlyRate = interestRate / 100 / 12
      const monthlyPayment =
        (amount * monthlyRate * Math.pow(1 + monthlyRate, durationMonths)) /
        (Math.pow(1 + monthlyRate, durationMonths) - 1)
      const totalAmount = monthlyPayment * durationMonths

      return {
        monthlyPayment: Math.round(monthlyPayment * 100) / 100,
        totalAmount: Math.round(totalAmount * 100) / 100,
      }
    }

    const interestRate = calculateInterestRate(data)
    const preferredMap: Record<string, number> = {
      "12-24 miesiące": 24,
      "24-36 miesięcy": 36,
      "36-60 miesięcy": 60,
      "60-120 miesięcy": 96,
    }
    const durationMonths = preferredMap[data.preferredDuration] || 60
    const calculation = calculateLoanPayment(data.loanAmount, interestRate, durationMonths)

    // Save quote to backend (only if authenticated)
    try {
      await api.post("/loans/quotes", {
        questionnaireData: data,
        loanAmount: data.loanAmount,
        interestRate,
        monthlyPayment: calculation.monthlyPayment,
        totalAmount: calculation.totalAmount,
      })
      await fetchQuotes()
    } catch (error: any) {
      // Silently fail if user is not authenticated - quotes are optional
      if (error.response?.status !== 401) {
        console.error("Failed to save quote:", error)
      }
    }

    setTimeout(() => {
      document.getElementById("calculator-section")?.scrollIntoView({ behavior: "smooth" })
    }, 300)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pl-PL", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const formatEmploymentType = (type: string): string => {
    const map: Record<string, string> = {
      "umowa-o-prace": "Umowa o pracę",
      "umowa-zlecenie": "Umowa zlecenie",
      "umowa-o-dzielo": "Umowa o dzieło",
      "dzialalnosc-gospodarcza": "Działalność gospodarcza",
      "emerytura": "Emerytura",
      "renta": "Renta",
      "inne": "Inne",
    }
    return map[type] || type
  }

  const formatLoanPurpose = (purpose: string): string => {
    const map: Record<string, string> = {
      "konsolidacja": "Konsolidacja zobowiązań",
      "remont": "Remont mieszkania",
      "samochod": "Zakup samochodu",
      "wakacje": "Wakacje",
      "sprzet": "Zakup sprzętu",
      "edukacja": "Edukacja",
      "zdrowie": "Zdrowie",
      "inne": "Inne",
    }
    return map[purpose] || purpose
  }

  const formatEmploymentDuration = (duration: string): string => {
    const map: Record<string, string> = {
      "0-6": "Mniej niż 6 miesięcy",
      "6-12": "6-12 miesięcy",
      "12-24": "12-24 miesiące",
      "24-60": "2-5 lat",
      "60+": "Powyżej 5 lat",
    }
    return map[duration] || duration
  }

  const handleViewQuote = (quote: Quote) => {
    setSelectedQuote(quote)
    setTermsAccepted(false)
    setShowApplicationForm(false)
    setApplicationComplete(false)
  }

  const handleProceedToApplication = () => {
    if (selectedQuote && termsAccepted) {
      setShowApplicationForm(true)
    }
  }

  const handleApplicationComplete = (referenceNumber: string) => {
    setApplicationComplete(true)
    setShowApplicationForm(false)
  }

  const handleCloseQuoteView = () => {
    setSelectedQuote(null)
    setTermsAccepted(false)
    setShowApplicationForm(false)
    setApplicationComplete(false)
  }

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="mb-12 max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="mb-4 text-balance text-4xl font-extrabold text-foreground md:text-5xl lg:text-6xl">
            Spersonalizowany kalkulator kredytowy
          </h1>
          <p className="text-balance text-lg text-muted-foreground md:text-xl mb-8">
            Wypełnij krótki formularz, a my przygotujemy dla Ciebie najlepszą ofertę kredytową
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card className="border-2">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-foreground">Czas trwania</h3>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                Wypełnienie formularza zajmie Ci około <strong className="text-foreground">3-5 minut</strong>. 
                Po przesłaniu danych, nasz system analizuje Twoją sytuację finansową i przygotowuje spersonalizowane oferty. 
                Wyniki otrzymasz zwykle w ciągu <strong className="text-foreground">kilku godzin</strong> na podany adres e-mail.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-foreground">Potrzebne dokumenty</h3>
              </div>
              <p className="text-muted-foreground leading-relaxed mb-3">
                Do weryfikacji wniosku kredytowego będziesz potrzebować:
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <span>Dokument tożsamości (dowód osobisty lub paszport)</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <span>Zaświadczenie o dochodach (zaświadczenie z pracy, PIT, umowa o pracę)</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <span>Dokument potwierdzający adres (rachunek za media, umowa najmu)</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      {!questionnaireComplete ? (
        <div id="questionnaire-section" className="transition-all duration-500">
          <Questionnaire 
            onComplete={handleQuestionnaireComplete}
            initialData={questionnaireData || undefined}
          />
        </div>
      ) : (
        <div
          id="calculator-section"
          className="transition-all duration-1000 translate-y-0 opacity-100"
        >
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-balance text-4xl font-extrabold text-foreground md:text-5xl lg:text-6xl">
              Kalkulator kredytowy
            </h2>
            <p className="text-balance text-lg text-muted-foreground md:text-xl">
              Na podstawie Twoich danych, oto spersonalizowany kalkulator
            </p>
          </div>
          <LoanCalculator 
            questionnaireData={questionnaireData || undefined}
            onCalculationChange={setCurrentCalculation}
            onBack={() => {
              setQuestionnaireComplete(false)
              setTimeout(() => {
                document.getElementById("questionnaire-section")?.scrollIntoView({ behavior: "smooth" })
              }, 100)
            }}
            onProceedToApplication={() => {
              if (questionnaireData) {
                setShowApplicationForm(true)
                setTimeout(() => {
                  document.getElementById("application-section")?.scrollIntoView({ behavior: "smooth" })
                }, 300)
              }
            }}
          />
        </div>
      )}

      {/* Application Form Section */}
      {showApplicationForm && questionnaireData && !selectedQuote && (
        <div id="application-section" className="mt-16 max-w-6xl mx-auto">
          <LoanApplicationForm
            questionnaireData={questionnaireData}
            onComplete={handleApplicationComplete}
          />
        </div>
      )}

      {/* Application Form for Selected Quote */}
      {selectedQuote && showApplicationForm && (
        <div className="mt-16 max-w-6xl mx-auto">
          <LoanApplicationForm
            questionnaireData={selectedQuote.questionnaireData}
            onComplete={handleApplicationComplete}
          />
        </div>
      )}

      {/* Quote Detail View */}
      {selectedQuote && !showApplicationForm && (
        <div className="mt-16 max-w-6xl mx-auto">
          <Card className="border-2">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2 text-2xl">
                    <FileText className="h-6 w-6" />
                    Szczegóły oferty z {formatDate(selectedQuote.createdAt)}
                  </CardTitle>
                  <CardDescription>
                    {selectedQuote.isExpired ? (
                      <span className="text-destructive">Oferta wygasła {formatDate(selectedQuote.expiresAt)}</span>
                    ) : (
                      <span className="text-primary">Ważna do {formatDate(selectedQuote.expiresAt)}</span>
                    )}
                  </CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCloseQuoteView}
                  className="flex items-center gap-2"
                >
                  <X className="h-4 w-4" />
                  Zamknij
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Offer Details */}
              <div>
                <h3 className="text-lg font-bold text-foreground mb-4">Szczegóły oferty</h3>
                <div className="grid md:grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Kwota kredytu:</span>
                    <span className="font-semibold text-foreground">
                      {selectedQuote.loanAmount.toLocaleString("pl-PL")} PLN
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Oprocentowanie:</span>
                    <span className="font-semibold text-foreground">{selectedQuote.interestRate.toFixed(2)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Miesięczna rata:</span>
                    <span className="font-semibold text-foreground">
                      {selectedQuote.monthlyPayment.toLocaleString("pl-PL", {
                        style: "currency",
                        currency: "PLN",
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Całkowita kwota:</span>
                    <span className="font-semibold text-foreground">
                      {selectedQuote.totalAmount.toLocaleString("pl-PL", {
                        style: "currency",
                        currency: "PLN",
                      })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Questionnaire Data - Read Only */}
              <div>
                <h3 className="text-lg font-bold text-foreground mb-4">Dane z kwestionariusza</h3>
                <div className="space-y-4">
                  {/* Step 1: Personal Information */}
                  <div className="p-4 bg-muted/30 rounded-lg border-2">
                    <h4 className="font-semibold text-foreground mb-3">Dane osobowe</h4>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-muted-foreground text-sm">Imię</Label>
                        <p className="font-semibold text-foreground">{selectedQuote.questionnaireData.firstName}</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground text-sm">Nazwisko</Label>
                        <p className="font-semibold text-foreground">{selectedQuote.questionnaireData.lastName}</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground text-sm">Wiek</Label>
                        <p className="font-semibold text-foreground">{selectedQuote.questionnaireData.age}</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground text-sm">Status cywilny</Label>
                        <p className="font-semibold text-foreground">{selectedQuote.questionnaireData.maritalStatus}</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground text-sm">Miasto zamieszkania</Label>
                        <p className="font-semibold text-foreground">{selectedQuote.questionnaireData.city}</p>
                      </div>
                    </div>
                  </div>

                  {/* Step 2: Financial Information */}
                  <div className="p-4 bg-muted/30 rounded-lg border-2">
                    <h4 className="font-semibold text-foreground mb-3">Sytuacja finansowa</h4>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-muted-foreground text-sm">Miesięczny dochód netto</Label>
                        <p className="font-semibold text-foreground">
                          {selectedQuote.questionnaireData.monthlyIncome.toLocaleString("pl-PL")} PLN
                        </p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground text-sm">Miesięczne wydatki</Label>
                        <p className="font-semibold text-foreground">
                          {selectedQuote.questionnaireData.monthlyExpenses.toLocaleString("pl-PL")} PLN
                        </p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground text-sm">Typ zatrudnienia</Label>
                        <p className="font-semibold text-foreground">
                          {formatEmploymentType(selectedQuote.questionnaireData.employmentType)}
                        </p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground text-sm">Okres zatrudnienia</Label>
                        <p className="font-semibold text-foreground">
                          {formatEmploymentDuration(selectedQuote.questionnaireData.employmentDuration)}
                        </p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground text-sm">Obecne zobowiązania</Label>
                        <p className="font-semibold text-foreground">
                          {selectedQuote.questionnaireData.currentDebts.toLocaleString("pl-PL")} PLN
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Step 3: Loan Details */}
                  <div className="p-4 bg-muted/30 rounded-lg border-2">
                    <h4 className="font-semibold text-foreground mb-3">Szczegóły kredytu</h4>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-muted-foreground text-sm">Kwota kredytu</Label>
                        <p className="font-semibold text-foreground">
                          {selectedQuote.questionnaireData.loanAmount.toLocaleString("pl-PL")} PLN
                        </p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground text-sm">Cel kredytu</Label>
                        <p className="font-semibold text-foreground">
                          {formatLoanPurpose(selectedQuote.questionnaireData.loanPurpose)}
                        </p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground text-sm">Preferowany okres spłaty</Label>
                        <p className="font-semibold text-foreground">{selectedQuote.questionnaireData.preferredDuration}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Terms and Proceed */}
              {!selectedQuote.isExpired && (
                <div className="space-y-4 pt-4 border-t-2">
                  <div className="flex items-start gap-3 p-4 bg-muted/30 rounded-lg">
                    <Checkbox
                      id="terms-consent-quote"
                      checked={termsAccepted}
                      onCheckedChange={(checked) => setTermsAccepted(!!checked)}
                      className="mt-1"
                    />
                    <Label htmlFor="terms-consent-quote" className="text-sm leading-relaxed cursor-pointer">
                      <strong className="text-foreground">Akceptuję regulamin i warunki kredytowe</strong>. 
                      Oświadczam, że podane przeze mnie informacje są prawdziwe i zgodne ze stanem faktycznym. 
                      Rozumiem, że złożenie nieprawdziwych danych może skutkować odmową udzielenia kredytu 
                      lub rozwiązaniem umowy. Zobowiązuję się do spłaty kredytu zgodnie z warunkami umowy.
                    </Label>
                  </div>
                  <Button
                    onClick={handleProceedToApplication}
                    disabled={!termsAccepted}
                    className="w-full"
                    size="lg"
                  >
                    Przejdź do wniosku kredytowego
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              )}

              {selectedQuote.isExpired && (
                <div className="mt-4 p-4 bg-destructive/5 border border-destructive/20 rounded-lg">
                  <p className="text-sm text-destructive">
                    <strong>Uwaga:</strong> Ta oferta wygasła i nie może być edytowana. Aby otrzymać nową ofertę, wypełnij formularz ponownie.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}


      {/* Application Complete */}
      {applicationComplete && (
        <div className="mt-16 max-w-6xl mx-auto">
          <Card className="border-2">
            <CardContent className="p-12">
              <div className="flex flex-col items-center justify-center space-y-6 text-center">
                <Check className="h-16 w-16 text-green-600 dark:text-green-400" />
                <div>
                  <h3 className="text-2xl font-bold text-foreground mb-2">
                    Wniosek został złożony pomyślnie!
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Twoja aplikacja została przyjęta. Skontaktujemy się z Tobą w najbliższym czasie.
                  </p>
                </div>
                <Button onClick={handleCloseQuoteView} size="lg">
                  Powrót do ofert
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Quote History */}
      {!selectedQuote && (
        <div className="mt-16 max-w-6xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <History className="h-6 w-6 text-primary" />
              <h2 className="text-3xl font-extrabold text-foreground">Historia ofert</h2>
            </div>
            <p className="text-muted-foreground">
              Twoje poprzednie oferty kredytowe. Oferty wygasają po 7 dniach i nie mogą być edytowane.
            </p>
          </div>

          {loadingQuotes ? (
            <div className="text-center py-12 text-muted-foreground">
              <p>Ładowanie historii ofert...</p>
            </div>
          ) : quotes.length === 0 ? (
            <Card className="border-2">
              <CardContent className="p-12 text-center">
                <p className="text-muted-foreground">Brak zapisanych ofert. Wypełnij formularz powyżej, aby utworzyć nową ofertę.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {quotes.map((quote) => {
                const isExpired = quote.isExpired
                return (
                  <Card key={quote.id} className={`border-2 ${isExpired ? "opacity-75 bg-muted/20" : ""}`}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            {isExpired && <Lock className="h-5 w-5 text-muted-foreground" />}
                            Oferta z {formatDate(quote.createdAt)}
                          </CardTitle>
                          <CardDescription>
                            {isExpired ? (
                              <span className="text-destructive">Oferta wygasła {formatDate(quote.expiresAt)}</span>
                            ) : (
                              <span className="text-primary">Ważna do {formatDate(quote.expiresAt)}</span>
                            )}
                          </CardDescription>
                        </div>
                        {isExpired && (
                          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-destructive/10 text-destructive">
                            Wygasła
                          </span>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-bold text-foreground mb-3">Szczegóły oferty</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Kwota kredytu:</span>
                              <span className="font-semibold text-foreground">
                                {quote.loanAmount.toLocaleString("pl-PL")} PLN
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Oprocentowanie:</span>
                              <span className="font-semibold text-foreground">{quote.interestRate.toFixed(2)}%</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Miesięczna rata:</span>
                              <span className="font-semibold text-foreground">
                                {quote.monthlyPayment.toLocaleString("pl-PL", {
                                  style: "currency",
                                  currency: "PLN",
                                })}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Całkowita kwota:</span>
                              <span className="font-semibold text-foreground">
                                {quote.totalAmount.toLocaleString("pl-PL", {
                                  style: "currency",
                                  currency: "PLN",
                                })}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-bold text-foreground mb-3">Dane z formularza</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Imię i nazwisko:</span>
                              <span className="font-semibold text-foreground">
                                {quote.questionnaireData.firstName} {quote.questionnaireData.lastName}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Wiek:</span>
                              <span className="font-semibold text-foreground">{quote.questionnaireData.age}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Status cywilny:</span>
                              <span className="font-semibold text-foreground">{quote.questionnaireData.maritalStatus}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Miasto:</span>
                              <span className="font-semibold text-foreground">{quote.questionnaireData.city}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Dochód miesięczny:</span>
                              <span className="font-semibold text-foreground">
                                {quote.questionnaireData.monthlyIncome.toLocaleString("pl-PL")} PLN
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4">
                        <Button
                          onClick={() => handleViewQuote(quote)}
                          variant="outline"
                          className="w-full sm:w-auto"
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          Zobacz szczegóły kwestionariusza
                        </Button>
                      </div>
                      {isExpired && (
                        <div className="mt-4 p-4 bg-destructive/5 border border-destructive/20 rounded-lg">
                          <p className="text-sm text-destructive">
                            <strong>Uwaga:</strong> Ta oferta wygasła i nie może być edytowana. Aby otrzymać nową ofertę, wypełnij formularz ponownie.
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
