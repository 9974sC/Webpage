import express from "express"
import { prisma } from "../lib/prisma"
import { authenticate, AuthRequest } from "../middleware/auth"
import { z } from "zod"

const router = express.Router()

// Get user's support messages
router.get("/messages", authenticate, async (req: AuthRequest, res) => {
  try {
    const messages = await prisma.supportMessage.findMany({
      where: { userId: req.user!.id },
      orderBy: { createdAt: "desc" },
    })

    res.json({ messages })
  } catch (error) {
    console.error("Get messages error:", error)
    res.status(500).json({ error: "Failed to fetch messages" })
  }
})

// Create support message
router.post("/messages", authenticate, async (req: AuthRequest, res) => {
  try {
    const schema = z.object({
      subject: z.string().min(1),
      message: z.string().min(1),
    })

    const data = schema.parse(req.body)

    const supportMessage = await prisma.supportMessage.create({
      data: {
        userId: req.user!.id,
        subject: data.subject,
        message: data.message,
        status: "OPEN",
      },
    })

    res.json({ message: supportMessage })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors })
    }
    console.error("Create message error:", error)
    res.status(500).json({ error: "Failed to create message" })
  }
})

// Chatbot endpoint (stubbed)
router.post("/chatbot", authenticate, async (req: AuthRequest, res) => {
  try {
    const { message } = req.body

    // Stubbed AI response
    await new Promise((resolve) => setTimeout(resolve, 800))

    const responses = [
      "Dziękuję za pytanie. Jak mogę pomóc?",
      "Rozumiem Twoje pytanie. Oto informacje, które mogą być pomocne.",
      "Mogę pomóc w sprawach związanych z kredytami, płatnościami i dokumentami.",
    ]

    const response = responses[Math.floor(Math.random() * responses.length)]

    res.json({
      response,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Chatbot error:", error)
    res.status(500).json({ error: "Chatbot service unavailable" })
  }
})

export default router

