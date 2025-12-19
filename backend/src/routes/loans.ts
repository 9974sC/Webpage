import express from "express"
import { authenticate, AuthRequest } from "../middleware/auth"
import { z } from "zod"
import { prisma } from "../lib/prisma"

const router = express.Router()

// Calculate loan payment
function calculateLoanPayment(
  amount: number,
  interestRate: number,
  durationMonths: number
): { monthlyPayment: number; totalAmount: number } {
  const monthlyRate = interestRate / 100 / 12
  const monthlyPayment =
    (amount * monthlyRate * Math.pow(1 + monthlyRate, durationMonths)) /
    (Math.pow(1 + monthlyRate, durationMonths) - 1)
  const totalAmount = monthlyPayment * durationMonths

  return {
    monthlyPayment: Math.round(monthlyPayment * 100) / 100,
    totalAmount: Math.round(totalAmount * 100) / 100,
  }
}

// Generate fake loans for dashboard
function generateFakeUserLoans() {
  const amounts = [25000, 50000, 75000, 100000]
  const interestRates = [4.0, 4.5, 5.0, 5.5]
  const durations = [24, 36, 48, 60]
  const statuses = ["PENDING", "ACTIVE", "COMPLETED"]
  
  return Array.from({ length: 3 }, (_, i) => {
    const amount = amounts[Math.floor(Math.random() * amounts.length)]
    const interestRate = interestRates[Math.floor(Math.random() * interestRates.length)]
    const durationMonths = durations[Math.floor(Math.random() * durations.length)]
    const monthlyRate = interestRate / 100 / 12
    const monthlyPayment = Math.round((amount * monthlyRate * Math.pow(1 + monthlyRate, durationMonths)) / (Math.pow(1 + monthlyRate, durationMonths) - 1) * 100) / 100
    
    return {
      id: `loan-${i + 1}`,
      amount,
      interestRate,
      durationMonths,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      monthlyPayment,
      totalAmount: Math.round(monthlyPayment * durationMonths * 100) / 100,
      createdAt: new Date(Date.now() - (i + 1) * 30 * 24 * 60 * 60 * 1000),
      payments: [],
    }
  })
}

// Get user's loans - Proof of concept: return fake data
router.get("/my-loans", authenticate, async (req: AuthRequest, res) => {
  try {
    const loans = generateFakeUserLoans()
    res.json({ loans })
  } catch (error) {
    console.error("Get loans error:", error)
    res.status(500).json({ error: "Failed to fetch loans" })
  }
})

// Calculate loan
router.post("/calculate", authenticate, async (req: AuthRequest, res) => {
  try {
    const schema = z.object({
      amount: z.number().min(1000).max(500000),
      interestRate: z.number().min(1).max(30),
      durationMonths: z.number().min(6).max(120),
    })

    const data = schema.parse(req.body)
    const calculation = calculateLoanPayment(
      data.amount,
      data.interestRate,
      data.durationMonths
    )

    res.json({
      ...data,
      ...calculation,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors })
    }
    console.error("Calculate loan error:", error)
    res.status(500).json({ error: "Calculation failed" })
  }
})

// Create loan application - Proof of concept: return fake loan
router.post("/apply", authenticate, async (req: AuthRequest, res) => {
  try {
    const schema = z.object({
      amount: z.number().min(1000).max(500000),
      interestRate: z.number().min(1).max(30),
      durationMonths: z.number().min(6).max(120),
    })

    const data = schema.parse(req.body)
    const calculation = calculateLoanPayment(
      data.amount,
      data.interestRate,
      data.durationMonths
    )

    const loan = {
      id: `loan-${Date.now()}`,
      userId: req.user!.id,
      amount: data.amount,
      interestRate: data.interestRate,
      durationMonths: data.durationMonths,
      status: "PENDING",
      monthlyPayment: calculation.monthlyPayment,
      totalAmount: calculation.totalAmount,
      createdAt: new Date(),
    }

    res.json({ loan })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors })
    }
    console.error("Apply loan error:", error)
    res.status(500).json({ error: "Loan application failed" })
  }
})

// Save quote from questionnaire
router.post("/quotes", authenticate, async (req: AuthRequest, res) => {
  try {
    const schema = z.object({
      questionnaireData: z.any(),
      loanAmount: z.number().min(1000).max(500000),
      interestRate: z.number().min(1).max(30),
      monthlyPayment: z.number(),
      totalAmount: z.number(),
    })

    const data = schema.parse(req.body)
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 7) // 7 days from now

    const quote = await prisma.quote.create({
      data: {
        userId: req.user!.id,
        questionnaireData: data.questionnaireData,
        loanAmount: data.loanAmount,
        interestRate: data.interestRate,
        monthlyPayment: data.monthlyPayment,
        totalAmount: data.totalAmount,
        expiresAt,
      },
    })

    res.json({ quote })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors })
    }
    console.error("Save quote error:", error)
    res.status(500).json({ error: "Failed to save quote" })
  }
})

// Get user's quote history
router.get("/quotes", authenticate, async (req: AuthRequest, res) => {
  try {
    const quotes = await prisma.quote.findMany({
      where: {
        userId: req.user!.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    const now = new Date()
    const quotesWithStatus = quotes.map((quote) => ({
      ...quote,
      isExpired: quote.expiresAt < now,
      loanAmount: Number(quote.loanAmount),
      interestRate: Number(quote.interestRate),
      monthlyPayment: Number(quote.monthlyPayment),
      totalAmount: Number(quote.totalAmount),
    }))

    res.json({ quotes: quotesWithStatus })
  } catch (error) {
    console.error("Get quotes error:", error)
    res.status(500).json({ error: "Failed to fetch quotes" })
  }
})

export default router

