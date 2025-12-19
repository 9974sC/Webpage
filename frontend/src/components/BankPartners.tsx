import { Card, CardContent } from "@/components/ui/card"
import { Building2, Shield, TrendingUp, Users } from "lucide-react"

interface BankInfo {
  name: string
  logo: string
  description: string
  partnership: string
  icon: React.ReactNode
}

const banks: BankInfo[] = [
  {
    name: "PKO Bank Polski",
    logo: "🏦",
    description: "Największy bank w Polsce z ponad 100-letnią tradycją. Oferuje kompleksowe usługi bankowe dla klientów indywidualnych i firmowych.",
    partnership: "Współpracujemy z PKO BP przy kredytach gotówkowych i konsolidacyjnych. Nasi klienci mogą skorzystać z preferencyjnych warunków i szybkiej decyzji kredytowej.",
    icon: <Building2 className="h-6 w-6" />,
  },
  {
    name: "mBank",
    logo: "💳",
    description: "Nowoczesny bank cyfrowy, lider w innowacjach technologicznych. Specjalizuje się w bankowości online i mobilnej.",
    partnership: "Dzięki partnerstwu z mBankiem oferujemy naszym klientom dostęp do zaawansowanych narzędzi finansowych i elastycznych rozwiązań kredytowych.",
    icon: <TrendingUp className="h-6 w-6" />,
  },
  {
    name: "Santander Bank Polska",
    logo: "🏛️",
    description: "Część międzynarodowej grupy Santander. Oferuje szeroki zakres produktów bankowych i ubezpieczeniowych.",
    partnership: "Współpracujemy z Santander przy kredytach hipotecznych i konsolidacyjnych. Nasi klienci otrzymują wsparcie na każdym etapie procesu.",
    icon: <Shield className="h-6 w-6" />,
  },
  {
    name: "ING Bank Śląski",
    logo: "🦁",
    description: "Jeden z największych banków w Polsce, znany z innowacyjnych rozwiązań i przyjaznego podejścia do klienta.",
    partnership: "Partnerstwo z ING pozwala nam oferować konkurencyjne oprocentowanie i szybkie procedury weryfikacyjne dla naszych klientów.",
    icon: <Users className="h-6 w-6" />,
  },
  {
    name: "Bank Pekao",
    logo: "🏢",
    description: "Drugi co do wielkości bank w Polsce. Oferuje pełną gamę produktów finansowych dla klientów indywidualnych i biznesowych.",
    partnership: "Współpracujemy z Bankiem Pekao przy kredytach gotówkowych. Nasi klienci mogą liczyć na profesjonalne doradztwo i wsparcie.",
    icon: <Building2 className="h-6 w-6" />,
  },
  {
    name: "Alior Bank",
    logo: "⭐",
    description: "Dynamiczny bank zorientowany na klienta. Specjalizuje się w nowoczesnych rozwiązaniach finansowych i szybkiej obsłudze.",
    partnership: "Dzięki partnerstwu z Alior Bankiem oferujemy naszym klientom szybkie decyzje kredytowe i elastyczne warunki spłaty.",
    icon: <TrendingUp className="h-6 w-6" />,
  },
  {
    name: "Bank Millennium",
    logo: "🌐",
    description: "Nowoczesny bank z portugalskim kapitałem. Oferuje innowacyjne produkty finansowe i wysokiej jakości obsługę klienta.",
    partnership: "Współpracujemy z Bankiem Millennium przy kredytach konsolidacyjnych. Nasi klienci otrzymują wsparcie w uproszczeniu swoich finansów.",
    icon: <Shield className="h-6 w-6" />,
  },
  {
    name: "Getin Bank",
    logo: "💼",
    description: "Bank oferujący szeroki zakres produktów finansowych. Skupia się na indywidualnym podejściu do każdego klienta.",
    partnership: "Partnerstwo z Getin Bankiem pozwala nam oferować naszym klientom atrakcyjne warunki kredytowe i profesjonalne doradztwo finansowe.",
    icon: <Users className="h-6 w-6" />,
  },
]

export default function BankPartners() {
  return (
    <section className="container mx-auto px-6 py-20 md:py-32">
      <div className="mb-16 text-center">
        <h2 className="mb-4 text-balance text-4xl font-bold text-foreground md:text-5xl">
          Nasi partnerzy bankowi
        </h2>
        <p className="text-balance text-lg text-muted-foreground md:text-xl">
          Współpracujemy z największymi bankami w Polsce, aby zapewnić Ci najlepsze warunki
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {banks.map((bank, index) => (
          <Card
            key={index}
            className="group border-2 transition-calm hover:border-primary/50 hover:shadow-lg"
          >
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center mb-4">
                <div className="text-5xl mb-3">{bank.logo}</div>
                <h3 className="text-xl font-bold text-foreground mb-2 break-words">{bank.name}</h3>
              </div>

              <div className="group-hover:hidden">
                <p className="text-sm text-muted-foreground break-words leading-relaxed">{bank.description}</p>
              </div>

              <div className="hidden group-hover:block">
                <div className="flex items-center justify-center mb-4 text-primary">
                  {bank.icon}
                </div>
                <p className="text-sm text-foreground mb-3 leading-relaxed break-words">{bank.description}</p>
                <div className="mt-4 pt-4 border-t-2 border-primary/20">
                  <p className="text-xs font-semibold text-primary mb-2">Nasza współpraca:</p>
                  <p className="text-xs text-muted-foreground leading-relaxed break-words">{bank.partnership}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
