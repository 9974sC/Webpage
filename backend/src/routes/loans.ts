import express from "express"
import { prisma } from "../lib/prisma"
import { authenticate, AuthRequest } from "../middleware/auth"
import { z } from "zod"

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

// Get user's loans
router.get("/my-loans", authenticate, async (req: AuthRequest, res) => {
  try {
    const loans = await prisma.loan.findMany({
      where: { userId: req.user!.id },
      include: {
        payments: {
          orderBy: { dueDate: "asc" },
        },
      },
      orderBy: { createdAt: "desc" },
    })

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

// Create loan application
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

    const loan = await prisma.loan.create({
      data: {
        userId: req.user!.id,
        amount: data.amount,
        interestRate: data.interestRate,
        durationMonths: data.durationMonths,
        status: "PENDING",
        monthlyPayment: calculation.monthlyPayment,
        totalAmount: calculation.totalAmount,
      },
    })

    // Create payment schedule
    const payments = []
    const now = new Date()
    for (let i = 1; i <= data.durationMonths; i++) {
      const dueDate = new Date(now.getFullYear(), now.getMonth() + i, 1)
      payments.push({
        loanId: loan.id,
        userId: req.user!.id,
        amount: calculation.monthlyPayment,
        dueDate,
        status: "UPCOMING" as const,
      })
    }

    await prisma.payment.createMany({
      data: payments,
    })

    res.json({ loan })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors })
    }
    console.error("Apply loan error:", error)
    res.status(500).json({ error: "Loan application failed" })
  }
})

export default router

