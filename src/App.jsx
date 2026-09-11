import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import HomePage from './pages/homePage'
import LoginPage from './pages/loginPage'
import AdminPage from './pages/adminPage'
import ProductPage from './pages/productPage'
import CartPage from './pages/cartPage'
import AboutPage from './pages/aboutPage'

function App() {

  return (
    <BrowserRouter>

      <Toaster position="top-right" />

      <Routes path="/">

        <Route path="/*" element={<HomePage />} />

        <Route path="/products" element={<ProductPage />} />

        <Route path="/contact" element={<h1>Contact</h1>} />

        <Route path="/login" element={<LoginPage />} />

        <Route path="/admin/*" element={<AdminPage />} />

        <Route path="/register" element={<h1>Register</h1>} />

        <Route path="/about" element={<AboutPage />} />

        <Route path="/cart" element={<CartPage />} />

      </Routes>

    </BrowserRouter>
  )
}

export default App
