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
    products.forEach(p => {
      if (p.eyebrow) cats.add(p.eyebrow)
    })
    return ["Tất cả", ...Array.from(cats)]
  }, [])

  const filteredAndSortedProducts = useMemo(() => {
    let result = [...products]

    // Filter by category (eyebrow)
    if (filterCategory !== "Tất cả") {
      result = result.filter(p => p.eyebrow === filterCategory)
    }

    // Filter by search
    if (searchTerm.trim() !== "") {
      const lowerSearch = searchTerm.toLowerCase()
      result = result.filter(p => 
        p.name.toLowerCase().includes(lowerSearch) ||
        (p.description && p.description.toLowerCase().includes(lowerSearch)) ||
        (p.eyebrow && p.eyebrow.toLowerCase().includes(lowerSearch))
      )
    }

    // Sort
    if (sortBy !== "Mặc định") {
      result.sort((a, b) => {
        if (sortBy === "Tên A-Z") return a.name.localeCompare(b.name)
        if (sortBy === "Tên Z-A") return b.name.localeCompare(a.name)
        
        const priceA = parseInt(a.price.replace(/\D/g, '')) || 0
        const priceB = parseInt(b.price.replace(/\D/g, '')) || 0
        
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
          <h1>Những dấu tích <em>trong lòng bàn tay.</em></h1>
          <p className="hero-description">Mỗi bộ mô hình là một công trình di sản thu nhỏ — tự tay lắp ghép, trưng bày và chạm NFC để nghe câu chuyện phía sau.</p>
        </div>
        <div className="shop-hero-stats reveal">
          <div><b>{products.length}</b><span>Mô hình di sản</span></div>
          <div><Icon name="cube" size={28} /><span>Lắp ghép gỗ</span></div>
          <div><Icon name="nfc" size={28} /><span>Chạm NFC</span></div>
        </div>
      </section>

      <section className="products section-pad" id="products" style={{ paddingTop: 40 }}>
        <div className="shop-controls reveal">
          <div className="shop-search">
            <input type="text" placeholder="Tìm kiếm sản phẩm..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            {searchTerm ? (
              <button onClick={() => setSearchTerm("")} aria-label="Xóa tìm kiếm"><Icon name="close" size={16} /></button>
            ) : null}
          </div>
          <div className="shop-chips">
            {categories.map((c) => (
              <button key={c} className={filterCategory === c ? "is-active" : ""} onClick={() => setFilterCategory(c)}>{c}</button>
            ))}
          </div>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} aria-label="Sắp xếp">
            <option value="Mặc định">Mặc định</option>
            <option value="Tên A-Z">Tên A-Z</option>
            <option value="Tên Z-A">Tên Z-A</option>
            <option value="Giá thấp đến cao">Giá thấp đến cao</option>
            <option value="Giá cao đến thấp">Giá cao đến thấp</option>
          </select>
        </div>

        {filteredAndSortedProducts.length > 0 ? (
          <div className="product-grid">
            {filteredAndSortedProducts.map((product) => (
              <article className="product-card reveal" key={product.id}>
                <Link
                  to={`/products/${product.slug}`}
                  className="product-image"
                  aria-label={`Xem ${product.name}`}
                >
                  <img src={product.image} alt={product.name} />
                  <span className="product-number">{product.number}</span>
                  <span className="product-accent">{product.accent}</span>
                  <span className="product-view">
                    <Icon name="plus" /> Xem chi tiết
                  </span>
                </Link>
                <div className="product-info">
                  <div>
                    <p>{product.eyebrow}</p>
                    <h3>
                      <Link to={`/products/${product.slug}`}>{product.name}</Link>
                    </h3>
                    {product.description && (
                      <p style={{ marginTop: '10px', fontSize: '14px', opacity: 0.8, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {product.description}
                      </p>
                    )}
                  </div>
                  <strong style={{ marginTop: '15px', display: 'block' }}>{product.price}</strong>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="empty-state reveal" style={{ textAlign: 'center', padding: '60px 20px', backgroundColor: 'rgba(0,0,0,0.02)', borderRadius: '12px', width: '100%' }}>
            <p style={{ fontSize: '16px', marginBottom: '20px', opacity: 0.7 }}>Không tìm thấy sản phẩm phù hợp.</p>
            <button 
              onClick={() => {
                setSearchTerm("");
                setFilterCategory("Tất cả");
                setSortBy("Mặc định");
              }}
              className="button button-dark"
              style={{
                border: 'none',
                cursor: 'pointer'
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
