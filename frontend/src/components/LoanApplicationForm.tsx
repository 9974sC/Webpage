import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { FileText, ArrowRight, Shield, CheckCircle, Loader2, CreditCard, AlertCircle } from "lucide-react"

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

interface LoanApplicationFormProps {
  questionnaireData: QuestionnaireData
  onComplete: (referenceNumber: string) => void
}

export default function LoanApplicationForm({ questionnaireData, onComplete }: LoanApplicationFormProps) {
  const [loading, setLoading] = useState(false)
  const [creditCheckComplete, setCreditCheckComplete] = useState(false)
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [formData, setFormData] = useState({
    pesel: "",
    street: "",
    streetNumber: "",
    apartmentNumber: "",
    postalCode: "",
    city: "",
  })

  const handleCreditCheck = async () => {
    setLoading(true)
    // Simulate credit check
    await new Promise(resolve => setTimeout(resolve, 3000))
    setCreditCheckComplete(true)
    setLoading(false)
  }

  const handleFinalize = async () => {
    if (!creditCheckComplete || !termsAccepted) return
    
    setLoading(true)
    // Simulate finalization
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Generate reference number
    const referenceNumber = `REF-${Date.now().toString().slice(-8)}`
    onComplete(referenceNumber)
  }

  const updateFormData = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const isFormValid = () => {
    return (
      formData.pesel.length === 11 &&
      formData.street !== "" &&
      formData.streetNumber !== "" &&
      formData.postalCode !== "" &&
      formData.city !== ""
    )
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Card className="border-2">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <FileText className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-2xl">Formalny wniosek kredytowy</CardTitle>
              <CardDescription>
                Wypełnij poniższe dane, aby dokończyć wniosek
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Personal Details Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-foreground">Dane osobowe</h3>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Imię</Label>
                  <Input
                    id="firstName"
                    type="text"
                    value={questionnaireData.firstName}
                    disabled
                    className="bg-muted"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName">Nazwisko</Label>
                  <Input
                    id="lastName"
                    type="text"
                    value={questionnaireData.lastName}
                    disabled
                    className="bg-muted"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="pesel">PESEL *</Label>
                <Input
                  id="pesel"
                  type="text"
                  value={formData.pesel}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "").slice(0, 11)
                    updateFormData("pesel", value)
                  }}
                  placeholder="12345678901"
                  maxLength={11}
                />
                <p className="text-xs text-muted-foreground">
                  11 cyfr bez myślników
                </p>
              </div>
            </div>

            {/* Address Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-foreground">Adres zamieszkania</h3>
              
              <div className="space-y-2">
                <Label htmlFor="street">Ulica *</Label>
                <Input
                  id="street"
                  type="text"
                  value={formData.street}
                  onChange={(e) => updateFormData("street", e.target.value)}
                  placeholder="ul. Przykładowa"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="streetNumber">Numer domu *</Label>
                  <Input
                    id="streetNumber"
                    type="text"
                    value={formData.streetNumber}
                    onChange={(e) => updateFormData("streetNumber", e.target.value)}
                    placeholder="123"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="apartmentNumber">Numer mieszkania</Label>
                  <Input
                    id="apartmentNumber"
                    type="text"
                    value={formData.apartmentNumber}
                    onChange={(e) => updateFormData("apartmentNumber", e.target.value)}
                    placeholder="45"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="postalCode">Kod pocztowy *</Label>
                  <Input
                    id="postalCode"
                    type="text"
                    value={formData.postalCode}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "").slice(0, 5)
                      const formatted = value.length === 5 ? `${value.slice(0, 2)}-${value.slice(2)}` : value
                      updateFormData("postalCode", formatted)
                    }}
                    placeholder="00-000"
                    maxLength={6}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city">Miasto *</Label>
                  <Input
                    id="city"
                    type="text"
                    value={formData.city}
                    onChange={(e) => updateFormData("city", e.target.value)}
                    placeholder="Warszawa"
                  />
                </div>
              </div>
            </div>

            {/* Credit Check Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 bg-primary/5 border-2 border-primary/20 rounded-lg">
                <CreditCard className="h-6 w-6 text-primary" />
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-foreground mb-1">Weryfikacja kredytowa</h3>
                  <p className="text-sm text-muted-foreground">
                    Sprawdzimy Twoją zdolność kredytową w biurze informacji kredytowej
                  </p>
                </div>
              </div>

              {!creditCheckComplete ? (
                <Button
                  onClick={handleCreditCheck}
                  disabled={!isFormValid() || loading}
                  className="w-full"
                  size="lg"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sprawdzanie zdolności kredytowej...
                    </>
                  ) : (
                    <>
                      Przeprowadź weryfikację kredytową
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              ) : (
                <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-950/20 border-2 border-green-200 dark:border-green-800 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                  <div>
                    <p className="font-semibold text-green-900 dark:text-green-100">
                      Weryfikacja kredytowa zakończona pomyślnie
                    </p>
                    <p className="text-sm text-green-700 dark:text-green-300">
                      Twoja zdolność kredytowa została potwierdzona
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Terms and Conditions */}
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-4 bg-muted/30 rounded-lg">
                <Checkbox
                  id="terms-consent"
                  checked={termsAccepted}
                  onCheckedChange={(checked) => setTermsAccepted(!!checked)}
                  className="mt-1"
                />
                <Label htmlFor="terms-consent" className="text-sm leading-relaxed cursor-pointer">
                  <strong className="text-foreground">Akceptuję regulamin i warunki kredytowe</strong>. 
                  Oświadczam, że podane przeze mnie informacje są prawdziwe i zgodne ze stanem faktycznym. 
                  Rozumiem, że złożenie nieprawdziwych danych może skutkować odmową udzielenia kredytu 
                  lub rozwiązaniem umowy. Zobowiązuję się do spłaty kredytu zgodnie z warunkami umowy.
                </Label>
              </div>
            </div>

            {/* Finalize Button */}
            <Button
              onClick={handleFinalize}
              disabled={!creditCheckComplete || !termsAccepted || loading}
              className="w-full"
              size="lg"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Finalizowanie wniosku...
                </>
              ) : (
                <>
                  Sfinalizuj wniosek
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
