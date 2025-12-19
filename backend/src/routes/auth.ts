import express from "express"
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

// Register - Proof of concept: auto-login as admin
router.post("/register", async (req, res) => {
  try {
    const data = registerSchema.parse(req.body)

    // Proof of concept: Always return admin user
    const adminUser = {
      id: "admin-1",
      email: "admin@ascendia.pl",
      firstName: "Admin",
      lastName: "User",
      role: "ADMIN" as const,
      createdAt: new Date(),
    }

    // Store user in session
    req.session.userId = adminUser.id
    req.session.userEmail = adminUser.email
    req.session.userRole = adminUser.role

    res.json({
      user: adminUser,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors })
    }
    console.error("Register error:", error)
    res.status(500).json({ error: "Registration failed" })
  }
})

// Login - Proof of concept: auto-login as admin
router.post("/login", async (req, res) => {
  try {
    const data = loginSchema.parse(req.body)

    // Proof of concept: Always return admin user
    const adminUser = {
      id: "admin-1",
      email: "admin@ascendia.pl",
      firstName: "Admin",
      lastName: "User",
      role: "ADMIN" as const,
    }

    // Store user in session
    req.session.userId = adminUser.id
    req.session.userEmail = adminUser.email
    req.session.userRole = adminUser.role

    res.json({
      user: adminUser,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors })
    }
    console.error("Login error:", error)
    res.status(500).json({ error: "Login failed" })
  }
})

// Get current user - Proof of concept: return fake admin
router.get("/me", authenticate, async (req: AuthRequest, res) => {
  try {
    // Proof of concept: Always return admin user
    const adminUser = {
      id: "admin-1",
      email: "admin@ascendia.pl",
      firstName: "Admin",
      lastName: "User",
      role: "ADMIN" as const,
      phone: "+48 123 456 789",
      createdAt: new Date("2024-01-01"),
    }

    res.json({ user: adminUser })
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

