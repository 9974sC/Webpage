import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calculator, Info, Sparkles } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, TooltipProps } from "recharts"

interface LoanTemplate {
  name: string
  description: string
  amount: number
  interestRate: number
  durationMonths: number
}

const loanTemplates: LoanTemplate[] = [
  {
    name: "Kredyt samochodowy",
    description: "Średni kredyt na zakup pojazdu",
    amount: 80000,
    interestRate: 7.5,
    durationMonths: 60,
  },
  {
    name: "Kredyt mieszkaniowy",
    description: "Kredyt hipoteczny na zakup nieruchomości",
    amount: 400000,
    interestRate: 5.8,
    durationMonths: 240,
  },
  {
    name: "Kredyt konsumpcyjny",
    description: "Kredyt na dowolny cel",
    amount: 50000,
    interestRate: 8.2,
    durationMonths: 48,
  },
  {
    name: "Kredyt na remont",
    description: "Finansowanie prac remontowych",
    amount: 60000,
    interestRate: 7.0,
    durationMonths: 36,
  },
  {
    name: "Kredyt dla firm",
    description: "Finansowanie działalności gospodarczej",
    amount: 200000,
    interestRate: 6.5,
    durationMonths: 60,
  },
  {
    name: "Kredyt studencki",
    description: "Kredyt na edukację",
    amount: 30000,
    interestRate: 4.5,
    durationMonths: 84,
  },
]

function calculateLoanPayment(
  amount: number,
  interestRate: number,
  durationMonths: number
): { monthlyPayment: number; totalAmount: number; totalInterest: number } {
  if (amount <= 0 || interestRate <= 0 || durationMonths <= 0) {
    return { monthlyPayment: 0, totalAmount: 0, totalInterest: 0 }
  }

  const monthlyRate = interestRate / 100 / 12
  const monthlyPayment =
    (amount * monthlyRate * Math.pow(1 + monthlyRate, durationMonths)) /
    (Math.pow(1 + monthlyRate, durationMonths) - 1)
  const totalAmount = monthlyPayment * durationMonths
  const totalInterest = totalAmount - amount

  return {
    monthlyPayment: Math.round(monthlyPayment * 100) / 100,
    totalAmount: Math.round(totalAmount * 100) / 100,
    totalInterest: Math.round(totalInterest * 100) / 100,
  }
}

function calculateLoanBalanceOverTime(
  amount: number,
  interestRate: number,
  durationMonths: number
): Array<{ month: number; balance: number; monthlyPayment: number; interestDue: number }> {
  if (amount <= 0 || interestRate <= 0 || durationMonths <= 0) {
    return []
  }

  const monthlyRate = interestRate / 100 / 12
  const monthlyPayment =
    (amount * monthlyRate * Math.pow(1 + monthlyRate, durationMonths)) /
    (Math.pow(1 + monthlyRate, durationMonths) - 1)

  const data: Array<{ month: number; balance: number; monthlyPayment: number; interestDue: number }> = []
  let balance = amount
  let cumulativeInterest = 0

  for (let month = 0; month <= durationMonths; month++) {
    if (month === 0) {
      data.push({ 
        month, 
        balance: Math.round(balance * 100) / 100, 
        monthlyPayment: Math.round(monthlyPayment * 100) / 100,
        interestDue: 0
      })
    } else {
      const interestPayment = balance * monthlyRate
      const principalPayment = monthlyPayment - interestPayment
      balance = balance - principalPayment
      cumulativeInterest += interestPayment
      data.push({ 
        month, 
        balance: Math.max(0, Math.round(balance * 100) / 100), 
        monthlyPayment: Math.round(monthlyPayment * 100) / 100,
        interestDue: Math.round(cumulativeInterest * 100) / 100
      })
    }
  }

  return data
}

