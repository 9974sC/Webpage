import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  BookOpen,
  Calculator,
  Shield,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Info,
  FileText,
} from "lucide-react"

export default function Education() {
  return (
    <div className="container mx-auto px-6 py-12">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold text-foreground mb-4">Edukacja Finansowa</h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Dowiedz się więcej o kredytach, finansach osobistych i odpowiedzialnym zarządzaniu pieniędzmi
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-12">
        <Card className="border-2 hover:border-primary/50 transition-calm">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <BookOpen className="h-5 w-5 text-primary" />
              </div>
              <CardTitle>Podstawy Kredytów</CardTitle>
            </div>
            <CardDescription>Zrozum podstawowe pojęcia związane z kredytami</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                <span>Rodzaje kredytów i ich zastosowanie</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                <span>Jak działa oprocentowanie</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                <span>RRSO - Rzeczywista Roczna Stopa Oprocentowania</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                <span>Okres kredytowania i jego wpływ na ratę</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="border-2 hover:border-primary/50 transition-calm">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Calculator className="h-5 w-5 text-primary" />
              </div>
              <CardTitle>Zdolność Kredytowa</CardTitle>
            </div>
            <CardDescription>Dowiedz się, jak banki oceniają zdolność kredytową</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                <span>Czynniki wpływające na zdolność kredytową</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                <span>Jak poprawić swoją zdolność kredytową</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                <span>Dokumenty potrzebne do wniosku</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                <span>Historia kredytowa i BIK</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="border-2 hover:border-primary/50 transition-calm">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Shield className="h-5 w-5 text-primary" />
              </div>
              <CardTitle>Bezpieczeństwo</CardTitle>
            </div>
            <CardDescription>Jak chronić się przed oszustwami finansowymi</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-destructive mt-0.5 shrink-0" />
                <span>Typowe metody oszustw kredytowych</span>
              </li>
              <li className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-destructive mt-0.5 shrink-0" />
                <span>Jak rozpoznać fałszywe oferty</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                <span>Bezpieczne korzystanie z usług online</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                <span>Ochrona danych osobowych</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="border-2 hover:border-primary/50 transition-calm">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
              <CardTitle>Zarządzanie Finansami</CardTitle>
            </div>
            <CardDescription>Praktyczne porady dotyczące zarządzania budżetem</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                <span>Tworzenie budżetu domowego</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                <span>Planowanie wydatków</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                <span>Budowanie oszczędności</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                <span>Konsolidacja zadłużenia</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="border-2 hover:border-primary/50 transition-calm">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Info className="h-5 w-5 text-primary" />
              </div>
              <CardTitle>Kredyt Konsolidacyjny</CardTitle>
            </div>
            <CardDescription>Kiedy i jak skonsolidować swoje zobowiązania</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                <span>Korzyści z konsolidacji</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                <span>Kiedy warto skonsolidować kredyty</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                <span>Proces konsolidacji krok po kroku</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                <span>Oszczędności dzięki konsolidacji</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="border-2 hover:border-primary/50 transition-calm">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <CardTitle>Umowa Kredytowa</CardTitle>
            </div>
            <CardDescription>Co powinieneś wiedzieć przed podpisaniem umowy</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                <span>Kluczowe elementy umowy</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                <span>Prawa i obowiązki kredytobiorcy</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                <span>Możliwość wcześniejszej spłaty</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                <span>Konsekwencje opóźnień w spłacie</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <div className="mt-12">
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">Ważne Informacje</h2>
            <div className="space-y-4 text-base text-muted-foreground">
              <p>
                <strong className="text-foreground">Odpowiedzialne pożyczanie:</strong> Pamiętaj, że kredyt to
                zobowiązanie finansowe, które należy spłacać regularnie. Przed złożeniem wniosku upewnij się, że
                jesteś w stanie spłacać raty bez obciążania domowego budżetu.
              </p>
              <p>
                <strong className="text-foreground">Porównywanie ofert:</strong> Zawsze porównuj oferty różnych
                instytucji finansowych. Zwracaj uwagę nie tylko na oprocentowanie, ale także na RRSO, prowizje i
                inne koszty.
              </p>
              <p>
                <strong className="text-foreground">Czytaj umowy:</strong> Przed podpisaniem umowy kredytowej
                dokładnie przeczytaj wszystkie warunki. W razie wątpliwości skonsultuj się z doradcą finansowym lub
                prawnikiem.
              </p>
              <p>
                <strong className="text-foreground">Wsparcie:</strong> Jeśli masz problemy ze spłatą kredytu,
                skontaktuj się z nami jak najszybciej. Wspólnie znajdziemy rozwiązanie.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
