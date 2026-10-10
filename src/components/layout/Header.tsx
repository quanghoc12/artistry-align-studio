import { useState } from "react"

import { Icon, Logo } from "../Shared"

import { useCart } from "../../context/CartContext"

import { Link } from "react-router-dom"

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)

  const { cartCount, setCartOpen } = useCart()

  return (
    <header className="site-header">
      <Logo />
      <nav
        className={`main-nav ${menuOpen ? "is-open" : ""}`}
        aria-label="Điều hướng chính"
      >
        <Link to="/" onClick={() => setMenuOpen(false)}>
          Trang chủ
        </Link>
        <Link to="/our-story" onClick={() => setMenuOpen(false)}>
          Câu chuyện
        </Link>
        <Link to="/products" onClick={() => setMenuOpen(false)}>
          Sản phẩm
        </Link>
        <a href="/#discover" onClick={() => setMenuOpen(false)}>
          Khám phá di sản
        </a>
        <a href="/#journal" onClick={() => setMenuOpen(false)}>
          Chuyện di sản
        </a>
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
