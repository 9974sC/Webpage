import { Card, CardContent } from "@/components/ui/card"
import { Shield, FileText, Lock, Eye, Trash2, CheckCircle } from "lucide-react"

export default function Gdpr() {
  return (
    <div className="container mx-auto px-6 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-4">RODO - Ochrona Danych Osobowych</h1>
        <p className="text-lg text-muted-foreground">
          Informacje dotyczące przetwarzania danych osobowych zgodnie z Rozporządzeniem RODO
        </p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardContent className="p-8">
            <div className="flex items-start gap-4 mb-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 shrink-0">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-2">Administrator Danych</h2>
                <p className="text-base text-muted-foreground leading-relaxed">
                  Administratorem danych osobowych jest <strong>Ascendia Sp. z o.o.</strong> z siedzibą w Warszawie,
                  ul. Przykładowa 123, 00-000 Warszawa, wpisana do rejestru przedsiębiorców KRS pod numerem 0000000000.
                </p>
                <p className="mt-4 text-base text-muted-foreground leading-relaxed">
                  W sprawach związanych z ochroną danych osobowych można kontaktować się z nami:
                </p>
                <ul className="mt-2 space-y-1 text-base text-muted-foreground list-disc list-inside">
                  <li>Email: rodo@ascendia.pl</li>
                  <li>Telefon: +48 800 123 456</li>
                  <li>Adres: ul. Przykładowa 123, 00-000 Warszawa</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-8">
            <div className="flex items-start gap-4 mb-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 shrink-0">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-2">Cele Przetwarzania Danych</h2>
                <p className="text-base text-muted-foreground leading-relaxed mb-4">
                  Przetwarzamy dane osobowe w następujących celach:
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                    <div>
                      <strong className="text-foreground">Realizacja usług finansowych</strong>
                      <p className="text-sm text-muted-foreground mt-1">
                        Przetwarzanie wniosków kredytowych, weryfikacja zdolności kredytowej, zawieranie i wykonywanie
                        umów kredytowych
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                    <div>
                      <strong className="text-foreground">Wypełnienie obowiązków prawnych</strong>
                      <p className="text-sm text-muted-foreground mt-1">
                        Zgodność z przepisami prawa bankowego, ustawy o kredycie konsumenckim oraz innych przepisów
                        obowiązujących w Polsce
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                    <div>
                      <strong className="text-foreground">Marketing i promocja</strong>
                      <p className="text-sm text-muted-foreground mt-1">
                        Przesyłanie informacji o produktach i usługach (za zgodą użytkownika)
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                    <div>
                      <strong className="text-foreground">Obsługa klienta</strong>
                      <p className="text-sm text-muted-foreground mt-1">
                        Odpowiadanie na zapytania, rozwiązywanie problemów, świadczenie wsparcia technicznego
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-8">
            <div className="flex items-start gap-4 mb-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 shrink-0">
                <Lock className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-2">Podstawa Prawna Przetwarzania</h2>
                <p className="text-base text-muted-foreground leading-relaxed mb-4">
                  Przetwarzamy dane osobowe na podstawie:
                </p>
                <ul className="space-y-2 text-base text-muted-foreground list-disc list-inside">
                  <li>Art. 6 ust. 1 lit. b RODO - wykonanie umowy</li>
                  <li>Art. 6 ust. 1 lit. c RODO - wypełnienie obowiązku prawnego</li>
                  <li>Art. 6 ust. 1 lit. a RODO - zgoda osoby, której dane dotyczą</li>
                  <li>Art. 6 ust. 1 lit. f RODO - prawnie uzasadniony interes administratora</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-8">
            <div className="flex items-start gap-4 mb-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 shrink-0">
                <Eye className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-2">Prawa Użytkownika</h2>
                <p className="text-base text-muted-foreground leading-relaxed mb-4">
                  Zgodnie z RODO, przysługują Państwu następujące prawa:
                </p>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="p-4 bg-primary/5 rounded-lg">
                    <h3 className="font-semibold text-foreground mb-2">Prawo dostępu</h3>
                    <p className="text-sm text-muted-foreground">
                      Możliwość uzyskania informacji o przetwarzanych danych osobowych
                    </p>
                  </div>
                  <div className="p-4 bg-primary/5 rounded-lg">
                    <h3 className="font-semibold text-foreground mb-2">Prawo do sprostowania</h3>
                    <p className="text-sm text-muted-foreground">
                      Możliwość żądania poprawienia nieprawidłowych lub uzupełnienia niekompletnych danych
                    </p>
                  </div>
                  <div className="p-4 bg-primary/5 rounded-lg">
                    <h3 className="font-semibold text-foreground mb-2">Prawo do usunięcia</h3>
                    <p className="text-sm text-muted-foreground">
                      Możliwość żądania usunięcia danych w określonych sytuacjach
                    </p>
                  </div>
                  <div className="p-4 bg-primary/5 rounded-lg">
                    <h3 className="font-semibold text-foreground mb-2">Prawo do ograniczenia</h3>
                    <p className="text-sm text-muted-foreground">
                      Możliwość żądania ograniczenia przetwarzania danych
                    </p>
                  </div>
                  <div className="p-4 bg-primary/5 rounded-lg">
                    <h3 className="font-semibold text-foreground mb-2">Prawo do przenoszenia</h3>
                    <p className="text-sm text-muted-foreground">
                      Możliwość otrzymania danych w ustrukturyzowanym formacie
                    </p>
                  </div>
                  <div className="p-4 bg-primary/5 rounded-lg">
                    <h3 className="font-semibold text-foreground mb-2">Prawo do sprzeciwu</h3>
                    <p className="text-sm text-muted-foreground">
                      Możliwość wniesienia sprzeciwu wobec przetwarzania danych
                    </p>
                  </div>
                </div>
                <p className="mt-6 text-base text-muted-foreground leading-relaxed">
                  Aby skorzystać z powyższych praw, należy skontaktować się z nami na adres:{" "}
                  <strong>rodo@ascendia.pl</strong>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-8">
            <div className="flex items-start gap-4 mb-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 shrink-0">
                <Trash2 className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-2">Okres Przechowywania Danych</h2>
                <p className="text-base text-muted-foreground leading-relaxed mb-4">
                  Dane osobowe przechowujemy przez okres niezbędny do:
                </p>
                <ul className="space-y-2 text-base text-muted-foreground list-disc list-inside">
                  <li>Wykonania umowy kredytowej oraz przez okres wymagany przepisami prawa (zwykle 5-10 lat)</li>
                  <li>Wypełnienia obowiązków prawnych wynikających z przepisów podatkowych i rachunkowych</li>
                  <li>Do czasu wycofania zgody na przetwarzanie danych w celach marketingowych</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-8">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 shrink-0">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-2">Bezpieczeństwo Danych</h2>
                <p className="text-base text-muted-foreground leading-relaxed mb-4">
                  Stosujemy odpowiednie środki techniczne i organizacyjne zapewniające bezpieczeństwo danych
                  osobowych, w tym:
                </p>
                <ul className="space-y-2 text-base text-muted-foreground list-disc list-inside">
                  <li>Szyfrowanie połączeń (SSL/TLS)</li>
                  <li>Regularne kopie zapasowe danych</li>
                  <li>Ograniczony dostęp do danych tylko dla upoważnionych pracowników</li>
                  <li>Regularne audyty bezpieczeństwa</li>
                  <li>Systemy monitoringu i wykrywania naruszeń</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">Prawo do Skargi</h2>
            <p className="text-base text-muted-foreground leading-relaxed">
              Przysługuje Państwu prawo wniesienia skargi do organu nadzorczego - Prezesa Urzędu Ochrony Danych
              Osobowych (UODO), jeśli uznają Państwo, że przetwarzanie danych osobowych narusza przepisy RODO.
            </p>
            <p className="mt-4 text-base text-muted-foreground">
              <strong>Kontakt do UODO:</strong>
              <br />
              ul. Stawki 2, 00-193 Warszawa
              <br />
              Tel: 22 531 03 00
              <br />
              Email: kancelaria@uodo.gov.pl
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
