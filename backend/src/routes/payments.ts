import express from "express"
import { prisma } from "../lib/prisma"
import { authenticate, AuthRequest } from "../middleware/auth"

const router = express.Router()

// Mock payment processor
async function processPayment(
  amount: number,
  cardToken: string
): Promise<{ status: string; transactionId: string }> {
  await new Promise((resolve) => setTimeout(resolve, 1200))

  if (!cardToken.startsWith("tok_")) {
    throw new Error("Payment rejected: invalid token")
  }

  return {
    status: "SUCCESS",
    transactionId: "txn_" + Math.random().toString(36).substring(2, 15),
  }
}

// Get upcoming payments
router.get("/upcoming", authenticate, async (req: AuthRequest, res) => {
  try {
    const payments = await prisma.payment.findMany({
      where: {
        userId: req.user!.id,
        status: "UPCOMING",
        dueDate: {
          gte: new Date(),
        },
      },
      include: {
        loan: {
          select: {
            id: true,
            amount: true,
            interestRate: true,
          },
        },
      },
      orderBy: { dueDate: "asc" },
    })

    res.json({ payments })
  } catch (error) {
    console.error("Get upcoming payments error:", error)
    res.status(500).json({ error: "Failed to fetch payments" })
  }
})

// Get payment history
router.get("/history", authenticate, async (req: AuthRequest, res) => {
  try {
    const payments = await prisma.payment.findMany({
      where: {
        userId: req.user!.id,
        status: "PAID",
      },
      include: {
        loan: {
          select: {
            id: true,
            amount: true,
          },
        },
      },
      orderBy: { paidAt: "desc" },
      take: 50,
    })

    res.json({ payments })
  } catch (error) {
    console.error("Get payment history error:", error)
    res.status(500).json({ error: "Failed to fetch payment history" })
  }
})

// Process payment
router.post("/:id/pay", authenticate, async (req: AuthRequest, res) => {
  try {
    const paymentId = req.params.id
    const { cardToken } = req.body

    if (!cardToken) {
      return res.status(400).json({ error: "Card token required" })
    }

    const payment = await prisma.payment.findFirst({
      where: {
        id: paymentId,
        userId: req.user!.id,
        status: "UPCOMING",
      },
    })

    if (!payment) {
      return res.status(404).json({ error: "Payment not found" })
    }

    // Process payment (mocked)
    const result = await processPayment(Number(payment.amount), cardToken)

    // Update payment
    const updatedPayment = await prisma.payment.update({
      where: { id: paymentId },
      data: {
        status: "PAID",
        paidAt: new Date(),
        transactionId: result.transactionId,
      },
    })

    // Audit log
    await prisma.auditLog.create({
      data: {
        action: "PAYMENT_PROCESSED",
        actorId: req.user!.id,
        actorEmail: req.user!.email,
        targetType: "Payment",
        targetId: paymentId,
        details: {
          amount: Number(payment.amount),
          transactionId: result.transactionId,
        },
      },
    })

    res.json({ payment: updatedPayment, transaction: result })
  } catch (error) {
    console.error("Process payment error:", error)
    res.status(500).json({ error: "Payment processing failed" })
  }
})

export default router

