import { useTranslation } from "react-i18next"
import { Card, CardContent } from "@/components/ui/card"

export default function Contact() {
  const { t } = useTranslation()

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-foreground">{t("contact.title")}</h1>
      </div>

      <Card className="max-w-2xl">
        <CardContent className="p-8 space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">{t("contact.email")}</p>
            <p className="text-lg font-semibold">kontakt@fastfinance.pl</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">{t("contact.phone")}</p>
            <p className="text-lg font-semibold">+48 800 123 456</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">{t("contact.address")}</p>
            <p className="text-lg font-semibold">
              FastFinance Sp. z o.o.
              <br />
              ul. Przykładowa 123
              <br />
              00-000 Warszawa
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

