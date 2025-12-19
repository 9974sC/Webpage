import { Request, Response, NextFunction } from "express"

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
    // Proof of concept: Auto-authenticate as admin if no session
    if (!req.session.userId) {
      req.session.userId = "admin-1"
      req.session.userEmail = "admin@ascendia.pl"
      req.session.userRole = "ADMIN"
    }

    // Proof of concept: Always set admin user
    req.user = {
      id: req.session.userId || "admin-1",
      email: req.session.userEmail || "admin@ascendia.pl",
      role: (req.session.userRole as "ADMIN") || "ADMIN",
    }

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

