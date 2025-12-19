import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FileText, ArrowRight, Info, CheckCircle, Loader2, Calculator, Shield, Clock, AlertCircle } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"

interface QuestionnaireData {
  // Personal questions (Step 1)
  firstName: string
  lastName: string
  age: string
  maritalStatus: string
  city: string
  
  // Financial questions (Step 2)
  monthlyIncome: number
  monthlyExpenses: number
  employmentType: string
  employmentDuration: string
  currentDebts: number
  
  // Technical questions (Step 3)
  loanAmount: number
  loanPurpose: string
  preferredDuration: string
}

interface QuestionnaireProps {
  onComplete: (data: QuestionnaireData) => void
  onProceed?: (data: QuestionnaireData) => void
  initialData?: QuestionnaireData
}

const helpfulHints = {
  step1: {
    title: "Dlaczego potrzebujemy tych informacji?",
    content: "Podstawowe dane osobowe pomagają nam dopasować ofertę do Twojej sytuacji. Wszystkie informacje są bezpiecznie przechowywane i chronione zgodnie z RODO.",
    tips: [
      "Imię i nazwisko są wymagane do weryfikacji tożsamości",
      "Wiek pomaga określić odpowiedni okres kredytowania",
      "Status cywilny może wpływać na zdolność kredytową",
      "Miasto pomaga znaleźć najbliższy oddział banku partnerskiego"
    ]
  },
  step2: {
    title: "Jak obliczamy zdolność kredytową?",
    content: "Na podstawie Twoich dochodów, wydatków i obecnych zobowiązań obliczamy, ile możesz bezpiecznie pożyczyć bez obciążania budżetu.",
    tips: [
      "Dochód netto to kwota, którą otrzymujesz na konto po odliczeniu podatków",
      "Wydatki powinny uwzględniać wszystkie regularne opłaty (czynsz, rachunki, ubezpieczenia)",
      "Obecne zobowiązania to wszystkie aktywne kredyty i pożyczki",
      "Zalecamy, aby rata kredytu nie przekraczała 30-40% dochodu netto"
    ]
  },
  step3: {
    title: "Dopasowanie oferty do Twoich potrzeb",
    content: "Na podstawie wszystkich zebranych informacji zaproponujemy najlepsze warunki kredytowe i różne opcje spłaty.",
    tips: [
      "Kwota kredytu powinna odpowiadać Twoim rzeczywistym potrzebom",
      "Cel kredytu może wpływać na dostępne oprocentowanie",
      "Dłuższy okres spłaty oznacza niższe raty, ale wyższy całkowity koszt",
      "Krótszy okres spłaty to wyższe raty, ale mniej odsetek w sumie"
    ]
  }
}

