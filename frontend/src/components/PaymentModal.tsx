import { useState, useEffect } from "react"
import { X, Building2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTranslation } from "react-i18next"

interface PaymentModalProps {
  isOpen: boolean
  onClose: () => void
  amount: number
  referenceNumber: string
  onPaymentMethodSelect?: (method: string) => void
}

const paymentMethods = [
  { id: "blik", name: "BLIK", logo: "BLIK" },
  { id: "mbank", name: "mBank mTRANSFER", logo: "mBank" },
  { id: "ipko", name: "płacę z iPKO", logo: "iPKO" },
  { id: "santander", name: "Santander Przelew24", logo: "Santander" },
  { id: "ing", name: "PŁACĘ Z ING", logo: "ING" },
  { id: "pekao", name: "Bank Pekao", logo: "Pekao" },
  { id: "alior", name: "ALIOR BANK", logo: "Alior" },
  { id: "inteligo", name: "inteligo", logo: "Inteligo" },
  { id: "credit-agricole", name: "CRÉDIT AGRICOLE", logo: "CA" },
  { id: "citi", name: "płacę z citi handlowy", logo: "Citi" },
  { id: "velo", name: "VELO Bank", logo: "Velo" },
  { id: "bnp", name: "BNP PARIBAS", logo: "BNP" },
  { id: "bos", name: "BOS BANK", logo: "BOS" },
  { id: "pocztowy", name: "Pocztowy 24", logo: "Pocztowy" },
  { id: "plus", name: "plus bank", logo: "Plus" },
  { id: "nowy", name: "BANK NOWY S.A.", logo: "Nowy" },
  { id: "toyota", name: "Toyota Financial Services", logo: "Toyota" },
  { id: "spoldzielcze", name: "Banki Spółdzielcze", logo: "Spółdzielcze" },
  { id: "millennium", name: "Millennium Bank", logo: "Millennium" },
]

export default function PaymentModal({
  isOpen,
  onClose,
  amount,
  referenceNumber,
  onPaymentMethodSelect,
}: PaymentModalProps) {
  const { t } = useTranslation()
  const [selectedMethod, setSelectedMethod] = useState<string>("blik")

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEscape)
      document.body.style.overflow = "hidden"
    }

    return () => {
      document.removeEventListener("keydown", handleEscape)
      document.body.style.overflow = "unset"
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const handleMethodSelect = (methodId: string) => {
    setSelectedMethod(methodId)
    if (onPaymentMethodSelect) {
      onPaymentMethodSelect(methodId)
    }
  }

  const handleAbort = () => {
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose()
        }
      }}
    >
      <div className="relative bg-card border-2 border-border rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full hover:bg-muted transition-colors"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex flex-col md:flex-row h-full max-h-[90vh]">
          {/* Left Sidebar */}
          <div className="bg-muted/30 border-r-2 border-border p-6 min-w-[200px]">
            <div className="space-y-4">
              {/* Payment Category */}
              <div className="flex items-center gap-3 mb-6">
                <Building2 className="h-6 w-6 text-muted-foreground" />
                <span className="font-semibold text-foreground">Przelewy online</span>
              </div>

              {/* Selected Method */}
              <div
                className={`p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                  selectedMethod === "blik"
                    ? "border-primary bg-primary/10"
                    : "border-border hover:bg-muted/50"
                }`}
                onClick={() => handleMethodSelect("blik")}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-foreground rounded flex items-center justify-center">
                    <span className="text-xs font-bold text-background">BLIK</span>
                  </div>
                  <span className="font-medium text-foreground">BLIK</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b-2 border-border">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">DO ZAPŁATY</p>
                  <p className="text-3xl font-extrabold text-foreground">
                    {amount.toLocaleString("pl-PL", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}{" "}
                    PLN
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Numer referencyjny</p>
                  <p className="text-lg font-semibold text-foreground">{referenceNumber}</p>
                </div>
              </div>
            </div>

            {/* Payment Methods Grid */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {paymentMethods.map((method) => (
                  <button
                    key={method.id}
                    onClick={() => handleMethodSelect(method.id)}
                    className={`p-4 border-2 rounded-lg hover:bg-muted/50 transition-colors text-left ${
                      selectedMethod === method.id
                        ? "border-primary bg-primary/10"
                        : "border-border"
                    }`}
                  >
                    <div className="flex flex-col items-center justify-center gap-2 min-h-[80px]">
                      <div className="w-12 h-12 bg-muted rounded flex items-center justify-center">
                        <span className="text-xs font-semibold text-foreground">
                          {method.logo}
                        </span>
                      </div>
                      <span className="text-xs font-medium text-foreground text-center">
                        {method.name}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Footer with Abort Button */}
            <div className="p-6 border-t-2 border-border bg-muted/30">
              <div className="flex justify-end gap-4">
                <Button
                  variant="outline"
                  onClick={handleAbort}
                  className="border-red-500/50 text-red-600 hover:bg-red-500/10 hover:border-red-500"
                >
                  Anuluj płatność
                </Button>
                <Button
                  onClick={() => {
                    if (onPaymentMethodSelect) {
                      onPaymentMethodSelect(selectedMethod)
                    }
                    onClose()
                  }}
                  className="bg-primary hover:bg-primary/90"
                >
                  Kontynuuj z {paymentMethods.find((m) => m.id === selectedMethod)?.name}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
