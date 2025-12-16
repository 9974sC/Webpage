import { useTranslation } from "react-i18next"
import { Card, CardContent } from "@/components/ui/card"

export default function About() {
  const { t } = useTranslation()

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-foreground">{t("about.title")}</h1>
      </div>

      <Card className="max-w-3xl">
        <CardContent className="p-8">
          <p className="text-lg leading-relaxed text-muted-foreground">
            {t("about.description")}
          </p>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            FastFinance to nowoczesna platforma finansowa stworzona z myślą o polskich klientach.
            Oferujemy przejrzyste warunki, szybkie decyzje kredytowe i pełne wsparcie na każdym
            etapie współpracy.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