export default function Questionnaire({ onComplete, onProceed, initialData }: QuestionnaireProps) {
  const [started, setStarted] = useState(!!initialData)
  const [step, setStep] = useState(initialData ? 3 : 1)
  const [loading, setLoading] = useState(false)
  const [completed, setCompleted] = useState(false)
  const [gdprConsent, setGdprConsent] = useState(!!initialData)
  const [data, setData] = useState<QuestionnaireData>(initialData || {
    firstName: "",
    lastName: "",
    age: "",
    maritalStatus: "",
    city: "",
    monthlyIncome: 0,
    monthlyExpenses: 0,
    employmentType: "",
    employmentDuration: "",
    currentDebts: 0,
    loanAmount: 0,
    loanPurpose: "",
    preferredDuration: "",
  })

  const handleNext = async () => {
    if (step < 3) {
      setStep(step + 1)
    } else {
      // Show loading screen for 5 seconds
      setLoading(true)
      await new Promise(resolve => setTimeout(resolve, 5000))
      setCompleted(true)
      setLoading(false)
      onComplete(data)
    }
  }

  const handleProceed = () => {
    if (onProceed) {
      onProceed(data)
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const updateData = (field: keyof QuestionnaireData, value: string | number) => {
    setData((prev) => ({ ...prev, [field]: value }))
  }

  const isStepValid = () => {
    switch (step) {
      case 1:
        return data.firstName !== "" && data.lastName !== "" && data.age !== "" && data.maritalStatus !== "" && data.city !== ""
      case 2:
        return data.monthlyIncome > 0 && data.monthlyExpenses >= 0 && data.employmentType !== "" && data.employmentDuration !== ""
      case 3:
        return data.loanAmount > 0 && data.loanPurpose !== "" && data.preferredDuration !== ""
      default:
        return false
    }
  }

  const currentHints = step === 1 ? helpfulHints.step1 : step === 2 ? helpfulHints.step2 : helpfulHints.step3

  if (!started) {
    return (
      <div className="w-full max-w-7xl mx-auto">
        <Card className="border-2">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <Calculator className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-2xl">Kalkulator kredytowy</CardTitle>
                <CardDescription>
                  Otrzymaj spersonalizowaną ofertę kredytową w kilka minut
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="bg-muted/30 border-2 border-muted-foreground/20 rounded-lg p-6 mb-6">
                <h3 className="font-bold text-lg text-foreground mb-3">Co to jest kalkulator kredytowy?</h3>
                <p className="text-muted-foreground leading-relaxed mb-3">
                  Kalkulator kredytowy to proste narzędzie, które pomaga oszacować, ile będzie kosztować kredyt, który chcesz wziąć. 
                  Dzięki niemu możesz sprawdzić, jaką miesięczną ratę będziesz musiał spłacać oraz ile łącznie zapłacisz za pożyczone pieniądze.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  <strong className="text-foreground">Dla osób starszych:</strong> Jeśli nie jesteś pewien, jak działa kalkulator, nie martw się - to bardzo proste. 
                  Wystarczy, że podasz podstawowe informacje o sobie i swoich dochodach, a my pomożemy Ci znaleźć najlepszą ofertę kredytową. 
                  Możesz wypełnić formularz w swoim tempie, a jeśli będziesz potrzebować pomocy, nasz zespół jest gotowy, aby odpowiedzieć na Twoje pytania.
                </p>
              </div>

              <div className="bg-primary/5 border-2 border-primary/20 rounded-lg p-6 space-y-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <div className="w-full">
                    <h3 className="font-bold text-foreground mb-2">Ważne informacje przed rozpoczęciem</h3>
                    <div className="space-y-3 text-sm text-muted-foreground">
                      <div className="flex items-start gap-2 w-full">
                        <Clock className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                        <p className="flex-1"><strong className="text-foreground">Czas trwania:</strong> Wypełnienie formularza zajmie około 3-5 minut. Po przesłaniu danych, analiza i przygotowanie oferty trwa zwykle kilka godzin.</p>
                      </div>
                      <div className="flex items-start gap-2 w-full">
                        <FileText className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                        <p className="flex-1"><strong className="text-foreground">Dokumenty potrzebne do weryfikacji:</strong> Po otrzymaniu wstępnej oferty, możesz zostać poproszony o przedstawienie dokumentów tożsamości (dowód osobisty lub paszport), zaświadczenia o dochodach (zaświadczenie z pracy, PIT, umowa o pracę) oraz dokumentów potwierdzających adres zamieszkania (rachunek za media, umowa najmu).</p>
                      </div>
                      <div className="flex items-start gap-2 w-full">
                        <Shield className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                        <p className="flex-1"><strong className="text-foreground">Bezpieczeństwo danych:</strong> Wszystkie podane informacje są bezpiecznie przechowywane i chronione zgodnie z przepisami RODO. Twoje dane nie będą udostępniane osobom trzecim bez Twojej zgody.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3 p-4 bg-muted/30 rounded-lg">
                  <Checkbox
                    id="gdpr-consent"
                    checked={gdprConsent}
                    onCheckedChange={(checked) => setGdprConsent(!!checked)}
                    className="mt-1"
                  />
                  <Label htmlFor="gdpr-consent" className="text-sm leading-relaxed cursor-pointer">
                    <strong className="text-foreground">Wyrażam zgodę na przetwarzanie moich danych osobowych</strong> zgodnie z Rozporządzeniem Parlamentu Europejskiego i Rady (UE) 2016/679 (RODO). Administratorem danych jest Ascendia Sp. z o.o. Dane będą przetwarzane w celu przedstawienia ofert finansowych i realizacji umów. Podanie danych jest dobrowolne, lecz niezbędne do skorzystania z usługi. Mam prawo dostępu, poprawiania, usunięcia oraz ograniczenia przetwarzania moich danych.
                  </Label>
                </div>

                <Button
                  onClick={() => setStarted(true)}
                  disabled={!gdprConsent}
                  size="lg"
                  className="w-full h-14 text-lg"
                >
                  Rozpocznij kalkulację
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (loading) {
    return (
      <Card className="border-2 w-full max-w-7xl mx-auto">
        <CardContent className="p-12">
          <div className="flex flex-col items-center justify-center space-y-6">
            <Loader2 className="h-16 w-16 text-primary animate-spin" />
            <div className="text-center">
              <h3 className="text-2xl font-bold text-foreground mb-2">
                Analizujemy Twoje dane...
              </h3>
              <p className="text-muted-foreground">
                Sprawdzamy dostępne oferty i przygotowujemy spersonalizowane propozycje
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (completed && onProceed) {
    return (
      <Card className="border-2 w-full max-w-7xl mx-auto">
        <CardContent className="p-12">
          <div className="flex flex-col items-center justify-center space-y-6 text-center">
            <CheckCircle className="h-16 w-16 text-green-600 dark:text-green-400" />
            <div>
              <h3 className="text-2xl font-bold text-foreground mb-2">
                Kalkulacja zakończona!
              </h3>
              <p className="text-muted-foreground mb-6">
                Twoje dane zostały przeanalizowane. Przejdź do formalnego wniosku kredytowego.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Button
                onClick={() => {
                  setCompleted(false)
                  setLoading(false)
                  setStep(1)
                }}
                variant="outline"
                size="lg"
                className="w-full sm:w-auto"
              >
                Wstecz
              </Button>
              <Button
                onClick={handleProceed}
                size="lg"
                className="w-full sm:w-auto"
              >
                Przejdź do wniosku kredytowego
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="w-full max-w-7xl mx-auto">
      <Card className="border-2">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <FileText className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-2xl">Kalkulator kredytowy</CardTitle>
              <CardDescription>
                Krok {step} z 3 - Pomóż nam lepiej dopasować ofertę do Twoich potrzeb
              </CardDescription>
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-2 flex-1 rounded-full transition-calm ${
                  s <= step ? "bg-primary" : "bg-muted"
                }`}
              />
            ))}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Form */}
            <div className="lg:col-span-2 space-y-6">
              {step === 1 && (
                <div className="space-y-6 transition-all duration-500">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Imię *</Label>
                    <Input
                      id="firstName"
                      type="text"
                      value={data.firstName}
                      onChange={(e) => updateData("firstName", e.target.value)}
                      placeholder="Jan"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lastName">Nazwisko *</Label>
                    <Input
                      id="lastName"
                      type="text"
                      value={data.lastName}
                      onChange={(e) => updateData("lastName", e.target.value)}
                      placeholder="Kowalski"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="age">Wiek *</Label>
                    <select
                      id="age"
                      value={data.age}
                      onChange={(e) => updateData("age", e.target.value)}
                      className="flex h-12 w-full rounded-lg border-2 border-border bg-input px-4 py-2 text-base transition-calm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <option value="">Wybierz przedział wiekowy</option>
                      <option value="18-25">18-25 lat</option>
                      <option value="26-35">26-35 lat</option>
                      <option value="36-45">36-45 lat</option>
                      <option value="46-55">46-55 lat</option>
                      <option value="56-65">56-65 lat</option>
                      <option value="65+">Powyżej 65 lat</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="maritalStatus">Status cywilny *</Label>
                    <div className="grid grid-cols-2 gap-3">
                      {["Kawaler/Panna", "Żonaty/Zamężna", "Rozwiedziony/a", "Wdowiec/Wdowa"].map((status) => (
                        <Button
                          key={status}
                          type="button"
                          variant={data.maritalStatus === status ? "default" : "outline"}
                          onClick={() => updateData("maritalStatus", status)}
                          className="h-12"
                        >
                          {status}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="city">Miasto zamieszkania *</Label>
                    <Input
                      id="city"
                      type="text"
                      value={data.city}
                      onChange={(e) => updateData("city", e.target.value)}
                      placeholder="Warszawa"
                    />
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6 transition-all duration-500">
                  <div className="space-y-2">
                    <Label htmlFor="income">
                      Miesięczny dochód netto (PLN) *
                    </Label>
                    <Input
                      id="income"
                      type="number"
                      value={data.monthlyIncome || ""}
                      onChange={(e) => updateData("monthlyIncome", Number(e.target.value))}
                      placeholder="5000"
                      min={0}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="expenses">
                      Miesięczne wydatki (PLN) *
                    </Label>
                    <Input
                      id="expenses"
                      type="number"
                      value={data.monthlyExpenses || ""}
                      onChange={(e) => updateData("monthlyExpenses", Number(e.target.value))}
                      placeholder="3000"
                      min={0}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="employment">Typ zatrudnienia *</Label>
                    <select
                      id="employment"
                      value={data.employmentType}
                      onChange={(e) => updateData("employmentType", e.target.value)}
                      className="flex h-12 w-full rounded-lg border-2 border-border bg-input px-4 py-2 text-base transition-calm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <option value="">Wybierz typ zatrudnienia</option>
                      <option value="umowa-o-prace">Umowa o pracę</option>
                      <option value="umowa-zlecenie">Umowa zlecenie</option>
                      <option value="umowa-o-dzielo">Umowa o dzieło</option>
                      <option value="dzialalnosc-gospodarcza">Działalność gospodarcza</option>
                      <option value="emerytura">Emerytura</option>
                      <option value="renta">Renta</option>
                      <option value="inne">Inne</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="duration">Okres zatrudnienia *</Label>
                    <select
                      id="duration"
                      value={data.employmentDuration}
                      onChange={(e) => updateData("employmentDuration", e.target.value)}
                      className="flex h-12 w-full rounded-lg border-2 border-border bg-input px-4 py-2 text-base transition-calm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <option value="">Wybierz okres</option>
                      <option value="0-6">Mniej niż 6 miesięcy</option>
                      <option value="6-12">6-12 miesięcy</option>
                      <option value="12-24">12-24 miesiące</option>
                      <option value="24-60">2-5 lat</option>
                      <option value="60+">Powyżej 5 lat</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="debts">
                      Obecne zobowiązania (PLN)
                    </Label>
                    <Input
                      id="debts"
                      type="number"
                      value={data.currentDebts || ""}
                      onChange={(e) => updateData("currentDebts", Number(e.target.value))}
                      placeholder="0"
                      min={0}
                    />
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-6 transition-all duration-500">
                  <div className="space-y-2">
                    <Label htmlFor="loanAmount">
                      Kwota kredytu (PLN) *
                    </Label>
                    <Input
                      id="loanAmount"
                      type="number"
                      value={data.loanAmount || ""}
                      onChange={(e) => updateData("loanAmount", Number(e.target.value))}
                      placeholder="50000"
                      min={1000}
                      max={500000}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="purpose">Cel kredytu *</Label>
                    <select
                      id="purpose"
                      value={data.loanPurpose}
                      onChange={(e) => updateData("loanPurpose", e.target.value)}
                      className="flex h-12 w-full rounded-lg border-2 border-border bg-input px-4 py-2 text-base transition-calm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <option value="">Wybierz cel kredytu</option>
                      <option value="konsolidacja">Konsolidacja zobowiązań</option>
                      <option value="remont">Remont mieszkania</option>
                      <option value="samochod">Zakup samochodu</option>
                      <option value="wakacje">Wakacje</option>
                      <option value="sprzet">Zakup sprzętu</option>
                      <option value="edukacja">Edukacja</option>
                      <option value="zdrowie">Zdrowie</option>
                      <option value="inne">Inne</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="preferredDuration">Preferowany okres spłaty *</Label>
                    <div className="grid grid-cols-2 gap-3">
                      {["12-24 miesiące", "24-36 miesięcy", "36-60 miesięcy", "60-120 miesięcy"].map((duration) => (
                        <Button
                          key={duration}
                          type="button"
                          variant={data.preferredDuration === duration ? "default" : "outline"}
                          onClick={() => updateData("preferredDuration", duration)}
                          className="h-12"
                        >
                          {duration}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-4 pt-4">
                {step > 1 && (
                  <Button variant="outline" onClick={handleBack} className="flex-1">
                    Wstecz
                  </Button>
                )}
                <Button
                  onClick={handleNext}
                  disabled={!isStepValid()}
                  className="flex-1"
                  size="lg"
                >
                  {step === 3 ? "Wyślij i sprawdź oferty" : "Dalej"}
                  {step < 3 && <ArrowRight className="ml-2 h-4 w-4" />}
                </Button>
              </div>
            </div>

            {/* Helpful Hints Sidebar */}
            <div className="lg:col-span-1">
              <Card className="bg-primary/5 border-2 border-primary/20 sticky top-4">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Info className="h-5 w-5 text-primary" />
                    <CardTitle className="text-lg">{currentHints.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {currentHints.content}
                  </p>
                  <div className="space-y-2">
                    {currentHints.tips.map((tip, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                        <p className="text-xs text-muted-foreground">{tip}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
