import { Routes, Route } from "react-router-dom"
import Header from "./components/layout/Header"
import ProtectedRoute from "./components/layout/ProtectedRoute"
import Landing from "./app/routes/Landing"
import Login from "./app/routes/Login"
import Register from "./app/routes/Register"
import Dashboard from "./app/routes/Dashboard"
import Products from "./app/routes/Products"
import Payments from "./app/routes/Payments"
import Profile from "./app/routes/Profile"
import Support from "./app/routes/Support"
import About from "./app/routes/About"
import Contact from "./app/routes/Contact"
import Admin from "./app/routes/Admin"

function App() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/products"
          element={
            <ProtectedRoute>
              <Products />
            </ProtectedRoute>
          }
        />
        <Route
          path="/payments"
          element={
            <ProtectedRoute>
              <Payments />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/support"
          element={
            <ProtectedRoute>
              <Support />
            </ProtectedRoute>
          }
        />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute requireAdmin>
              <Admin />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  )
}

export default App

