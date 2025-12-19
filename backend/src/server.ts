import dotenv from "dotenv"
import path from "path"

// Load environment variables FIRST, before any other imports
dotenv.config({ path: path.resolve(__dirname, "../.env") })

import express from "express"
import cors from "cors"
import session from "express-session"
import authRoutes from "./routes/auth"
import loanRoutes from "./routes/loans"
import paymentRoutes from "./routes/payments"
import adminRoutes from "./routes/admin"
import supportRoutes from "./routes/support"
import { errorHandler } from "./middleware/errorHandler"

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true,
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Session configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET || "ascendia-session-secret-change-in-production",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    },
  })
)

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() })
})

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/loans", loanRoutes)
app.use("/api/payments", paymentRoutes)
app.use("/api/admin", adminRoutes)
app.use("/api/support", supportRoutes)

// Error handling
app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`Ascendia backend running on port ${PORT}`)
})

