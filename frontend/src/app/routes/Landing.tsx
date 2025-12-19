import { Link, useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Check, Shield, Clock, FileText, Users, TrendingUp, Calculator, AlertCircle, ArrowRight } from "lucide-react"
import SimpleCalculator from "@/components/SimpleCalculator"
import BankPartners from "@/components/BankPartners"
import { Checkbox } from "@/components/ui/checkbox"

function useScrollAnimation() {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current)
      }
    }
  }, [])

  return { ref, isVisible }
}

export default function Landing() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [gdprConsent, setGdprConsent] = useState(false)
  const heroSectionRef = useScrollAnimation()
  const calculatorRef = useScrollAnimation()
  const trustRef = useScrollAnimation()
  const featuresRef = useScrollAnimation()
  const productsRef = useScrollAnimation()

  const handleStartCalculation = () => {
    if (!gdprConsent) {
      alert(t("landing.personalizedCalculator.gdprConsent") ? "Musisz wyrazić zgodę na przetwarzanie danych osobowych" : "You must consent to personal data processing")
      return
    }
    navigate("/products")
  }

  return (
    <div>
      {/* Personalized Calculator Homepage Section */}
      <section 
        className="py-12 md:py-20 relative"
        style={{
          backgroundImage: 'url(/assets/hero-field.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
          <div className="absolute inset-0 bg-background/70"></div>
          <div className="container mx-auto px-6 max-w-6xl relative z-10">
            {/* Title and Subtitle */}
            <div className="text-center mb-12">
              <h1 className="mb-4 text-balance text-4xl font-extrabold leading-tight text-foreground md:text-5xl lg:text-6xl">
                {t("landing.personalizedCalculator.title")}
              </h1>
              <p className="text-balance text-lg text-foreground md:text-xl">
                {t("landing.personalizedCalculator.subtitle")}
              </p>
            </div>

            {/* Two Information Cards */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {/* Duration Card */}
              <Card className="border-2" style={{ backgroundColor: "#FBF9F4" }}>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                      <Clock className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground">
                      {t("landing.personalizedCalculator.duration.title")}
                    </h3>
                  </div>
                  <p className="text-foreground leading-relaxed">
                    {t("landing.personalizedCalculator.duration.content")
                      .split("**")
                      .map((part, index) => 
                        index % 2 === 1 ? (
                          <strong key={index} className="text-foreground">{part}</strong>
                        ) : (
                          <span key={index}>{part}</span>
                        )
                      )}
                  </p>
                </CardContent>
              </Card>

              {/* Documents Card */}
              <Card className="border-2" style={{ backgroundColor: "#FBF9F4" }}>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                      <FileText className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground">
                      {t("landing.personalizedCalculator.documents.title")}
                    </h3>
                  </div>
                  <p className="text-foreground leading-relaxed mb-3">
                    {t("landing.personalizedCalculator.documents.intro")}
                  </p>
                  <ul className="space-y-2 text-sm text-foreground">
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>{t("landing.personalizedCalculator.documents.identity")}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>{t("landing.personalizedCalculator.documents.income")}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>{t("landing.personalizedCalculator.documents.address")}</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Main Calculator Card */}
            <Card className="border-2 mb-8" style={{ backgroundColor: "#FBF9F4" }}>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                    <Calculator className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-foreground">
                      {t("landing.personalizedCalculator.calculator.title")}
                    </h2>
                    <p className="text-sm text-foreground mt-1">
                      {t("landing.personalizedCalculator.calculator.subtitle")}
                    </p>
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="text-xl font-bold text-foreground mb-3">
                    {t("landing.personalizedCalculator.calculator.whatIs.title")}
                  </h3>
                  <p className="text-foreground leading-relaxed mb-4">
                    {t("landing.personalizedCalculator.calculator.whatIs.paragraph1")}
                  </p>
                  <p className="text-foreground leading-relaxed">
                    <strong className="text-foreground">
                      {t("landing.personalizedCalculator.calculator.whatIs.paragraph2.title")}
                    </strong>{" "}
                    {t("landing.personalizedCalculator.calculator.whatIs.paragraph2.content")}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Important Information Card */}
            <Card className="border-2 mb-8" style={{ backgroundColor: "#FBF9F4" }}>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary">
                    <AlertCircle className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground">
                    {t("landing.personalizedCalculator.importantInfo.title")}
                  </h2>
                </div>

                <div className="space-y-4 mt-6">
                  <div>
                    <h4 className="font-bold text-foreground mb-2 flex items-center gap-2">
                      <Clock className="h-4 w-4 text-primary" />
                      {t("landing.personalizedCalculator.importantInfo.duration.title")}
                    </h4>
                    <p className="text-foreground leading-relaxed">
                      {t("landing.personalizedCalculator.importantInfo.duration.content")}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-bold text-foreground mb-2 flex items-center gap-2">
                      <FileText className="h-4 w-4 text-primary" />
                      {t("landing.personalizedCalculator.importantInfo.documents.title")}
                    </h4>
                    <p className="text-foreground leading-relaxed">
                      {t("landing.personalizedCalculator.importantInfo.documents.content")}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-bold text-foreground mb-2 flex items-center gap-2">
                      <Shield className="h-4 w-4 text-primary" />
                      {t("landing.personalizedCalculator.importantInfo.security.title")}
                    </h4>
                    <p className="text-foreground leading-relaxed">
                      {t("landing.personalizedCalculator.importantInfo.security.content")}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* GDPR Consent and CTA */}
            <div className="max-w-3xl mx-auto">
              <div className="mb-6">
                <label className="flex items-start gap-3 cursor-pointer">
                  <Checkbox
                    checked={gdprConsent}
                    onCheckedChange={(checked) => setGdprConsent(checked === true)}
                    className="mt-1 flex-shrink-0"
                  />
                  <span className="text-sm text-foreground leading-relaxed">
                    {t("landing.personalizedCalculator.gdprConsent")}
                  </span>
                </label>
              </div>

              <div className="text-center">
                <Button
                  size="lg"
                  onClick={handleStartCalculation}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 h-14 px-10 text-lg"
                >
                  {t("landing.personalizedCalculator.startCalculation")}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </section>

      {/* Simple Calculator Section */}
      <section className="bg-card py-16 border-y-2 border-border">
        <div className="container mx-auto px-6">
          <div className="mb-8 text-center">
            <h2 className="mb-4 text-balance text-3xl font-extrabold text-foreground md:text-4xl">
              Szybki kalkulator
            </h2>
            <p className="text-balance text-lg text-muted-foreground">
              Oblicz ratę kredytu bez logowania - wystarczy podać kwotę, oprocentowanie i okres spłaty
            </p>
          </div>
          <SimpleCalculator />
        </div>
      </section>

      {/* Trust Indicators */}
      <section
        ref={trustRef.ref}
        className={`border-y-2 border-border bg-card transition-all duration-1000 ${
          trustRef.isVisible
            ? "translate-y-0 opacity-100"
            : "translate-y-8 opacity-0"
        }`}
      >
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
      <section
        ref={featuresRef.ref}
        className={`container mx-auto px-6 py-20 md:py-32 transition-all duration-1000 ${
          featuresRef.isVisible
            ? "translate-y-0 opacity-100"
            : "translate-y-8 opacity-0"
        }`}
        id="jak-to-dziala"
      >
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-balance text-4xl font-extrabold text-foreground md:text-5xl">
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
              <h3 className="mb-3 text-2xl font-extrabold text-foreground">1. Wypełnij wniosek</h3>
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
              <h3 className="mb-3 text-2xl font-extrabold text-foreground">2. Otrzymaj ofertę</h3>
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
              <h3 className="mb-3 text-2xl font-extrabold text-foreground">3. Otrzymaj środki</h3>
              <p className="leading-relaxed text-muted-foreground text-base">
                Po podpisaniu umowy online, pieniądze wpłyną na Twoje konto w ciągu 24 godzin.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Products Section */}
      <section
        ref={productsRef.ref}
        className={`bg-card py-20 md:py-32 transition-all duration-1000 ${
          productsRef.isVisible
            ? "translate-y-0 opacity-100"
            : "translate-y-8 opacity-0"
        }`}
        id="produkty"
      >
        <div className="container mx-auto px-6">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-balance text-4xl font-extrabold text-foreground md:text-5xl">
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
                <h3 className="mb-4 text-3xl font-extrabold text-foreground">Kredyt gotówkowy</h3>
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
                <Link to="/payments">
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
                <h3 className="mb-4 text-3xl font-extrabold text-foreground">Kredyt konsolidacyjny</h3>
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
                <Link to="/payments">
                  <Button size="lg" variant="outline" className="w-full text-base h-12 bg-transparent">
                    Sprawdź ofertę
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Bank Partners Section */}
      <BankPartners />

      {/* CTA Section */}
      <section className="bg-primary py-20">
        <div className="container mx-auto px-6 text-center">
          <h2 className="mb-6 text-balance text-4xl font-extrabold text-primary-foreground md:text-5xl">
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
                  <span className="text-xl font-bold text-primary-foreground">A</span>
                </div>
                <span className="text-xl font-bold text-foreground">Ascendia</span>
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
                <li>
                  <Link to="/support" className="hover:text-primary transition-calm">
                    Wsparcie
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
                <li>
                  <Link to="/education" className="hover:text-primary transition-calm">
                    Edukacja
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 border-t-2 border-border pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2025 Ascendia Sp. z o.o. Wszystkie prawa zastrzeżone.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

