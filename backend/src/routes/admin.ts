import express from "express"
import { prisma } from "../lib/prisma"
import { authenticate, requireAdmin, AuthRequest } from "../middleware/auth"
import { z } from "zod"

const router = express.Router()

// All admin routes require authentication and admin role
router.use(authenticate)
router.use(requireAdmin)

// Get all users
router.get("/users", async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        phone: true,
        createdAt: true,
        _count: {
          select: {
            loans: true,
            payments: true,
            documents: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    res.json({ users })
  } catch (error) {
    console.error("Get users error:", error)
    res.status(500).json({ error: "Failed to fetch users" })
  }
})

// Get user details
router.get("/users/:id", async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
      include: {
        loans: {
          include: {
            payments: {
              orderBy: { dueDate: "asc" },
            },
          },
        },
        documents: {
          orderBy: { createdAt: "desc" },
        },
        messages: {
          orderBy: { createdAt: "desc" },
        },
      },
    })

    if (!user) {
      return res.status(404).json({ error: "User not found" })
    }

    // Remove password from response
    const { password, ...userWithoutPassword } = user

    res.json({ user: userWithoutPassword })
  } catch (error) {
    console.error("Get user error:", error)
    res.status(500).json({ error: "Failed to fetch user" })
  }
})

// Get all loans
router.get("/loans", async (req, res) => {
  try {
    const loans = await prisma.loan.findMany({
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
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

// Update loan status
router.patch("/loans/:id", async (req, res) => {
  try {
    const schema = z.object({
      status: z.enum(["PENDING", "ACTIVE", "COMPLETED", "REJECTED"]),
    })

    const data = schema.parse(req.body)

    const loan = await prisma.loan.update({
      where: { id: req.params.id },
      data: { status: data.status },
    })

    // Audit log
    await prisma.auditLog.create({
      data: {
        action: "LOAN_STATUS_UPDATED",
        actorId: req.user!.id,
        actorEmail: req.user!.email,
        targetType: "Loan",
        targetId: loan.id,
        details: { status: data.status },
      },
    })

    res.json({ loan })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors })
    }
    console.error("Update loan error:", error)
    res.status(500).json({ error: "Failed to update loan" })
  }
})

// Get all payments
router.get("/payments", async (req, res) => {
  try {
    const payments = await prisma.payment.findMany({
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
        loan: {
          select: {
            id: true,
            amount: true,
          },
        },
      },
      orderBy: { dueDate: "desc" },
      take: 100,
    })

    res.json({ payments })
  } catch (error) {
    console.error("Get payments error:", error)
    res.status(500).json({ error: "Failed to fetch payments" })
  }
})

// Get all documents
router.get("/documents", async (req, res) => {
  try {
    const documents = await prisma.document.findMany({
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    res.json({ documents })
  } catch (error) {
    console.error("Get documents error:", error)
    res.status(500).json({ error: "Failed to fetch documents" })
  }
})

// Get audit logs
router.get("/audit-logs", async (req, res) => {
  try {
    const logs = await prisma.auditLog.findMany({
      orderBy: { createdAt: "desc" },
      take: 200,
    })

    res.json({ logs })
  } catch (error) {
    console.error("Get audit logs error:", error)
    res.status(500).json({ error: "Failed to fetch audit logs" })
  }
})

export default router