function calculateCumulativeInterestOverTime(
  amount: number,
  interestRate: number,
  durationMonths: number
): Array<{ month: number; cumulativeInterest: number; totalPaid: number }> {
  if (amount <= 0 || interestRate <= 0 || durationMonths <= 0) {
    return []
  }

  const monthlyRate = interestRate / 100 / 12
  const monthlyPayment =
    (amount * monthlyRate * Math.pow(1 + monthlyRate, durationMonths)) /
    (Math.pow(1 + monthlyRate, durationMonths) - 1)

  const data: Array<{ month: number; cumulativeInterest: number; totalPaid: number }> = []
  let balance = amount
  let cumulativeInterest = 0
  let totalPaid = 0

  for (let month = 0; month <= durationMonths; month++) {
    if (month === 0) {
      data.push({ month, cumulativeInterest: 0, totalPaid: 0 })
    } else {
      const interestPayment = balance * monthlyRate
      const principalPayment = monthlyPayment - interestPayment
      balance = balance - principalPayment
      cumulativeInterest += interestPayment
      totalPaid += monthlyPayment
      data.push({
        month,
        cumulativeInterest: Math.round(cumulativeInterest * 100) / 100,
        totalPaid: Math.round(totalPaid * 100) / 100,
      })
    }
  }

  return data
}

interface LoanScenario {
  name: string
  amount: number
  interestRate: number
  durationMonths: number
  color: string
}

const CustomTooltip = ({ active, payload, label, loanScenarios, chartData }: TooltipProps<number, string> & { loanScenarios: LoanScenario[], chartData: any[] }) => {
  if (active && payload && payload.length) {
    const data = payload[0]
    const dataKey = data.dataKey as string
    const isInterestLine = dataKey.endsWith("_interestDue")
    const scenarioName = isInterestLine ? dataKey.replace("_interestDue", "") : dataKey
    const scenario = loanScenarios.find((s) => s.name === scenarioName)
    const paymentKey = `${scenarioName}_payment`
    const interestDueKey = `${scenarioName}_interestDue`
    const currentData = chartData.find((d) => d.month === label)
    const payment = currentData?.[paymentKey] as number
    const interestDue = currentData?.[interestDueKey] as number
    
    // Don't show tooltip if the month is beyond the loan term
    if (scenario && label > scenario.durationMonths) {
      return null
    }
    
    // Don't show tooltip if value is null
    if (data.value === null || data.value === undefined) {
      return null
    }

    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
        {scenario && (
          <p className="font-semibold mb-1 text-sm">
            {scenario.name} ({scenario.interestRate}%, {scenario.durationMonths} mies.)
          </p>
        )}
        <p className="font-semibold mb-2">{`Miesiąc ${label}`}</p>
        <div className="space-y-1">
          {!isInterestLine && (
            <>
              <div>
                <span className="font-semibold">Pozostała kwota: </span>
                {(data.value as number).toLocaleString("pl-PL", {
                  style: "currency",
                  currency: "PLN",
                  maximumFractionDigits: 0,
                })}
              </div>
              {payment && payment > 0 && (
                <div>
                  <span className="font-semibold">Miesięczna rata: </span>
                  {payment.toLocaleString("pl-PL", {
                    style: "currency",
                    currency: "PLN",
                    maximumFractionDigits: 2,
                  })}
                </div>
              )}
            </>
          )}
          {(isInterestLine || (interestDue !== undefined && interestDue > 0)) && (
            <div>
              <span className="font-semibold">Odsetki do zapłaty: </span>
              {(isInterestLine ? data.value : interestDue).toLocaleString("pl-PL", {
                style: "currency",
                currency: "PLN",
                maximumFractionDigits: 0,
              })}
            </div>
          )}
        </div>
      </div>
    )
  }
  return null
}

