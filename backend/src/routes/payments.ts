import express from "express"
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

// Generate fake upcoming payments
function generateFakeUpcomingPayments() {
  const amounts = [750, 1000, 1250, 1500, 2000]
  
  return Array.from({ length: 5 }, (_, i) => {
    const amount = amounts[Math.floor(Math.random() * amounts.length)]
    const dueDate = new Date(Date.now() + (i + 1) * 30 * 24 * 60 * 60 * 1000)
    
    return {
      id: `payment-${i + 1}`,
      amount,
      dueDate: dueDate.toISOString(),
      status: "UPCOMING",
      loan: {
        id: `loan-${Math.floor(i / 3) + 1}`,
        amount: amount * 12,
        interestRate: 4.5,
      },
    }
  })
}

// Get upcoming payments - Proof of concept: return fake data
router.get("/upcoming", authenticate, async (req: AuthRequest, res) => {
  try {
    const payments = generateFakeUpcomingPayments()
    res.json({ payments })
  } catch (error) {
    console.error("Get upcoming payments error:", error)
    res.status(500).json({ error: "Failed to fetch payments" })
  }
})

// Generate fake payment history
function generateFakePaymentHistory() {
  const amounts = [750, 1000, 1250, 1500]
  
  return Array.from({ length: 10 }, (_, i) => {
    const amount = amounts[Math.floor(Math.random() * amounts.length)]
    const paidAt = new Date(Date.now() - (i + 1) * 30 * 24 * 60 * 60 * 1000)
    
    return {
      id: `payment-hist-${i + 1}`,
      amount,
      dueDate: new Date(paidAt.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      status: "PAID",
      paidAt: paidAt.toISOString(),
      transactionId: `txn_${Math.random().toString(36).substring(2, 15)}`,
      loan: {
        id: `loan-${Math.floor(i / 3) + 1}`,
        amount: amount * 12,
      },
    }
  })
}

// Get payment history - Proof of concept: return fake data
router.get("/history", authenticate, async (req: AuthRequest, res) => {
  try {
    const payments = generateFakePaymentHistory()
    res.json({ payments })
  } catch (error) {
    console.error("Get payment history error:", error)
    res.status(500).json({ error: "Failed to fetch payment history" })
  }
})

// Process payment - Proof of concept: return fake processed payment
router.post("/:id/pay", authenticate, async (req: AuthRequest, res) => {
  try {
    const paymentId = req.params.id
    const { cardToken } = req.body

    if (!cardToken) {
      return res.status(400).json({ error: "Card token required" })
    }

    // Process payment (mocked)
    const result = await processPayment(1000, cardToken)

    // Return fake updated payment
    const updatedPayment = {
      id: paymentId,
      amount: 1000,
      dueDate: new Date().toISOString(),
      status: "PAID",
      paidAt: new Date().toISOString(),
      transactionId: result.transactionId,
      userId: req.user!.id,
    }

    res.json({ payment: updatedPayment, transaction: result })
  } catch (error) {
    console.error("Process payment error:", error)
    res.status(500).json({ error: "Payment processing failed" })
  }
})

export default router

