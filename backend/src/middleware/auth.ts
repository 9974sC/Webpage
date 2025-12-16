import { Request, Response, NextFunction } from "express"
import { prisma } from "../lib/prisma"

declare module "express-session" {
  interface SessionData {
    userId?: string
    userEmail?: string
    userRole?: "USER" | "ADMIN"
  }
}

export interface AuthRequest extends Request {
  user?: {
    id: string
    email: string
    role: "USER" | "ADMIN"
  }
}

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({ error: "Unauthorized" })
    }

    const user = await prisma.user.findUnique({
      where: { id: req.session.userId },
      select: { id: true, email: true, role: true },
    })

    if (!user) {
      req.session.destroy(() => {})
      return res.status(401).json({ error: "User not found" })
    }

    req.user = user
    next()
  } catch (error) {
    console.error("Authentication error:", error)
    return res.status(500).json({ error: "Authentication failed" })
  }
}

export const requireAdmin = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.user || req.user.role !== "ADMIN") {
    return res.status(403).json({ error: "Admin access required" })
  }
  next()
}