const CustomInterestTooltip = ({ active, payload, label, loanScenarios, chartData }: TooltipProps<number, string> & { loanScenarios: LoanScenario[], chartData: any[] }) => {
  if (active && payload && payload.length) {
    const data = payload[0]
    const dataKey = data.dataKey as string
    const isTotalLine = dataKey.endsWith("_total")
    const scenarioName = isTotalLine ? dataKey.replace("_total", "") : dataKey
    const scenario = loanScenarios.find((s) => s.name === scenarioName)
    const totalKey = `${scenarioName}_total`
    const currentData = chartData.find((d) => d.month === label)
    const totalPaid = currentData?.[totalKey] as number
    const interestDue = isTotalLine ? undefined : data.value as number
    
    // Don't show tooltip if the month is beyond the loan term
    if (scenario && label > scenario.durationMonths) {
      return null
    }
    
    // Don't show tooltip if value is null
    if (data.value === null || data.value === undefined) {
      return null
    }
    
    const totalLine = payload.find((p: any) => p.dataKey?.endsWith("_total"))
    const totalAmount = totalLine?.value as number | undefined

    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
        {scenario && (
          <p className="font-semibold mb-1 text-sm">
            {scenario.name} ({scenario.interestRate}%, {scenario.durationMonths} mies.)
          </p>
        )}
        <p className="font-semibold mb-2">{`Miesiąc ${label}`}</p>
        <div className="space-y-1">
          {!isTotalLine && interestDue !== undefined && interestDue > 0 && (
            <div>
              <span className="font-semibold">Odsetki do zapłaty: </span>
              {interestDue.toLocaleString("pl-PL", {
                style: "currency",
                currency: "PLN",
                maximumFractionDigits: 0,
              })}
            </div>
          )}
          {(totalAmount || totalPaid) && (totalAmount || totalPaid)! > 0 && (
            <div>
              <span className="font-semibold">Całkowita spłata: </span>
              {(totalAmount || totalPaid)!.toLocaleString("pl-PL", {
                style: "currency",
                currency: "PLN",
                maximumFractionDigits: 0,
              })}
            </div>
          )}
        </div>
      </div>
    )
  }
  return null
}

const getLoanScenarios = (amount: number, interestRate: number, durationMonths: number): LoanScenario[] => {
  const baseRate = interestRate || 6.5
  
  // Shorter terms get lower rates, longer terms get higher rates
  // Base rate applies to 60 months, adjust up/down from there
  // 0.3% adjustment per year difference from base (60 months)
  const shortTermMonths = 36
  const mediumTermMonths = 60
  const longTermMonths = 120
  
  const shortTermAdjustment = ((shortTermMonths - mediumTermMonths) / 12) * 0.3 // -0.6% for 24 months shorter (2 years)
  const longTermAdjustment = ((longTermMonths - mediumTermMonths) / 12) * 0.3 // +1.5% for 60 months longer (5 years)
  
  const shortTermRate = Math.max(4.5, Math.min(15.0, baseRate + shortTermAdjustment))
  const mediumTermRate = baseRate
  const longTermRate = Math.max(4.5, Math.min(15.0, baseRate + longTermAdjustment))
  
  return [
    {
      name: "Krótki okres (36 mies.)",
      amount: amount || 50000,
      interestRate: shortTermRate,
      durationMonths: 36,
      color: "#8B4513",
    },
    {
      name: "Średni okres (60 mies.)",
      amount: amount || 50000,
      interestRate: mediumTermRate,
      durationMonths: 60,
      color: "#D2691E",
    },
    {
      name: "Długi okres (120 mies.)",
      amount: amount || 50000,
      interestRate: longTermRate,
      durationMonths: 120,
      color: "#CD853F",
    },
  ]
}

