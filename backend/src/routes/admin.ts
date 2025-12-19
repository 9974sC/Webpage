import express from "express"
import { authenticate, requireAdmin, AuthRequest } from "../middleware/auth"
import { z } from "zod"

const router = express.Router()

// All admin routes require authentication and admin role
router.use(authenticate)
router.use(requireAdmin)

// Generate fake users data
function generateFakeUsers() {
  const firstNames = ["Jan", "Anna", "Piotr", "Maria", "Krzysztof", "Katarzyna", "Tomasz", "Agnieszka", "Marcin", "Magdalena"]
  const lastNames = ["Kowalski", "Nowak", "Wiśniewski", "Wójcik", "Kowalczyk", "Kamiński", "Lewandowski", "Zieliński", "Szymański", "Woźniak"]
  const domains = ["gmail.com", "wp.pl", "o2.pl", "interia.pl", "outlook.com"]
  
  return Array.from({ length: 15 }, (_, i) => {
    const firstName = firstNames[i % firstNames.length]
    const lastName = lastNames[Math.floor(i / firstNames.length) % lastNames.length]
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i > 0 ? i : ""}@${domains[i % domains.length]}`
    const loansCount = Math.floor(Math.random() * 5)
    const paymentsCount = loansCount * 12 + Math.floor(Math.random() * 10)
    
    return {
      id: `user-${i + 1}`,
      email,
      firstName,
      lastName,
      role: "USER",
      phone: `+48 ${Math.floor(Math.random() * 900) + 100} ${Math.floor(Math.random() * 900) + 100} ${Math.floor(Math.random() * 900) + 100}`,
      createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000),
      _count: {
        loans: loansCount,
        payments: paymentsCount,
        documents: Math.floor(Math.random() * 3),
      },
    }
  })
}

// Get all users - Proof of concept: return fake data
router.get("/users", async (req, res) => {
  try {
    const users = generateFakeUsers()
    res.json({ users })
  } catch (error) {
    console.error("Get users error:", error)
    res.status(500).json({ error: "Failed to fetch users" })
  }
})

// Get user details - Proof of concept: return fake user
router.get("/users/:id", async (req, res) => {
  try {
    const users = generateFakeUsers()
    const user = users.find(u => u.id === req.params.id) || users[0]
    const loans = generateFakeLoans().filter(l => l.user.id === user.id)
    
    const userWithDetails = {
      ...user,
      loans: loans.map(loan => ({
        ...loan,
        payments: generateFakePayments().filter(p => p.loan.id === loan.id).slice(0, 12),
      })),
      documents: [],
      messages: [],
    }

    res.json({ user: userWithDetails })
  } catch (error) {
    console.error("Get user error:", error)
    res.status(500).json({ error: "Failed to fetch user" })
  }
})

// Generate fake loans data
function generateFakeLoans() {
  const users = generateFakeUsers()
  const statuses = ["PENDING", "ACTIVE", "COMPLETED", "REJECTED"]
  const amounts = [10000, 25000, 50000, 75000, 100000, 150000, 200000]
  const interestRates = [3.5, 4.0, 4.5, 5.0, 5.5, 6.0]
  
  return Array.from({ length: 20 }, (_, i) => {
    const user = users[i % users.length]
    const amount = amounts[Math.floor(Math.random() * amounts.length)]
    const interestRate = interestRates[Math.floor(Math.random() * interestRates.length)]
    const durationMonths = [12, 24, 36, 48, 60][Math.floor(Math.random() * 5)]
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
      createdAt: new Date(Date.now() - Math.random() * 180 * 24 * 60 * 60 * 1000),
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      payments: [],
    }
  })
}

// Get all loans - Proof of concept: return fake data
router.get("/loans", async (req, res) => {
  try {
    const loans = generateFakeLoans()
    res.json({ loans })
  } catch (error) {
    console.error("Get loans error:", error)
    res.status(500).json({ error: "Failed to fetch loans" })
  }
})

// Update loan status - Proof of concept: return fake updated loan
router.patch("/loans/:id", async (req, res) => {
  try {
    const schema = z.object({
      status: z.enum(["PENDING", "ACTIVE", "COMPLETED", "REJECTED"]),
    })

    const data = schema.parse(req.body)
    const loans = generateFakeLoans()
    const loan = loans.find(l => l.id === req.params.id) || loans[0]
    
    const updatedLoan = {
      ...loan,
      status: data.status,
    }

    res.json({ loan: updatedLoan })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors })
    }
    console.error("Update loan error:", error)
    res.status(500).json({ error: "Failed to update loan" })
  }
})

// Generate fake payments data
function generateFakePayments() {
  const users = generateFakeUsers()
  const statuses = ["UPCOMING", "PAID", "OVERDUE"]
  const amounts = [500, 750, 1000, 1250, 1500, 2000, 2500]
  
  return Array.from({ length: 50 }, (_, i) => {
    const user = users[i % users.length]
    const amount = amounts[Math.floor(Math.random() * amounts.length)]
    const status = statuses[Math.floor(Math.random() * statuses.length)]
    const dueDate = new Date(Date.now() + (Math.random() - 0.5) * 90 * 24 * 60 * 60 * 1000)
    
    return {
      id: `payment-${i + 1}`,
      amount,
      dueDate: dueDate.toISOString(),
      status,
      paidAt: status === "PAID" ? new Date(dueDate.getTime() - Math.random() * 7 * 24 * 60 * 60 * 1000) : null,
      transactionId: status === "PAID" ? `txn_${Math.random().toString(36).substring(2, 15)}` : null,
      createdAt: new Date(dueDate.getTime() - 30 * 24 * 60 * 60 * 1000),
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      loan: {
        id: `loan-${Math.floor(i / 3) + 1}`,
        amount: amount * 12,
      },
    }
  })
}

// Get all payments - Proof of concept: return fake data
router.get("/payments", async (req, res) => {
  try {
    const payments = generateFakePayments()
    res.json({ payments })
  } catch (error) {
    console.error("Get payments error:", error)
    res.status(500).json({ error: "Failed to fetch payments" })
  }
})

// Get all documents - Proof of concept: return empty array
router.get("/documents", async (req, res) => {
  try {
    res.json({ documents: [] })
  } catch (error) {
    console.error("Get documents error:", error)
    res.status(500).json({ error: "Failed to fetch documents" })
  }
})

// Generate fake audit logs
function generateFakeAuditLogs() {
  const users = generateFakeUsers()
  const actions = ["USER_LOGIN", "LOAN_STATUS_UPDATED", "PAYMENT_PROCESSED", "USER_REGISTERED", "DOCUMENT_UPLOADED", "PROFILE_UPDATED"]
  
  return Array.from({ length: 100 }, (_, i) => {
    const user = users[Math.floor(Math.random() * users.length)]
    const action = actions[Math.floor(Math.random() * actions.length)]
    const createdAt = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
    
    return {
      id: `log-${i + 1}`,
      action,
      actorId: user.id,
      actorEmail: user.email,
      targetType: action.includes("LOAN") ? "Loan" : action.includes("PAYMENT") ? "Payment" : "User",
      targetId: `target-${i + 1}`,
      createdAt: createdAt.toISOString(),
      details: {
        ip: `192.168.1.${Math.floor(Math.random() * 255)}`,
        userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        ...(action === "LOAN_STATUS_UPDATED" ? { status: ["PENDING", "ACTIVE", "COMPLETED", "REJECTED"][Math.floor(Math.random() * 4)] } : {}),
        ...(action === "PAYMENT_PROCESSED" ? { amount: Math.floor(Math.random() * 2000) + 500, transactionId: `txn_${Math.random().toString(36).substring(2, 15)}` } : {}),
      },
    }
  }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

// Get audit logs - Proof of concept: return fake data
router.get("/audit-logs", async (req, res) => {
  try {
    const logs = generateFakeAuditLogs()
    res.json({ logs })
  } catch (error) {
    console.error("Get audit logs error:", error)
    res.status(500).json({ error: "Failed to fetch audit logs" })
  }
})

// Get usage and traffic statistics - Proof of concept: return fake data
router.get("/stats", async (req, res) => {
  try {
    const now = new Date()
    const users = generateFakeUsers()
    const loans = generateFakeLoans()
    const payments = generateFakePayments()
    const logs = generateFakeAuditLogs()
    
    const activeLoans = loans.filter(l => l.status === "ACTIVE")
    const paidPayments = payments.filter(p => p.status === "PAID")
    const loginLogs = logs.filter(l => l.action === "USER_LOGIN")
    const last7DaysLogs = loginLogs.filter(l => {
      const logDate = new Date(l.createdAt)
      return logDate >= new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    })
    const last30DaysLogs = loginLogs.filter(l => {
      const logDate = new Date(l.createdAt)
      return logDate >= new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    })
    
    const dailyActivity = []
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
      const startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate())
      const endOfDay = new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000)
      
      const dayLogins = loginLogs.filter(l => {
        const logDate = new Date(l.createdAt)
        return logDate >= startOfDay && logDate < endOfDay
      }).length
      
      const dayUsers = users.filter(u => {
        const userDate = new Date(u.createdAt)
        return userDate >= startOfDay && userDate < endOfDay
      }).length
      
      dailyActivity.push({
        date: startOfDay.toISOString().split("T")[0],
        logins: dayLogins,
        newUsers: dayUsers,
      })
    }

    res.json({
      users: {
        total: users.length,
        newToday: Math.floor(Math.random() * 3),
        newThisMonth: Math.floor(users.length * 0.3),
        newLast7Days: Math.floor(users.length * 0.1),
      },
      loans: {
        total: loans.length,
        active: activeLoans.length,
        pending: loans.filter(l => l.status === "PENDING").length,
        totalAmount: activeLoans.reduce((sum, l) => sum + l.amount, 0),
      },
      payments: {
        total: payments.length,
        paid: paidPayments.length,
        overdue: payments.filter(p => p.status === "OVERDUE").length,
        totalPaidAmount: paidPayments.reduce((sum, p) => sum + Number(p.amount), 0),
      },
      traffic: {
        totalLogins: loginLogs.length,
        loginsLast7Days: last7DaysLogs.length,
        loginsLast30Days: last30DaysLogs.length,
        dailyActivity,
      },
    })
  } catch (error) {
    console.error("Get stats error:", error)
    res.status(500).json({ error: "Failed to fetch statistics" })
  }
})

export default router

