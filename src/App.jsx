import { useState } from 'react'
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import HomePage from './pages/homePage'

function App() {
  const [count, setCount] = useState(0)

  return (
    <BrowserRouter>

      <Toaster position="top-right" />

      <Routes path="/">

        <Route path="/*" element={<HomePage />} />

        <Route path="/about" element={<h1>Shop</h1>} />

        <Route path="/contact" element={<h1>Contact</h1>} />

        <Route path="/login" element={<h1>Login</h1>} />

        <Route path="/admin/*" element={<h1>Admin</h1>} />

        <Route path="/register" element={<h1>Register</h1>} />

        <Route path="/about" element={<h1>About</h1>} />

        <Route path="/cart" element={<h1>Cart</h1>} />

      </Routes>

    </BrowserRouter>
  )
}

export default App
