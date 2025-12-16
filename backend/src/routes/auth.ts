import express from "express"
import bcrypt from "bcrypt"
import { prisma } from "../lib/prisma"
import { authenticate, AuthRequest } from "../middleware/auth"
import { z } from "zod"

const router = express.Router()

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  phone: z.string().optional(),
})

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

// Register
router.post("/register", async (req, res) => {
  try {
    const data = registerSchema.parse(req.body)

    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    })

    if (existingUser) {
      return res.status(400).json({ error: "Email already registered" })
    }

    const hashedPassword = await bcrypt.hash(data.password, 12)

    const user = await prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        createdAt: true,
      },
    })

    // Store user in session
    req.session.userId = user.id
    req.session.userEmail = user.email
    req.session.userRole = user.role

    res.json({
      user,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors })
    }
    console.error("Register error:", error)
    res.status(500).json({ error: "Registration failed" })
  }
})

// Login
router.post("/login", async (req, res) => {
  try {
    const data = loginSchema.parse(req.body)

    const user = await prisma.user.findUnique({
      where: { email: data.email },
    })

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" })
    }

    const isValid = await bcrypt.compare(data.password, user.password)

    if (!isValid) {
      return res.status(401).json({ error: "Invalid credentials" })
    }

    // Store user in session
    req.session.userId = user.id
    req.session.userEmail = user.email
    req.session.userRole = user.role

    // Audit log
    await prisma.auditLog.create({
      data: {
        action: "USER_LOGIN",
        actorId: user.id,
        actorEmail: user.email,
        targetType: "User",
        targetId: user.id,
        details: {
          ip: req.ip || req.socket.remoteAddress,
        },
      },
    })

    res.json({
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors })
    }
    console.error("Login error:", error)
    res.status(500).json({ error: "Login failed" })
  }
})

// Get current user
router.get("/me", authenticate, async (req: AuthRequest, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        phone: true,
        createdAt: true,
      },
    })

    if (!user) {
      return res.status(404).json({ error: "User not found" })
    }

    res.json({ user })
  } catch (error) {
    console.error("Get me error:", error)
    res.status(500).json({ error: "Failed to get user" })
  }
})

// Logout
router.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Session destroy error:", err)
      return res.status(500).json({ error: "Logout failed" })
    }
    res.clearCookie("connect.sid")
    res.json({ message: "Logged out successfully" })
  })
})

export default router

