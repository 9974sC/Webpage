import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calculator, CheckCircle, TrendingUp, DollarSign, Calendar } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, TooltipProps } from "recharts"

interface QuestionnaireData {
  firstName: string
  lastName: string
  age: string
  maritalStatus: string
  city: string
  monthlyIncome: number
  monthlyExpenses: number
  employmentType: string
  employmentDuration: string
  currentDebts: number
  loanAmount: number
  loanPurpose: string
  preferredDuration: string
}

interface PaymentPlan {
  durationMonths: number
  monthlyPayment: number
  totalAmount: number
  totalInterest: number
  interestRate: number
}

interface LoanCalculatorProps {
  questionnaireData?: QuestionnaireData
}

function calculateLoanPayment(
  amount: number,
  interestRate: number,
  durationMonths: number
): { monthlyPayment: number; totalAmount: number; totalInterest: number } {
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

// Calculate interest rate based on financial data
function calculateInterestRate(data: QuestionnaireData): number {
  let baseRate = 5.9 // Base rate
  
  // Adjust based on income
  const incomeRatio = data.monthlyIncome / 10000
  if (incomeRatio < 0.5) baseRate += 2.0
  else if (incomeRatio < 1) baseRate += 1.0
  else if (incomeRatio > 2) baseRate -= 0.5
  
  // Adjust based on employment
  if (data.employmentType === "umowa-o-prace") baseRate -= 0.5
  else if (data.employmentType === "dzialalnosc-gospodarcza") baseRate += 0.5
  else if (data.employmentType === "umowa-zlecenie" || data.employmentType === "umowa-o-dzielo") baseRate += 1.0
  
  // Adjust based on employment duration
  if (data.employmentDuration === "60+") baseRate -= 0.3
  else if (data.employmentDuration === "0-6") baseRate += 1.5
  
  // Adjust based on debt-to-income ratio
  const debtRatio = data.currentDebts / (data.monthlyIncome * 12)
  if (debtRatio > 0.5) baseRate += 1.5
  else if (debtRatio > 0.3) baseRate += 0.8
  
  // Adjust based on available income
  const availableIncome = data.monthlyIncome - data.monthlyExpenses
  const loanToIncomeRatio = (data.loanAmount / (availableIncome * 12)) * 100
  if (loanToIncomeRatio > 80) baseRate += 1.0
  else if (loanToIncomeRatio < 30) baseRate -= 0.5
  
  // Ensure rate is within reasonable bounds
  return Math.max(4.5, Math.min(15.0, baseRate))
}

// Generate payment plans with higher rates for longer terms
function generatePaymentPlans(amount: number, baseInterestRate: number): PaymentPlan[] {
  const plans: PaymentPlan[] = []
  const durations = [12, 24, 36, 48, 60, 72, 84, 96, 108, 120]
  
  durations.forEach((duration) => {
    // Longer terms get higher interest rates (more risk for lender)
    // Base rate applies to 60 months, adjust up/down from there
    const monthsFromBase = duration - 60
    const rateAdjustment = (monthsFromBase / 12) * 0.3 // 0.3% per year difference
    const adjustedRate = baseInterestRate + rateAdjustment
    
    const result = calculateLoanPayment(amount, adjustedRate, duration)
    plans.push({
      durationMonths: duration,
      monthlyPayment: result.monthlyPayment,
      totalAmount: result.totalAmount,
      totalInterest: result.totalInterest,
      interestRate: adjustedRate,
    })
  })
  
  return plans
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

const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    const data = payload[0]
    const dataKey = data.dataKey as string
    const isInterestLine = dataKey === "interestDue"
    const payloadData = data.payload as any
    const interestDue = payloadData?.interestDue as number | undefined
    
    return (
      <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
        <p className="font-semibold mb-2">{`Miesiąc ${label}`}</p>
        <div className="space-y-1">
          {!isInterestLine && (
            <div>
              <span className="font-semibold">Pozostała kwota: </span>
              {(data.value as number).toLocaleString("pl-PL", {
                style: "currency",
                currency: "PLN",
                maximumFractionDigits: 0,
              })}
            </div>
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

const CustomInterestTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    const data = payload[0]
    const dataKey = data.dataKey as string
    const isTotalLine = dataKey === "totalPaid"
    const payloadData = data.payload as any
    const totalPaid = payloadData?.totalPaid as number | undefined
    const interestDue = isTotalLine ? undefined : data.value as number
    
    const totalLine = payload.find((p: any) => p.dataKey === "totalPaid")
    const totalAmount = totalLine?.value as number | undefined
    
    return (
      <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
        <p className="font-semibold mb-2">{`Miesiąc ${label}`}</p>
        <div className="space-y-1">
          {!isTotalLine && interestDue !== undefined && (
            <div>
              <span className="font-semibold">Odsetki do zapłaty: </span>
              {interestDue.toLocaleString("pl-PL", {
                style: "currency",
                currency: "PLN",
                maximumFractionDigits: 0,
              })}
            </div>
          )}
          {(totalAmount || totalPaid) && (
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

export default function LoanCalculator({ questionnaireData }: LoanCalculatorProps) {
  const [amount, setAmount] = useState(questionnaireData?.loanAmount || 50000)
  const [interestRate, setInterestRate] = useState(6.5)
  const [durationMonths, setDurationMonths] = useState(60)
  const [calculation, setCalculation] = useState<{
    monthlyPayment: number
    totalAmount: number
    totalInterest: number
  } | null>(null)
  const [selectedPlan, setSelectedPlan] = useState<PaymentPlan | null>(null)
  const [paymentPlans, setPaymentPlans] = useState<PaymentPlan[]>([])

  useEffect(() => {
    if (questionnaireData) {
      const calculatedRate = calculateInterestRate(questionnaireData)
      setInterestRate(calculatedRate)
      setAmount(questionnaireData.loanAmount)
      const plans = generatePaymentPlans(questionnaireData.loanAmount, calculatedRate)
      setPaymentPlans(plans)
      
      // Pre-select a plan based on preferred duration
      const preferredMap: Record<string, number> = {
        "12-24 miesiące": 24,
        "24-36 miesięcy": 36,
        "36-60 miesięcy": 60,
        "60-120 miesięcy": 96,
      }
      const preferredMonths = preferredMap[questionnaireData.preferredDuration] || 60
      const preSelected = plans.find(p => p.durationMonths === preferredMonths) || plans[4]
      setSelectedPlan(preSelected)
      setDurationMonths(preSelected.durationMonths)
      setCalculation({
        monthlyPayment: preSelected.monthlyPayment,
        totalAmount: preSelected.totalAmount,
        totalInterest: preSelected.totalInterest,
      })
    }
  }, [questionnaireData])

  const handleCalculate = () => {
    const result = calculateLoanPayment(amount, interestRate, durationMonths)
    setCalculation(result)
  }

  const handlePlanSelect = (plan: PaymentPlan) => {
    setSelectedPlan(plan)
    setDurationMonths(plan.durationMonths)
    setCalculation({
      monthlyPayment: plan.monthlyPayment,
      totalAmount: plan.totalAmount,
      totalInterest: plan.totalInterest,
    })
  }

  const availableIncome = questionnaireData 
    ? questionnaireData.monthlyIncome - questionnaireData.monthlyExpenses 
    : 0

  const balanceChartData = useMemo(() => {
    if (!calculation || !amount || !interestRate || !durationMonths) return []
    const data = calculateLoanBalanceOverTime(amount, interestRate, durationMonths)
    return data.filter((_, index) => index % 6 === 0 || index === data.length - 1)
  }, [calculation, amount, interestRate, durationMonths])

  const interestChartData = useMemo(() => {
    if (!calculation || !amount || !interestRate || !durationMonths) return []
    const data = calculateCumulativeInterestOverTime(amount, interestRate, durationMonths)
    return data.filter((_, index) => index % 6 === 0 || index === data.length - 1)
  }, [calculation, amount, interestRate, durationMonths])

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      {/* Summary Card */}
      {questionnaireData && (
        <Card className="border-2 border-muted-foreground/20 bg-muted/20">
          <CardHeader>
            <CardTitle className="text-xl text-foreground">Podsumowanie Twoich odpowiedzi</CardTitle>
            <CardDescription className="text-muted-foreground">Sprawdź wprowadzone dane przed wyborem planu</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-4 bg-muted/30 rounded-lg border-2 border-muted-foreground/20">
                <p className="text-sm text-muted-foreground mb-1">Dane osobowe</p>
                <p className="font-semibold text-foreground">{questionnaireData.firstName} {questionnaireData.lastName}</p>
                <p className="text-sm text-muted-foreground">{questionnaireData.age}, {questionnaireData.maritalStatus}</p>
                <p className="text-sm text-muted-foreground">{questionnaireData.city}</p>
              </div>
              <div className="p-4 bg-muted/30 rounded-lg border-2 border-muted-foreground/20">
                <p className="text-sm text-muted-foreground mb-1">Sytuacja finansowa</p>
                <p className="font-semibold text-foreground">Dochód: {questionnaireData.monthlyIncome.toLocaleString("pl-PL")} PLN/mies.</p>
                <p className="text-sm text-foreground">Wydatki: {questionnaireData.monthlyExpenses.toLocaleString("pl-PL")} PLN/mies.</p>
                <p className="text-sm text-foreground font-semibold">
                  Dostępne: {availableIncome.toLocaleString("pl-PL")} PLN/mies.
                </p>
              </div>
              <div className="p-4 bg-muted/30 rounded-lg border-2 border-muted-foreground/20">
                <p className="text-sm text-muted-foreground mb-1">Zatrudnienie</p>
                <p className="font-semibold text-foreground">{questionnaireData.employmentType.replace(/-/g, " ")}</p>
                <p className="text-sm text-foreground">Okres: {questionnaireData.employmentDuration}</p>
                {questionnaireData.currentDebts > 0 && (
                  <p className="text-sm text-muted-foreground mt-1">
                    Zobowiązania: {questionnaireData.currentDebts.toLocaleString("pl-PL")} PLN
                  </p>
                )}
              </div>
              <div className="p-4 bg-muted/30 rounded-lg border-2 border-muted-foreground/20">
                <p className="text-sm text-muted-foreground mb-1">Kredyt</p>
                <p className="font-semibold text-lg text-foreground">{questionnaireData.loanAmount.toLocaleString("pl-PL")} PLN</p>
                <p className="text-sm text-foreground">Cel: {questionnaireData.loanPurpose.replace(/-/g, " ")}</p>
                <p className="text-sm text-foreground">Preferowany okres: {questionnaireData.preferredDuration}</p>
              </div>
              <div className="p-4 bg-muted/30 rounded-lg border-2 border-muted-foreground/20">
                <p className="text-sm text-muted-foreground mb-1">Zaproponowane oprocentowanie</p>
                <p className="font-semibold text-2xl text-foreground">{interestRate.toFixed(2)}%</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Na podstawie Twojej sytuacji finansowej
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Calculator */}
        <div className="lg:col-span-2">
          <Card className="border-2 border-muted-foreground/20 bg-card">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted">
                  <Calculator className="h-6 w-6 text-muted-foreground" />
                </div>
                <div>
                  <CardTitle className="text-2xl text-foreground">Kalkulator kredytowy</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    {questionnaireData 
                      ? "Spersonalizowana oferta na podstawie Twoich danych"
                      : "Sprawdź swoją ratę w kilka sekund"}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="calc-amount" className="text-sm font-medium text-muted-foreground">
                  Kwota kredytu (PLN)
                </Label>
                <Input
                  id="calc-amount"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  min={1000}
                  max={500000}
                  step={1000}
                  className="bg-muted/50 border-muted-foreground/20 text-foreground"
                  disabled={!!questionnaireData}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="calc-rate" className="text-sm font-medium text-muted-foreground">
                  Oprocentowanie (%)
                </Label>
                <Input
                  id="calc-rate"
                  type="number"
                  step="0.1"
                  value={interestRate.toFixed(2)}
                  onChange={(e) => setInterestRate(Number(e.target.value))}
                  min={1}
                  max={30}
                  className="bg-muted/50 border-muted-foreground/20 text-foreground"
                  disabled={!!questionnaireData}
                />
                {questionnaireData && (
                  <p className="text-xs text-muted-foreground">
                    Oprocentowanie obliczone na podstawie Twoich danych finansowych
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="calc-duration" className="text-sm font-medium text-muted-foreground">
                  Okres spłaty (miesiące)
                </Label>
                <Input
                  id="calc-duration"
                  type="number"
                  value={durationMonths}
                  onChange={(e) => setDurationMonths(Number(e.target.value))}
                  min={6}
                  max={120}
                  className="bg-muted/50 border-muted-foreground/20 text-foreground"
                  disabled={!!questionnaireData}
                />
                {questionnaireData && (
                  <p className="text-xs text-muted-foreground">
                    Wybierz okres z dostępnych planów spłaty
                  </p>
                )}
              </div>

              <Button 
                onClick={handleCalculate} 
                className="w-full bg-muted-foreground hover:bg-muted-foreground/90 text-muted" 
                size="lg"
              >
                Oblicz ratę
              </Button>

              {calculation && (
                <div className="mt-6 p-6 bg-muted/30 rounded-lg border-2 border-muted-foreground/20 space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Miesięczna rata</p>
                    <p className="text-3xl font-extrabold text-foreground">
                      {calculation.monthlyPayment.toLocaleString("pl-PL", {
                        style: "currency",
                        currency: "PLN",
                      })}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Całkowita kwota</p>
                      <p className="text-xl font-extrabold text-foreground">
                        {calculation.totalAmount.toLocaleString("pl-PL", {
                          style: "currency",
                          currency: "PLN",
                        })}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Odsetki</p>
                      <p className="text-xl font-extrabold text-foreground">
                        {calculation.totalInterest.toLocaleString("pl-PL", {
                          style: "currency",
                          currency: "PLN",
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Loan Balance Graph */}
              {calculation && balanceChartData.length > 0 && (
                <div className="mt-6 p-4 bg-muted/30 rounded-lg border-2 border-muted-foreground/20">
                  <h4 className="font-semibold text-foreground mb-4">Pozostała kwota do spłaty w czasie</h4>
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={balanceChartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
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
                        <Tooltip content={<CustomTooltip />} />
                        <Line
                          type="monotone"
                          dataKey="balance"
                          stroke="#8B4513"
                          strokeWidth={2}
                          dot={false}
                          activeDot={{ r: 4 }}
                          name="Pozostała kwota"
                        />
                        <Line
                          type="monotone"
                          dataKey="interestDue"
                          stroke="#D2691E"
                          strokeWidth={2}
                          strokeDasharray="5 5"
                          dot={false}
                          activeDot={{ r: 4 }}
                          name="Odsetki do zapłaty"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Wykres pokazuje pozostałą kwotę do spłaty oraz odsetki do zapłaty w czasie
                  </p>
                </div>
              )}

              {/* Cumulative Interest Graph */}
              {calculation && interestChartData.length > 0 && (
                <div className="mt-6 p-4 bg-muted/30 rounded-lg border-2 border-muted-foreground/20">
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
                        <Tooltip content={<CustomInterestTooltip />} />
                        <Line
                          type="monotone"
                          dataKey="cumulativeInterest"
                          stroke="#D2691E"
                          strokeWidth={2}
                          dot={false}
                          activeDot={{ r: 4 }}
                          name="Odsetki do zapłaty"
                        />
                        <Line
                          type="monotone"
                          dataKey="totalPaid"
                          stroke="#8B4513"
                          strokeWidth={2}
                          strokeDasharray="5 5"
                          dot={false}
                          activeDot={{ r: 4 }}
                          hide={true}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Wykres pokazuje odsetki do zapłaty (skumulowane odsetki) w czasie
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Payment Plans Sidebar */}
        {questionnaireData && paymentPlans.length > 0 && (
          <div className="lg:col-span-1">
            <Card className="border-2 border-muted-foreground/20 bg-card sticky top-4">
              <CardHeader>
                <CardTitle className="text-lg text-foreground">Dostępne plany spłaty</CardTitle>
                <CardDescription className="text-muted-foreground">Wybierz okres spłaty, który Ci odpowiada</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 max-h-[600px] overflow-y-auto">
                {paymentPlans.map((plan) => (
                  <button
                    key={plan.durationMonths}
                    onClick={() => handlePlanSelect(plan)}
                    className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                      selectedPlan?.durationMonths === plan.durationMonths
                        ? "border-muted-foreground bg-muted"
                        : "border-muted-foreground/20 hover:border-muted-foreground/40 bg-muted/20"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold">{plan.durationMonths} miesięcy</span>
                      {selectedPlan?.durationMonths === plan.durationMonths && (
                        <CheckCircle className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                    <div className="space-y-1">
                      <p className="text-lg font-bold text-foreground">
                        {plan.monthlyPayment.toLocaleString("pl-PL", {
                          style: "currency",
                          currency: "PLN",
                        })}
                        <span className="text-sm font-normal text-muted-foreground">/miesiąc</span>
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Razem: {plan.totalAmount.toLocaleString("pl-PL", {
                          style: "currency",
                          currency: "PLN",
                        })}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Odsetki: {plan.totalInterest.toLocaleString("pl-PL", {
                          style: "currency",
                          currency: "PLN",
                        })}
                      </p>
                    </div>
                  </button>
                ))}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
