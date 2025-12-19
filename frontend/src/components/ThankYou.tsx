import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, Mail, FileText, ArrowRight } from "lucide-react"
import { useNavigate } from "react-router-dom"

interface ThankYouProps {
  referenceNumber: string
}

export default function ThankYou({ referenceNumber }: ThankYouProps) {
  const navigate = useNavigate()

  return (
    <div className="w-full max-w-3xl mx-auto">
      <Card className="border-2">
        <CardContent className="p-12">
          <div className="flex flex-col items-center justify-center space-y-6 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
              <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-400" />
            </div>

            <div>
              <h1 className="text-4xl font-extrabold text-foreground mb-4">
                Dziękujemy za wybór Ascendia!
              </h1>
              <p className="text-lg text-muted-foreground mb-8">
                Twój wniosek kredytowy został pomyślnie złożony
              </p>
            </div>

            <div className="w-full space-y-4">
              <div className="flex items-start gap-4 p-6 bg-primary/5 border-2 border-primary/20 rounded-lg">
                <Mail className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                <div className="text-left">
                  <h3 className="font-bold text-foreground mb-2">
                    Szczegóły zostały wysłane na Twój adres e-mail
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    W ciągu kilku godzin otrzymasz na podany adres e-mail pełne potwierdzenie 
                    złożenia wniosku wraz ze wszystkimi szczegółami. Sprawdź również folder 
                    ze spamem, jeśli wiadomość nie pojawi się w skrzynce odbiorczej.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-6 bg-muted/30 border-2 rounded-lg">
                <FileText className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                <div className="text-left flex-1">
                  <h3 className="font-bold text-foreground mb-2">
                    Numer referencyjny wniosku
                  </h3>
                  <div className="bg-background border-2 border-primary/20 rounded-lg p-4 mb-2">
                    <p className="text-2xl font-mono font-bold text-primary">
                      {referenceNumber}
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Zapisz ten numer - będzie potrzebny do śledzenia statusu Twojego wniosku 
                    i kontaktu z naszym działem obsługi klienta.
                  </p>
                </div>
              </div>
            </div>

            <div className="w-full space-y-3 pt-4">
              <p className="text-sm text-muted-foreground">
                Nasz zespół przeanalizuje Twój wniosek i skontaktuje się z Tobą w ciągu 
                24-48 godzin roboczych. W międzyczasie możesz śledzić status wniosku 
                w swoim panelu klienta.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button
                  onClick={() => navigate("/dashboard")}
                  className="flex-1"
                  size="lg"
                >
                  Przejdź do panelu klienta
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button
                  onClick={() => navigate("/")}
                  variant="outline"
                  className="flex-1"
                  size="lg"
                >
                  Wróć do strony głównej
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
