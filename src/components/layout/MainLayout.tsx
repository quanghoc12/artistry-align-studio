import { Outlet } from "react-router-dom"
import Header from "./Header"
import Footer from "./Footer"
import CartDrawer from "./CartDrawer"
import Chatbox from "../Chatbox"
import { ScrollReveal, Toaster } from "../Motion"
import ScrollProgress from "../ScrollProgress"

export default function MainLayout() {
  return (
    <div id="top" className="site-shell">
      <ScrollProgress />
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
      <CartDrawer />
      <Chatbox />
      <ScrollReveal />
      <Toaster />
    </div>
  )
}