export default function SimpleCalculator() {
  const navigate = useNavigate()
  const [amount, setAmount] = useState(50000)
  const [interestRate, setInterestRate] = useState(6.5)
  const [durationMonths, setDurationMonths] = useState(60)
  const [calculation, setCalculation] = useState<{
    monthlyPayment: number
    totalAmount: number
    totalInterest: number
  } | null>(null)

  const loanScenarios = useMemo(() => {
    return getLoanScenarios(amount, interestRate, durationMonths)
  }, [amount, interestRate, durationMonths])

  const chartData = useMemo(() => {
    const maxMonths = Math.max(...loanScenarios.map((s) => s.durationMonths))
    const data: Array<{
      month: number
      [key: string]: number | string | null
    }> = []

    for (let month = 0; month <= maxMonths; month += 6) {
      const point: { month: number; [key: string]: number | string | null } = { month }
      loanScenarios.forEach((scenario) => {
        // Only show data for months within the loan term
        if (month <= scenario.durationMonths) {
          const scenarioData = calculateLoanBalanceOverTime(
            scenario.amount,
            scenario.interestRate,
            scenario.durationMonths
          )
          const monthData = scenarioData.find((d) => d.month === month)
          if (monthData) {
            point[scenario.name] = monthData.balance
            point[`${scenario.name}_payment`] = monthData.monthlyPayment
            point[`${scenario.name}_interestDue`] = monthData.interestDue
          } else {
            // If exact month not found, use the last available data point
            const lastData = scenarioData[scenarioData.length - 1]
            if (lastData) {
              point[scenario.name] = lastData.balance
              point[`${scenario.name}_payment`] = lastData.monthlyPayment
              point[`${scenario.name}_interestDue`] = lastData.interestDue
            }
          }
        } else {
          // Loan term has ended, don't show data for months beyond the term
          point[scenario.name] = null
          point[`${scenario.name}_payment`] = null
          point[`${scenario.name}_interestDue`] = null
        }
      })
      data.push(point)
    }

    return data
  }, [loanScenarios])

  const interestChartData = useMemo(() => {
    const maxMonths = Math.max(...loanScenarios.map((s) => s.durationMonths))
    const data: Array<{
      month: number
      [key: string]: number | string | null
    }> = []

    for (let month = 0; month <= maxMonths; month += 6) {
      const point: { month: number; [key: string]: number | string | null } = { month }
      loanScenarios.forEach((scenario) => {
        // Only show data for months within the loan term
        if (month <= scenario.durationMonths) {
          const scenarioData = calculateCumulativeInterestOverTime(
            scenario.amount,
            scenario.interestRate,
            scenario.durationMonths
          )
          const monthData = scenarioData.find((d) => d.month === month)
          if (monthData) {
            point[scenario.name] = monthData.cumulativeInterest
            point[`${scenario.name}_total`] = monthData.totalPaid
          } else {
            // If exact month not found, use the last available data point
            const lastData = scenarioData[scenarioData.length - 1]
            if (lastData) {
              point[scenario.name] = lastData.cumulativeInterest
              point[`${scenario.name}_total`] = lastData.totalPaid
            }
          }
        } else {
          // Loan term has ended, don't show data for months beyond the term
          point[scenario.name] = null
          point[`${scenario.name}_total`] = null
        }
      })
      data.push(point)
    }

    return data
  }, [loanScenarios])

  const handleCalculate = () => {
    if (amount > 0 && interestRate > 0 && durationMonths > 0) {
      const result = calculateLoanPayment(amount, interestRate, durationMonths)
      setCalculation(result)
    }
  }

  const handleTemplateSelect = (template: LoanTemplate) => {
    setAmount(template.amount)
    setInterestRate(template.interestRate)
    setDurationMonths(template.durationMonths)
    const result = calculateLoanPayment(template.amount, template.interestRate, template.durationMonths)
    setCalculation(result)
  }

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left side - Informative text */}
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <Info className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-foreground">Jak działa kalkulator?</h3>
            </div>
            <div className="space-y-3 text-muted-foreground">
              <p className="leading-relaxed">
                Nasz szybki kalkulator pozwala oszacować miesięczną ratę kredytu bez konieczności logowania. 
                Wystarczy podać trzy podstawowe parametry:
              </p>
              <ul className="space-y-2 list-disc list-inside ml-2">
                <li><strong className="text-foreground">Kwota kredytu</strong> - całkowita suma, którą chcesz pożyczyć</li>
                <li><strong className="text-foreground">Oprocentowanie</strong> - roczna stopa procentowa w %</li>
                <li><strong className="text-foreground">Okres spłaty</strong> - liczba miesięcy, w których spłacisz kredyt</li>
              </ul>
            </div>
          </div>

          <div className="p-4 bg-muted/30 rounded-lg border-2 border-muted-foreground/20">
            <div className="flex items-start gap-3">
              <Sparkles className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <div className="space-y-2">
                <h4 className="font-semibold text-foreground">Wskazówki</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Kalkulator używa standardowej formuły annuitetowej</li>
                  <li>• Wyniki są orientacyjne i mogą różnić się od finalnej oferty</li>
                  <li>• Rzeczywiste oprocentowanie zależy od Twojej zdolności kredytowej</li>
                  <li>• Skorzystaj z gotowych szablonów dla szybkiego obliczenia</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Loan Comparison Graph */}
          <div className="p-4 bg-muted/30 rounded-lg border-2 border-muted-foreground/20">
            <h4 className="font-semibold text-foreground mb-4">Porównanie spłaty kredytu</h4>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    dataKey="month"
                    label={{ value: "Miesiąc", position: "insideBottom", offset: -5 }}
                    stroke="#6b7280"
                  />
                  <YAxis
                    label={{ value: "Kwota (PLN)", angle: -90, position: "insideLeft" }}
                    stroke="#6b7280"
                    tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                  />
                  <Tooltip
                    content={<CustomTooltip loanScenarios={loanScenarios} chartData={chartData} />}
                  />
                  {loanScenarios.map((scenario) => (
                    <Line
                      key={scenario.name}
                      type="monotone"
                      dataKey={scenario.name}
                      stroke={scenario.color}
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 4 }}
                    />
                  ))}
                  {loanScenarios.map((scenario) => (
                    <Line
                      key={`${scenario.name}_interest`}
                      type="monotone"
                      dataKey={`${scenario.name}_interestDue`}
                      stroke={scenario.color}
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      dot={false}
                      activeDot={{ r: 4 }}
                      name={`${scenario.name} - Odsetki`}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Wykres pokazuje pozostałą kwotę do spłaty oraz odsetki do zapłaty w czasie dla różnych okresów i oprocentowania
            </p>
          </div>

          {/* Cumulative Interest Graph */}
          <div className="p-4 bg-muted/30 rounded-lg border-2 border-muted-foreground/20">
            <h4 className="font-semibold text-foreground mb-4">Odsetki do zapłaty w czasie</h4>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={interestChartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    dataKey="month"
                    label={{ value: "Miesiąc", position: "insideBottom", offset: -5 }}
                    stroke="#6b7280"
                  />
                  <YAxis
                    label={{ value: "Kwota (PLN)", angle: -90, position: "insideLeft" }}
                    stroke="#6b7280"
                    tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                  />
                  <Tooltip
                    content={<CustomInterestTooltip loanScenarios={loanScenarios} chartData={interestChartData} />}
                  />
                  {loanScenarios.map((scenario) => (
                    <Line
                      key={scenario.name}
                      type="monotone"
                      dataKey={scenario.name}
                      stroke={scenario.color}
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 4 }}
                    />
                  ))}
                  {loanScenarios.map((scenario) => (
                    <Line
                      key={`${scenario.name}_total`}
                      type="monotone"
                      dataKey={`${scenario.name}_total`}
                      stroke={scenario.color}
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      dot={false}
                      activeDot={{ r: 4 }}
                      hide={true}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Wykres pokazuje odsetki do zapłaty (skumulowane odsetki) w czasie dla różnych okresów i oprocentowania
            </p>
          </div>
        </div>

        {/* Right side - Calculator with templates */}
        <div className="space-y-6">
          <Card className="border-2 border-muted-foreground/20 bg-card">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted">
                  <Calculator className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <CardTitle className="text-xl text-foreground">Szybki kalkulator</CardTitle>
                  <CardDescription className="text-muted-foreground">Oblicz ratę bez logowania</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="simple-amount" className="text-sm font-medium text-muted-foreground">
                  Kwota kredytu (PLN)
                </Label>
                <Input
                  id="simple-amount"
                  type="number"
                  value={amount}
                  onChange={(e) => {
                    const value = Number(e.target.value)
                    if (value >= 1000 && value <= 500000) {
                      setAmount(value)
                    } else if (e.target.value === "") {
                      setAmount(0)
                    }
                  }}
                  min={1000}
                  max={500000}
                  step={1000}
                  className="bg-muted/50 border-muted-foreground/20 text-foreground"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="simple-rate" className="text-sm font-medium text-muted-foreground">
                  Oprocentowanie (%)
                </Label>
                <Input
                  id="simple-rate"
                  type="number"
                  step="0.1"
                  value={interestRate}
                  onChange={(e) => {
                    const value = Number(e.target.value)
                    if (value >= 1 && value <= 30) {
                      setInterestRate(value)
                    } else if (e.target.value === "") {
                      setInterestRate(0)
                    }
                  }}
                  min={1}
                  max={30}
                  className="bg-muted/50 border-muted-foreground/20 text-foreground"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="simple-duration" className="text-sm font-medium text-muted-foreground">
                  Okres spłaty (miesiące)
                </Label>
                <Input
                  id="simple-duration"
                  type="number"
                  value={durationMonths}
                  onChange={(e) => {
                    const value = Number(e.target.value)
                    if (value >= 6 && value <= 120) {
                      setDurationMonths(value)
                    } else if (e.target.value === "") {
                      setDurationMonths(0)
                    }
                  }}
                  min={6}
                  max={120}
                  className="bg-muted/50 border-muted-foreground/20 text-foreground"
                />
              </div>

              <Button 
                onClick={handleCalculate} 
                className="w-full bg-muted-foreground hover:bg-muted-foreground/90 text-muted" 
                size="lg"
              >
                Oblicz ratę
              </Button>

              {calculation && calculation.monthlyPayment > 0 && (
                <div className="mt-4 p-4 bg-muted/30 rounded-lg border-2 border-muted-foreground/20 space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Miesięczna rata</p>
                    <p className="text-2xl font-extrabold text-foreground">
                      {calculation.monthlyPayment.toLocaleString("pl-PL", {
                        style: "currency",
                        currency: "PLN",
                      })}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-muted-foreground">Całkowita kwota</p>
                      <p className="font-semibold text-foreground">
                        {calculation.totalAmount.toLocaleString("pl-PL", {
                          style: "currency",
                          currency: "PLN",
                        })}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Odsetki</p>
                      <p className="font-semibold text-foreground">
                        {calculation.totalInterest.toLocaleString("pl-PL", {
                          style: "currency",
                          currency: "PLN",
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Templates section */}
          <div className="space-y-3">
            <h4 className="text-lg font-semibold text-foreground">Gotowe szablony</h4>
            <p className="text-sm text-muted-foreground mb-3">
              Wybierz jeden z gotowych szablonów, aby szybko wypełnić kalkulator
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {loanTemplates.map((template, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="h-auto p-4 flex flex-col items-start justify-start text-left hover:bg-muted/50 transition-colors"
                  onClick={() => handleTemplateSelect(template)}
                >
                  <div className="font-semibold text-foreground mb-1">{template.name}</div>
                  <div className="text-xs text-muted-foreground mb-2">{template.description}</div>
                  <div className="text-xs text-muted-foreground space-y-0.5">
                    <div>{template.amount.toLocaleString("pl-PL")} PLN</div>
                    <div>{template.interestRate}% / {template.durationMonths} mies.</div>
                  </div>
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
