import { useEffect, useState } from "react"

import { Icon, Logo } from "../Shared"

import { useCart } from "../../context/CartContext"

import { Link, useLocation } from "react-router-dom"

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { cartCount, setCartOpen } = useCart()
  const location = useLocation()
  const isHome = location.pathname === "/"

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40)
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const isHeroTheme = isHome && !scrolled

  return (
    <header className={`site-header ${isHeroTheme ? "is-hero-theme" : ""}`}>
      <Logo horizontal light={isHeroTheme} onClick={() => setMenuOpen(false)} />
      <nav
        className={`main-nav ${menuOpen ? "is-open" : ""}`}
        aria-label="Điều hướng chính"
      >
        <Link
          to="/"
          onClick={(e) => {
            setMenuOpen(false)
            if (location.pathname === "/") {
              e.preventDefault()
              if (window.location.hash) {
                window.history.pushState(null, "", "/")
              }
              window.scrollTo({ top: 0, behavior: "smooth" })
            }
          }}
        >
          Trang chủ
        </Link>
        <Link to="/our-story" onClick={() => setMenuOpen(false)}>
          Câu chuyện
        </Link>
        <Link to="/products" onClick={() => setMenuOpen(false)}>
          Sản phẩm
        </Link>
        <Link
          to="/heritage#destinations"
          onClick={() => {
            setMenuOpen(false)
            if (
              location.pathname === "/heritage" &&
              location.hash === "#destinations"
            ) {
              document
                .getElementById("destinations")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          }}
        >
          Khám phá di sản
        </Link>
        <Link
          to="/heritage#story"
          onClick={() => {
            setMenuOpen(false)
            if (
              location.pathname === "/heritage" &&
              location.hash === "#story"
            ) {
              document
                .getElementById("story")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          }}
        >
          Chuyện di sản
        </Link>
      </nav>
      <div className="header-actions">
        <button
          className="cart-button"
          onClick={() => setCartOpen(true)}
          aria-label="Mở giỏ hàng"
        >
          <Icon name="bag" size={22} />
          <span className="cart-label">Giỏ hàng</span>
          <span className="cart-count">{cartCount}</span>
        </button>
        <button
          className="menu-button"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "Đóng menu" : "Mở menu"}
        >
          <Icon name={menuOpen ? "close" : "menu"} size={24} />
        </button>
      </div>
    </header>
  )
}
