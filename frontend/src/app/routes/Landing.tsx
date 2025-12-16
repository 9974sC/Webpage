import { Link } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Check, Shield, Clock, FileText, Users, TrendingUp } from "lucide-react"

export default function Landing() {
  const { t } = useTranslation()

  return (
    <div>
      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20 md:py-32">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border-2 border-primary/20 bg-primary/5 px-4 py-2">
            <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            <span className="text-sm font-medium text-foreground">
              Zaufanie ponad 50 000 Polaków
            </span>
          </div>

          <h1 className="mb-6 text-balance text-5xl font-bold leading-tight text-foreground md:text-6xl lg:text-7xl">
            {t("landing.headline")}
          </h1>

          <p className="mb-10 text-balance text-xl leading-relaxed text-muted-foreground md:text-2xl">
            Przejrzyste warunki, proste procesy i pełne wsparcie na każdym etapie. Sprawdź swoją ofertę w 3 minuty bez
            wpływu na scoring kredytowy.
          </p>

          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link to="/register">
              <Button size="lg">{t("landing.cta")}</Button>
            </Link>
            <Link to="#jak-to-dziala">
              <Button variant="outline" size="lg">
                {t("landing.howItWorks")}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="border-y-2 border-border bg-card">
        <div className="container mx-auto px-6 py-12">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3 lg:gap-12">
            <div className="text-center">
              <div className="mb-3 text-4xl font-bold text-primary">50K+</div>
              <div className="text-base text-muted-foreground">Zadowolonych klientów</div>
            </div>
            <div className="text-center">
              <div className="mb-3 text-4xl font-bold text-primary">98%</div>
              <div className="text-base text-muted-foreground">Pozytywnych opinii</div>
            </div>
            <div className="text-center">
              <div className="mb-3 text-4xl font-bold text-primary">24h</div>
              <div className="text-base text-muted-foreground">Średni czas decyzji</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-6 py-20 md:py-32" id="jak-to-dziala">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-balance text-4xl font-bold text-foreground md:text-5xl">
            Proste kroki do Twojego kredytu
          </h2>
          <p className="text-balance text-lg text-muted-foreground md:text-xl">
            Cały proces online, bez zbędnych formalności
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3 lg:gap-8">
          <Card className="border-2 transition-calm hover:border-primary/50">
            <CardContent className="p-8">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                <FileText className="h-8 w-8 text-primary" />
              </div>
              <h3 className="mb-3 text-2xl font-bold text-foreground">1. Wypełnij wniosek</h3>
              <p className="leading-relaxed text-muted-foreground text-base">
                Prosty formularz online zajmie Ci zaledwie 3 minuty. Bez wizyty w oddziale, wszystko z domu.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 transition-calm hover:border-primary/50">
            <CardContent className="p-8">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                <Clock className="h-8 w-8 text-primary" />
              </div>
              <h3 className="mb-3 text-2xl font-bold text-foreground">2. Otrzymaj ofertę</h3>
              <p className="leading-relaxed text-muted-foreground text-base">
                Nasza decyzja kredytowa to zazwyczaj tylko kilka godzin. Sprawdzimy Twoją zdolność kredytową i
                przedstawimy najlepszą ofertę.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 transition-calm hover:border-primary/50">
            <CardContent className="p-8">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                <Check className="h-8 w-8 text-primary" />
              </div>
              <h3 className="mb-3 text-2xl font-bold text-foreground">3. Otrzymaj środki</h3>
              <p className="leading-relaxed text-muted-foreground text-base">
                Po podpisaniu umowy online, pieniądze wpłyną na Twoje konto w ciągu 24 godzin.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Products Section */}
      <section className="bg-card py-20 md:py-32" id="produkty">
        <div className="container mx-auto px-6">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-balance text-4xl font-bold text-foreground md:text-5xl">
              Nasze produkty finansowe
            </h2>
            <p className="text-balance text-lg text-muted-foreground md:text-xl">
              Wybierz rozwiązanie dopasowane do Twoich potrzeb
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:gap-12">
            <Card className="border-2">
              <CardContent className="p-10">
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
                  <TrendingUp className="h-7 w-7 text-primary" />
                </div>
                <h3 className="mb-4 text-3xl font-bold text-foreground">Kredyt gotówkowy</h3>
                <p className="mb-6 text-lg leading-relaxed text-muted-foreground">
                  Od 5 000 zł do 200 000 zł na dowolny cel. Niskie oprocentowanie, elastyczne raty dopasowane do Twoich
                  możliwości.
                </p>
                <ul className="mb-8 space-y-3">
                  <li className="flex items-start gap-3">
                    <Check className="mt-1 h-5 w-5 shrink-0 text-primary" />
                    <span className="text-base text-foreground">Oprocentowanie od 6,5% rocznie</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="mt-1 h-5 w-5 shrink-0 text-primary" />
                    <span className="text-base text-foreground">Okres spłaty do 10 lat</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="mt-1 h-5 w-5 shrink-0 text-primary" />
                    <span className="text-base text-foreground">Możliwość wcześniejszej spłaty bez prowizji</span>
                  </li>
                </ul>
                <Link to="/register">
                  <Button size="lg" className="w-full text-base h-12">
                    Sprawdź ofertę
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardContent className="p-10">
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
                  <Shield className="h-7 w-7 text-primary" />
                </div>
                <h3 className="mb-4 text-3xl font-bold text-foreground">Kredyt konsolidacyjny</h3>
                <p className="mb-6 text-lg leading-relaxed text-muted-foreground">
                  Połącz wszystkie swoje zobowiązania w jedną, niższą ratę. Uprość swoje finanse i zaoszczędź nawet 30%.
                </p>
                <ul className="mb-8 space-y-3">
                  <li className="flex items-start gap-3">
                    <Check className="mt-1 h-5 w-5 shrink-0 text-primary" />
                    <span className="text-base text-foreground">Jedna, niższa rata zamiast wielu</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="mt-1 h-5 w-5 shrink-0 text-primary" />
                    <span className="text-base text-foreground">Obniżenie miesięcznych kosztów</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="mt-1 h-5 w-5 shrink-0 text-primary" />
                    <span className="text-base text-foreground">Możliwość dodatkowej gotówki</span>
                  </li>
                </ul>
                <Link to="/register">
                  <Button size="lg" variant="outline" className="w-full text-base h-12 bg-transparent">
                    Sprawdź ofertę
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary py-20">
        <div className="container mx-auto px-6 text-center">
          <h2 className="mb-6 text-balance text-4xl font-bold text-primary-foreground md:text-5xl">
            Gotowy na lepsze finanse?
          </h2>
          <p className="mb-10 text-balance text-xl text-primary-foreground/90 md:text-2xl">
            Sprawdź swoją ofertę w 3 minuty. Bez wpływu na scoring kredytowy.
          </p>
          <Link to="/register">
            <Button size="lg" variant="secondary" className="h-14 px-10 text-lg">
              {t("landing.cta")}
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t-2 border-border bg-card py-12">
        <div className="container mx-auto px-6">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <div className="mb-4 flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                  <span className="text-xl font-bold text-primary-foreground">FF</span>
                </div>
                <span className="text-xl font-bold text-foreground">FastFinance</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Bezpieczne finansowanie dopasowane do Twoich potrzeb.
              </p>
            </div>

            <div>
              <h4 className="mb-4 font-bold text-foreground">Produkty</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link to="/products" className="hover:text-primary transition-calm">
                    Kredyt gotówkowy
                  </Link>
                </li>
                <li>
                  <Link to="/products" className="hover:text-primary transition-calm">
                    Kredyt konsolidacyjny
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="mb-4 font-bold text-foreground">Firma</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link to="/about" className="hover:text-primary transition-calm">
                    {t("landing.about")}
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="hover:text-primary transition-calm">
                    {t("landing.contact")}
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="mb-4 font-bold text-foreground">Prawne</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link to="/gdpr" className="hover:text-primary transition-calm">
                    RODO
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 border-t-2 border-border pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2025 FastFinance Sp. z o.o. Wszystkie prawa zastrzeżone.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

