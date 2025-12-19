import { useTranslation } from "react-i18next"
import { Card, CardContent } from "@/components/ui/card"
import { Mail, Phone, MapPin, Clock } from "lucide-react"

export default function Contact() {
  const { t } = useTranslation()

  return (
    <div className="container mx-auto px-6 py-12 max-w-5xl">
      <div className="mb-12 text-center">
        <h1 className="text-5xl font-extrabold text-foreground mb-4">{t("contact.title")}</h1>
        <p className="text-xl text-muted-foreground">{t("contact.subtitle")}</p>
      </div>

      <div className="mb-12">
        <Card>
          <CardContent className="p-8">
            <div className="prose prose-lg max-w-none">
              <p className="text-lg leading-relaxed text-muted-foreground mb-4">
                {t("contact.description1")}
              </p>
              <p className="text-lg leading-relaxed text-muted-foreground mb-4">
                {t("contact.description2")}
              </p>
              <p className="text-lg leading-relaxed text-muted-foreground mb-4">
                {t("contact.description3")}
              </p>
              <p className="text-lg leading-relaxed text-muted-foreground">
                {t("contact.description4")}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardContent className="p-8 space-y-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Mail className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-2">{t("contact.email")}</p>
                <p className="text-lg font-semibold">kontakt@ascendia.pl</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Phone className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-2">{t("contact.phone")}</p>
                <p className="text-lg font-semibold">+48 800 123 456</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <MapPin className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-2">{t("contact.address")}</p>
                <p className="text-lg font-semibold">
                  Ascendia Sp. z o.o.
                  <br />
                  ul. Przykładowa 123
                  <br />
                  00-000 Warszawa
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-8">
            <div className="flex items-start gap-4 mb-6">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-foreground mb-4">{t("contact.workHours")}</h2>
                <div className="space-y-2 text-lg">
                  <div className="flex justify-between">
                    <span className="font-semibold">{t("contact.monday")}</span>
                    <span className="text-muted-foreground">8:00 - 20:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold">{t("contact.tuesday")}</span>
                    <span className="text-muted-foreground">8:00 - 20:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold">{t("contact.wednesday")}</span>
                    <span className="text-muted-foreground">8:00 - 20:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold">{t("contact.thursday")}</span>
                    <span className="text-muted-foreground">8:00 - 20:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold">{t("contact.friday")}</span>
                    <span className="text-muted-foreground">8:00 - 20:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold">{t("contact.saturday")}</span>
                    <span className="text-muted-foreground">9:00 - 15:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold">{t("contact.sunday")}</span>
                    <span className="text-muted-foreground">{t("contact.closed")}</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-4">{t("contact.emergency")}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

