import { Request, Response, NextFunction } from "express"
import { prisma } from "../lib/prisma"
import { AuthRequest } from "./auth"

export const auditLog = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const originalSend = res.send

  res.send = function (data) {
    // Log admin actions
    if (req.user && req.user.role === "ADMIN" && req.path.startsWith("/api/admin")) {
      const action = `${req.method} ${req.path}`
      const ipAddress = req.ip || req.socket.remoteAddress || undefined

      prisma.auditLog
        .create({
          data: {
            action,
            actorId: req.user.id,
            actorEmail: req.user.email,
            targetType: "AdminPanel",
            details: {
              method: req.method,
              path: req.path,
              statusCode: res.statusCode,
            },
            ipAddress,
          },
        })
        .catch((err) => console.error("Audit log failed:", err))
    }

    return originalSend.call(this, data)
  }

  next()
}

