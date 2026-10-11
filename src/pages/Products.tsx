import { useState, useMemo } from "react"

import { Icon, LinkButton } from "../components/Shared"

import { products } from "../data/products"

import { Link } from "react-router-dom"

export default function Products() {
  const [searchTerm, setSearchTerm] = useState("")

  const [filterCategory, setFilterCategory] = useState("Tất cả")

  const [sortBy, setSortBy] = useState("Mặc định")

  // Extract unique eyebrows for category filter

  const categories = useMemo(() => {
    const cats = new Set<string>()

    products.forEach((p) => {
      if (p.eyebrow) cats.add(p.eyebrow)
    })

    return ["Tất cả", ...Array.from(cats)]
  }, [])

  const filteredAndSortedProducts = useMemo(() => {
    let result = [...products]

    // Filter by category (eyebrow)

    if (filterCategory !== "Tất cả") {
      result = result.filter((p) => p.eyebrow === filterCategory)
    }

    // Filter by search

    if (searchTerm.trim() !== "") {
      const lowerSearch = searchTerm.toLowerCase()

      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(lowerSearch) ||
          (p.description &&
            p.description.toLowerCase().includes(lowerSearch)) ||
          (p.eyebrow && p.eyebrow.toLowerCase().includes(lowerSearch)),
      )
    }

    // Sort

    if (sortBy !== "Mặc định") {
      result.sort((a, b) => {
        if (sortBy === "Tên A-Z") return a.name.localeCompare(b.name)

        if (sortBy === "Tên Z-A") return b.name.localeCompare(a.name)

        const priceA = parseInt(a.price.replace(/\D/g, "")) || 0

        const priceB = parseInt(b.price.replace(/\D/g, "")) || 0

        if (sortBy === "Giá thấp đến cao") return priceA - priceB

        if (sortBy === "Giá cao đến thấp") return priceB - priceA

        return 0
      })
    }

    return result
  }, [searchTerm, filterCategory, sortBy])

  return (
    <>
      <section className="shop-hero">
        <div className="reveal">
          <p className="kicker">Bộ sưu tập Kiến Tích Việt</p>
          <h1>
            Những dấu tích <em>trong lòng bàn tay.</em>
          </h1>
          <p className="hero-description">
            Mỗi bộ mô hình là một công trình di sản thu nhỏ — tự tay lắp ghép,
            trưng bày và chạm NFC để nghe câu chuyện phía sau.
          </p>
        </div>
        <div className="shop-hero-stats reveal">
          <div className="hero-stat-card">
            <span className="stat-index">01</span>
            <div className="stat-info">
              <strong>Tự tay lắp ghép</strong>
              <span>Gỗ tự nhiên · Cắt mộng chuẩn xác</span>
            </div>
          </div>
          <div className="hero-stat-card">
            <span className="stat-index">02</span>
            <div className="stat-info">
              <strong>Trưng bày nghệ thuật</strong>
              <span>Tỉ lệ chuẩn di sản · Điểm nhấn không gian</span>
            </div>
          </div>
          <div className="hero-stat-card">
            <span className="stat-index">03</span>
            <div className="stat-info">
              <strong>Chạm NFC khám phá</strong>
              <span>Lắng nghe tích xưa & trải nghiệm văn hóa</span>
            </div>
          </div>
        </div>
      </section>

      <section
        className="products section-pad"
        id="products"
        style={{ paddingTop: 40 }}
      >
        <div className="shop-controls reveal">
          <div className="shop-search">
            <input
              type="text"
              placeholder="Tìm kiếm tác phẩm di sản..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm ? (
              <button
                onClick={() => setSearchTerm("")}
                aria-label="Xóa tìm kiếm"
              >
                <Icon name="close" size={16} />
              </button>
            ) : null}
          </div>
          <div className="shop-chips" role="tablist" aria-label="Lọc theo địa danh">
            {categories.map((c) => (
              <button
                key={c}
                role="tab"
                aria-selected={filterCategory === c}
                className={`shop-chip-tab ${filterCategory === c ? "is-active" : ""}`}
                onClick={() => setFilterCategory(c)}
              >
                {c}
              </button>
            ))}
          </div>
          <div className="shop-sort-wrap">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              aria-label="Sắp xếp"
            >
              <option value="Mặc định">Sắp xếp: Mặc định</option>
              <option value="Tên A-Z">Tên A-Z</option>
              <option value="Tên Z-A">Tên Z-A</option>
              <option value="Giá thấp đến cao">Giá: Thấp đến cao</option>
              <option value="Giá cao đến thấp">Giá: Cao đến thấp</option>
            </select>
          </div>
        </div>

        {filteredAndSortedProducts.length > 0 ? (
          <div className="product-grid">
            {filteredAndSortedProducts.map((product) => (
              <article
                className={`product-card reveal ${product.accent === "Sắp ra mắt" ? "is-upcoming" : ""}`}
                key={product.id}
                data-slug={product.slug}
              >
                <Link
                  to={`/products/${product.slug}`}
                  className="product-image"
                  aria-label={`Xem ${product.name}`}
                >
                  <img src={product.image} alt={product.name} />
                  <span className="product-number">{product.number}</span>
                  <span
                    className={`product-accent badge-${product.accent === "Mới" ? "new" : product.accent === "Bán chạy" ? "bestseller" : "upcoming"}`}
                  >
                    {product.accent}
                  </span>
                  <span className="product-view">
                    <Icon name="plus" /> Xem chi tiết
                  </span>
                </Link>
                <div className="product-info">
                  <div className="product-info-top">
                    <p className="product-eyebrow">{product.eyebrow}</p>
                    <h3 className="product-title">
                      <Link to={`/products/${product.slug}`}>
                        {product.name}
                        <span className="title-arrow" aria-hidden="true"> →</span>
                      </Link>
                    </h3>
                    {product.description && (
                      <p className="shop-desc">
                        {product.description}
                      </p>
                    )}
                    <div className="product-card-meta">
                      <span>{product.specifications?.pieces || "100+"} mảnh</span>
                      <i>·</i>
                      <span>{product.specifications?.time || "3–4 giờ"}</span>
                      <i>·</i>
                      <span>Chạm NFC</span>
                    </div>
                  </div>
                  <div className="product-price-row">
                    <div className="price-block">
                      {product.accent === "Sắp ra mắt" ? (
                        <>
                          <span className="price-label">Dự kiến</span>
                          <strong className="product-price">{product.price}</strong>
                        </>
                      ) : (
                        <strong className="product-price">{product.price}</strong>
                      )}
                    </div>
                    <Link
                      to={`/products/${product.slug}`}
                      className="product-inline-cta"
                      aria-label={`Xem chi tiết ${product.name}`}
                    >
                      {product.accent === "Sắp ra mắt" ? "Xem chi tiết" : "Khám phá"}
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="empty-state reveal">
            <p className="empty-state-text">
              Không tìm thấy tác phẩm di sản phù hợp với bộ lọc hiện tại.
            </p>
            <button
              onClick={() => {
                setSearchTerm("")
                setFilterCategory("Tất cả")
                setSortBy("Mặc định")
              }}
              className="button button-dark"
              style={{
                border: "none",
                cursor: "pointer",
              }}
            >
              <span>Xóa bộ lọc</span>
              <Icon name="close" />
            </button>
          </div>
        )}
      </section>

      <section className="statement reveal">
        <div className="statement-mark">“</div>
        <p>Từ những mảnh ghép nhỏ,</p>
        <h2>dựng nên những dấu tích lớn.</h2>
        <LinkButton href="/our-story">Câu chuyện thương hiệu</LinkButton>
        <span className="statement-outline">KIẾN TÍCH VIỆT</span>
      </section>
    </>
  )
}
