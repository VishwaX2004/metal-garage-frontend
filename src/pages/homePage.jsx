import { Route, Routes } from "react-router-dom";
import Header from "../components/header";
import Footer from "../components/footer";

export default function HomePage() {
    return (
        <div className="w-full h-full bg-primary flex flex-col">

            <Header />

            <Routes path="/">

                <Route path="/*" element={<h1>Home</h1>} />

                <Route path="/about" element={<h1>Shop</h1>} />

                <Route path="/contact" element={<h1>Contact</h1>} />

                <Route path="/about" element={<h1>about</h1>} />

                <Route path="/*" element={<h1>404 not found</h1>} />

            </Routes>

            <Footer/>

        </div>
    )
}
