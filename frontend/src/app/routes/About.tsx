import { useTranslation } from "react-i18next"
import { Card, CardContent } from "@/components/ui/card"
import { Shield, TrendingUp, Users, Clock, CheckCircle, Award, Zap, Heart } from "lucide-react"

export default function About() {
  const { t } = useTranslation()

  return (
    <div className="container mx-auto px-6 py-12 max-w-5xl">
      <div className="mb-12 text-center">
        <h1 className="text-5xl font-extrabold text-foreground mb-4">{t("about.title")}</h1>
        <p className="text-xl text-muted-foreground">
          Twoja droga do lepszych finansów zaczyna się tutaj
        </p>
      </div>

      {/* Why We're Good Section */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-foreground mb-8 text-center">
          Dlaczego jesteśmy najlepsi w tym, co robimy
        </h2>

        <div className="space-y-8">
          <Card>
            <CardContent className="p-8">
              <div className="flex items-start gap-4 mb-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Shield className="h-8 w-8 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-foreground mb-3">
                    Bezpieczeństwo i zaufanie na pierwszym miejscu
                  </h3>
                  <p className="text-lg leading-relaxed text-muted-foreground mb-4">
                    W Ascendia bezpieczeństwo Twoich danych finansowych jest naszym absolutnym priorytetem.
                    Wykorzystujemy najnowocześniejsze technologie szyfrowania i przestrzegamy najwyższych
                    standardów bezpieczeństwa w branży finansowej. Nasze systemy są regularnie audytowane
                    przez niezależne firmy bezpieczeństwa, a wszystkie transakcje są chronione zaawansowanymi
                    protokołami SSL. Współpracujemy wyłącznie z renomowanymi bankami partnerskimi, które
                    posiadają licencje Komisji Nadzoru Finansowego, co gwarantuje pełną ochronę Twoich
                    środków. Twoje dane osobowe są przetwarzane zgodnie z RODO, a my nigdy nie udostępniamy
                    informacji o naszych klientach stronom trzecim bez wyraźnej zgody.
                  </p>
                  <p className="text-lg leading-relaxed text-muted-foreground">
                    Nasza platforma została zaprojektowana z myślą o maksymalnym bezpieczeństwie, ale także
                    o wygodzie użytkowania. Każde logowanie jest weryfikowane dwuskładnikowo, a wszystkie
                    operacje finansowe wymagają dodatkowego potwierdzenia. Monitorujemy nasze systemy 24/7,
                    aby natychmiast wykrywać i reagować na jakiekolwiek podejrzane aktywności. W przypadku
                    jakichkolwiek wątpliwości, nasz zespół bezpieczeństwa jest dostępny całodobowo, aby
                    zapewnić Ci pełne wsparcie i spokój ducha.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-8">
              <div className="flex items-start gap-4 mb-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Zap className="h-8 w-8 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-foreground mb-3">
                    Szybkość i efektywność w każdym aspekcie
                  </h3>
                  <p className="text-lg leading-relaxed text-muted-foreground mb-4">
                    W dzisiejszym szybkim świecie, czas ma ogromne znaczenie. Rozumiemy, że gdy potrzebujesz
                    kredytu, nie możesz czekać tygodniami na decyzję. Dlatego stworzyliśmy proces, który
                    pozwala na otrzymanie wstępnej decyzji kredytowej już w ciągu 15 minut od złożenia
                    wniosku. Nasza zaawansowana technologia analizy ryzyka wykorzystuje sztuczną inteligencję
                    i uczenie maszynowe, aby szybko i precyzyjnie ocenić Twoją zdolność kredytową, jednocześnie
                    zapewniając sprawiedliwe i obiektywne decyzje. W przeciwieństwie do tradycyjnych banków,
                    gdzie proces weryfikacji może trwać nawet kilka tygodni, my oferujemy natychmiastową
                    odpowiedź.
                  </p>
                  <p className="text-lg leading-relaxed text-muted-foreground">
                    Cały proces od złożenia wniosku do otrzymania środków może zostać zakończony w ciągu
                    jednego dnia roboczego. Nasza platforma cyfrowa eliminuje potrzebę wizyt w oddziałach,
                    długich kolejek i wypełniania dziesiątek dokumentów. Wszystko można załatwić online,
                    o każdej porze dnia i nocy. Nasz zautomatyzowany system weryfikacji dokumentów potrafi
                    w ciągu sekund zweryfikować autentyczność załączonych plików, co znacznie przyspiesza
                    cały proces. Dla nas szybkość nie oznacza kompromisów w jakości - każda decyzja jest
                    równie dokładna i przemyślana, jak w tradycyjnych instytucjach finansowych.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-8">
              <div className="flex items-start gap-4 mb-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <TrendingUp className="h-8 w-8 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-foreground mb-3">
                    Najlepsze warunki finansowe na rynku
                  </h3>
                  <p className="text-lg leading-relaxed text-muted-foreground mb-4">
                    Dzięki naszym strategicznym partnerstwom z największymi bankami w Polsce, jesteśmy w stanie
                    zaoferować naszym klientom wyjątkowo konkurencyjne oprocentowanie i warunki kredytowe.
                    Negocjujemy specjalne stawki dla naszych klientów, które często są znacznie lepsze niż
                    te dostępne bezpośrednio w bankach. Nasze oprocentowanie zaczyna się już od 5.9% w skali
                    roku, co jest jednym z najlepszych wskaźników na polskim rynku kredytowym. Dodatkowo,
                    nie pobieramy ukrytych opłat, prowizji za wcześniejszą spłatę ani dodatkowych kosztów
                    administracyjnych - wszystko jest przejrzyście przedstawione w umowie.
                  </p>
                  <p className="text-lg leading-relaxed text-muted-foreground">
                    Oferujemy elastyczne warunki spłaty, które można dostosować do Twojej sytuacji finansowej.
                    Możesz wybrać okres kredytowania od 12 do 120 miesięcy, a w razie potrzeby możesz
                    w każdej chwili zmienić wysokość raty lub dokonać wcześniejszej spłaty bez dodatkowych
                    kosztów. Nasze kalkulatory kredytowe pozwalają Ci dokładnie zaplanować budżet i zobaczyć,
                    jak różne opcje wpłyną na Twoje finanse. Wierzymy w transparentność - wszystkie koszty
                    są jasno przedstawione przed podpisaniem umowy, bez żadnych niespodzianek.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-8">
              <div className="flex items-start gap-4 mb-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-foreground mb-3">
                    Wykwalifikowany zespół ekspertów finansowych
                  </h3>
                  <p className="text-lg leading-relaxed text-muted-foreground mb-4">
                    Nasz zespół składa się z doświadczonych doradców finansowych, analityków kredytowych
                    i ekspertów w dziedzinie bankowości, którzy łącznie mają ponad 200 lat doświadczenia
                    w branży finansowej. Każdy członek naszego zespołu przeszedł rygorystyczne szkolenia
                    i posiada odpowiednie certyfikaty oraz licencje. Nasi doradcy nie tylko pomagają
                    w wyborze najlepszego produktu finansowego, ale także oferują kompleksowe wsparcie
                    w zarządzaniu finansami osobistymi. Rozumiemy, że każdy klient ma unikalne potrzeby
                    i sytuację finansową, dlatego podchodzimy indywidualnie do każdego przypadku.
                  </p>
                  <p className="text-lg leading-relaxed text-muted-foreground">
                    Nasze centrum obsługi klienta jest dostępne 7 dni w tygodniu, od 8:00 do 22:00, a w
                    pilnych sprawach także poza tymi godzinami. Możesz skontaktować się z nami telefonicznie,
                    przez czat online, e-mail lub wiadomość w aplikacji. Nasz chatbot wykorzystujący
                    sztuczną inteligencję jest w stanie odpowiedzieć na większość pytań w ciągu sekund,
                    a w przypadku bardziej złożonych kwestii, natychmiast przekierowuje Cię do żywego
                    doradcy. Wierzymy, że doskonała obsługa klienta to fundament długotrwałych relacji
                    i zadowolenia naszych klientów.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-8">
              <div className="flex items-start gap-4 mb-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Award className="h-8 w-8 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-foreground mb-3">
                    Innowacyjność i nowoczesne technologie
                  </h3>
                  <p className="text-lg leading-relaxed text-muted-foreground mb-4">
                    Jesteśmy liderem w wykorzystywaniu najnowszych technologii w sektorze finansowym.
                    Nasza platforma została zbudowana z wykorzystaniem najnowocześniejszych rozwiązań
                    chmurowych, co zapewnia nie tylko bezpieczeństwo, ale także niezawodność i skalowalność.
                    Inwestujemy miliony złotych rocznie w rozwój technologii, aby zapewnić naszym klientom
                    najlepsze możliwe doświadczenie. Nasza aplikacja mobilna została wielokrotnie
                    nagrodzona za innowacyjność i użyteczność, a nasz system zarządzania kredytami
                    wykorzystuje zaawansowane algorytmy uczenia maszynowego do optymalizacji procesów.
                  </p>
                  <p className="text-lg leading-relaxed text-muted-foreground">
                    Ciągle rozwijamy nowe funkcjonalności, które ułatwiają zarządzanie finansami. Nasza
                    platforma oferuje intuicyjne narzędzia do śledzenia wydatków, planowania budżetu
                    i analizy historii transakcji. Wszystkie te funkcje są dostępne w jednym miejscu,
                    co oszczędza czas i ułatwia kontrolę nad finansami. Regularnie aktualizujemy naszą
                    platformę na podstawie feedbacku od klientów, aby upewnić się, że spełniamy ich
                    potrzeby i oczekiwania. Jesteśmy dumni z tego, że możemy oferować rozwiązania, które
                    nie tylko są nowoczesne, ale także naprawdę użyteczne w codziennym życiu.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-foreground mb-8 text-center">
          Dlaczego powinieneś wybrać właśnie nas
        </h2>

        <div className="space-y-8">
          <Card>
            <CardContent className="p-8">
              <div className="flex items-start gap-4 mb-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Heart className="h-8 w-8 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-foreground mb-3">
                    Stawiamy Cię na pierwszym miejscu
                  </h3>
                  <p className="text-lg leading-relaxed text-muted-foreground mb-4">
                    W przeciwieństwie do dużych banków, gdzie jesteś tylko numerem w systemie, w Ascendia
                    traktujemy każdego klienta indywidualnie. Rozumiemy, że każda sytuacja finansowa jest
                    unikalna i wymaga spersonalizowanego podejścia. Nasz zespół poświęca czas, aby dokładnie
                    zrozumieć Twoje potrzeby, cele finansowe i obecną sytuację, aby zaproponować rozwiązanie,
                    które naprawdę będzie dla Ciebie najlepsze. Nie stosujemy szablonowych odpowiedzi ani
                    nie próbujemy sprzedać Ci produktu, którego nie potrzebujesz - naszym celem jest
                    znalezienie optymalnego rozwiązania dla Twojej sytuacji.
                  </p>
                  <p className="text-lg leading-relaxed text-muted-foreground">
                    Słuchamy naszych klientów i ciągle się uczymy. Każda opinia, sugestia czy skarga jest
                    dla nas cenną informacją zwrotną, która pomaga nam się rozwijać i ulepszać nasze
                    usługi. Regularnie przeprowadzamy ankiety satysfakcji, a wyniki tych badań bezpośrednio
                    wpływają na nasze decyzje biznesowe. Wierzymy, że zadowolony klient to najlepsza
                    reklama, dlatego robimy wszystko, aby każda interakcja z nami była pozytywnym
                    doświadczeniem. Nasze podejście oparte na zaufaniu i transparentności buduje długotrwałe
                    relacje, które wykraczają daleko poza jednorazową transakcję.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-8">
              <div className="flex items-start gap-4 mb-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <CheckCircle className="h-8 w-8 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-foreground mb-3">
                    Przejrzystość i uczciwość we wszystkim, co robimy
                  </h3>
                  <p className="text-lg leading-relaxed text-muted-foreground mb-4">
                    W branży finansowej, gdzie często spotykamy się z ukrytymi opłatami i skomplikowanymi
                    warunkami, my stawiamy na pełną transparentność. Wszystkie koszty, opłaty i warunki
                    są jasno przedstawione już na początku procesu - nie ma żadnych niespodzianek ani
                    ukrytych kosztów. Nasze umowy są napisane prostym, zrozumiałym językiem, bez
                    skomplikowanych zapisów prawnych, które mogą być mylące. Wierzymy, że klient ma prawo
                    wiedzieć dokładnie, na co się zgadza, dlatego każdy dokument jest szczegółowo
                    wyjaśniony przez naszego doradcę przed podpisaniem.
                  </p>
                  <p className="text-lg leading-relaxed text-muted-foreground">
                    Nasze kalkulatory kredytowe pokazują dokładnie, ile zapłacisz w różnych scenariuszach,
                    włączając wszystkie opłaty i odsetki. Możesz porównać różne opcje kredytowe i zobaczyć,
                    jak zmiana okresu kredytowania lub wysokości raty wpłynie na całkowity koszt. Nie
                    ukrywamy żadnych informacji - wszystko jest dostępne w Twoim panelu klienta, gdzie
                    możesz w każdej chwili sprawdzić szczegóły swojego kredytu, historię płatności i
                    aktualny stan konta. Ta przejrzystość buduje zaufanie i pozwala Ci podejmować
                    świadome decyzje finansowe.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-8">
              <div className="flex items-start gap-4 mb-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Clock className="h-8 w-8 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-foreground mb-3">
                    Oszczędność czasu i wygoda
                  </h3>
                  <p className="text-lg leading-relaxed text-muted-foreground mb-4">
                    W dzisiejszym zabieganym świecie, czas jest jednym z najcenniejszych zasobów. Rozumiemy,
                    że nie masz czasu na długie wizyty w bankach, czekanie w kolejkach i wypełnianie
                    dziesiątek formularzy. Dlatego stworzyliśmy platformę, która pozwala załatwić wszystko
                    online, w zaledwie kilka minut, o dowolnej porze dnia i nocy. Możesz złożyć wniosek
                    kredytowy podczas przerwy na lunch, w autobusie w drodze do pracy, czy nawet późnym
                    wieczorem w domu. Nasza aplikacja mobilna jest dostępna na wszystkie popularne
                    platformy i oferuje pełną funkcjonalność - wszystko, co możesz zrobić na stronie
                    internetowej, możesz zrobić także w aplikacji.
                  </p>
                  <p className="text-lg leading-relaxed text-muted-foreground">
                    Proces weryfikacji tożsamości odbywa się online poprzez bezpieczne połączenie wideo
                    lub za pomocą zaawansowanego systemu rozpoznawania twarzy. Nie musisz nigdzie jechać
                    ani czekać na wizytę u doradcy - wszystko można załatwić zdalnie, zachowując przy
                    tym pełne bezpieczeństwo. Nasz system automatycznie weryfikuje dokumenty, co
                    eliminuje potrzebę ich fizycznego dostarczania. Po zatwierdzeniu kredytu, środki
                    trafiają na Twoje konto w ciągu kilku godzin, a nie dni czy tygodni, jak w
                    tradycyjnych bankach. Ta wygoda i oszczędność czasu to coś, czego nie znajdziesz
                    w większości tradycyjnych instytucji finansowych.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-8">
              <div className="flex items-start gap-4 mb-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <TrendingUp className="h-8 w-8 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-foreground mb-3">
                    Kompleksowe wsparcie w zarządzaniu finansami
                  </h3>
                  <p className="text-lg leading-relaxed text-muted-foreground mb-4">
                    Nie jesteśmy tylko kolejnym pożyczkodawcą - oferujemy kompleksowe wsparcie w
                    zarządzaniu Twoimi finansami. Nasza platforma oferuje zaawansowane narzędzia do
                    analizy wydatków, planowania budżetu i śledzenia celów finansowych. Możesz ustawić
                    automatyczne oszczędzanie, otrzymywać powiadomienia o zbliżających się terminach
                    płatności i analizować swoje nawyki wydatkowe. Nasze narzędzia wykorzystują
                    sztuczną inteligencję, aby sugerować optymalne strategie oszczędzania i inwestowania,
                    dostosowane do Twojej sytuacji finansowej.
                  </p>
                  <p className="text-lg leading-relaxed text-muted-foreground">
                    Oferujemy również dostęp do edukacyjnych materiałów finansowych, które pomogą Ci
                    lepiej zrozumieć zarządzanie pieniędzmi, inwestowanie i planowanie finansowe.
                    Regularnie organizujemy webinary i warsztaty online, prowadzone przez ekspertów
                    finansowych, które są dostępne bezpłatnie dla naszych klientów. Wierzymy, że
                    edukacja finansowa to klucz do długoterminowego sukcesu finansowego, dlatego
                    inwestujemy w rozwój wiedzy naszych klientów. Naszym celem jest nie tylko
                    udzielenie kredytu, ale także pomoc w budowaniu zdrowej sytuacji finansowej na
                    przyszłość.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-8">
              <div className="flex items-start gap-4 mb-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Shield className="h-8 w-8 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-foreground mb-3">
                    Elastyczność i zrozumienie w trudnych sytuacjach
                  </h3>
                  <p className="text-lg leading-relaxed text-muted-foreground mb-4">
                    Życie bywa nieprzewidywalne, a sytuacje finansowe mogą się zmieniać. Rozumiemy,
                    że mogą zdarzyć się trudne okresy, kiedy spłata raty może być problematyczna.
                    W przeciwieństwie do wielu innych instytucji finansowych, które w takich sytuacjach
                    od razu uruchamiają procedury windykacyjne, my oferujemy elastyczne rozwiązania.
                    Możemy przedłużyć okres kredytowania, zmniejszyć wysokość raty lub wprowadzić
                    okres karencji, jeśli Twoja sytuacja finansowa uległa zmianie. Wierzymy w
                    dialog i znajdowanie rozwiązań, które będą korzystne dla obu stron.
                  </p>
                  <p className="text-lg leading-relaxed text-muted-foreground">
                    Nasz zespół obsługi klienta jest przeszkolony, aby z empatią i zrozumieniem
                    podchodzić do trudnych sytuacji. Jeśli masz problemy ze spłatą, skontaktuj się
                    z nami jak najszybciej - im wcześniej porozmawiamy, tym więcej opcji będziemy
                    mogli zaproponować. Nie stosujemy agresywnych metod windykacyjnych ani nie
                    obciążamy Cię dodatkowymi opłatami za opóźnienia, jeśli wcześniej się z nami
                    skontaktujesz. Naszym celem jest pomoc w rozwiązaniu problemu, a nie jego
                    pogłębianie. Ta elastyczność i zrozumienie to jedna z rzeczy, które wyróżniają
                    nas na tle konkurencji.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Call to Action */}
      <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-2 border-primary/20">
        <CardContent className="p-12 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Gotowy, aby rozpocząć swoją finansową podróż z nami?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Dołącz do tysięcy zadowolonych klientów, którzy wybrali Ascendia jako swojego partnera finansowego.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/register"
              className="px-8 py-4 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors"
            >
              Załóż konto już dziś
            </a>
            <a
              href="/products"
              className="px-8 py-4 bg-transparent border-2 border-primary text-primary rounded-lg font-semibold hover:bg-primary/10 transition-colors"
            >
              Zobacz nasze produkty
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

