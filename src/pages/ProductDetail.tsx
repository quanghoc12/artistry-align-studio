import { useParams, Link } from "react-router-dom"

import { products, findProduct, ProductVariant } from "../data/products"

import { Icon, LinkButton } from "../components/Shared"

import { useCart } from "../context/CartContext"

import { useState, useRef, useEffect } from "react"

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>()

  const { addToCart } = useCart()

  const [playing, setPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const product = findProduct(slug)
  const variants = product?.detailedInfo?.variants || []
  const [selectedVariantId, setSelectedVariantId] = useState<string>(
    variants[0]?.id || "",
  )

  useEffect(() => {
    setPlaying(false)
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
    const defaultVar = product?.detailedInfo?.variants?.[0]?.id || ""
    setSelectedVariantId(defaultVar)
  }, [slug, product])

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
      }
    }
  }, [])

  const handleTogglePlay = async () => {
    const audio = audioRef.current
    if (!audio) return
    if (playing) {
      audio.pause()
      setPlaying(false)
    } else {
      try {
        await audio.play()
        setPlaying(true)
      } catch (err) {
        console.error("Không thể phát âm thanh:", err)
      }
    }
  }

  if (!product) {
    return (
      <div
        style={{ paddingTop: "200px", textAlign: "center", minHeight: "60vh" }}
      >
        <h2>Sản phẩm không tồn tại</h2>
        <LinkButton href="/products">Quay lại bộ sưu tập</LinkButton>
      </div>
    )
  }

  const selectedVariant: ProductVariant | undefined =
    variants.find((v) => v.id === selectedVariantId) || variants[0]

  const handleAddVariantToCart = (variant?: ProductVariant) => {
    const targetVariant = variant || selectedVariant
    if (targetVariant) {
      addToCart({
        ...product,
        id: `${product.id}-${targetVariant.id}`,
        name: `${product.name} - Bản ${targetVariant.name}`,
        price: targetVariant.price,
      })
    } else {
      addToCart(product)
    }
  }

  const renderSpecCellValue = (val: string | undefined) => {
    if (!val) return <span className="pd-spec-badge-no">-</span>
    if (val.trim().toLowerCase() === "không") {
      return <span className="pd-spec-badge-no">Không</span>
    }
    if (val.trim().toLowerCase() === "có") {
      return <span className="pd-spec-badge-yes">✓ Có</span>
    }
    return <span>{val}</span>
  }

  return (
    <>
      <div
        style={{
          padding: "150px 5vw 80px",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div
          className="product-modal"
          style={{
            position: "relative",
            top: "auto",
            left: "auto",
            transform: "none",
            maxHeight: "none",
            boxShadow: "0 20px 40px rgba(0,0,0,0.05)",
          }}
        >
          <div className="modal-image reveal" style={{ position: "relative" }}>
            <img
              className="reveal-image"
              src={product.image}
              alt={product.name}
            />
            <span>
              {product.detailedInfo
                ? `Mô hình gỗ 3D · ${product.detailedInfo.generalInfo.material}`
                : "Mô hình gỗ · Tỉ lệ 1:120"}
            </span>
          </div>
          <div className="modal-copy reveal stagger-1">
            <p className="kicker">{product.eyebrow}</p>
            <h2>{product.name}</h2>
            {product.detailedInfo?.fullTitle && (
              <p className="pd-subtitle">{product.detailedInfo.fullTitle}</p>
            )}
            <p>{product.description}</p>

            {/* Interactive Version Picker (Outlined active state so primary CTA remains unique) */}
            {variants.length > 0 && selectedVariant && (
              <div className="pd-variant-picker">
                <div className="pd-variant-picker-head">
                  <span className="pd-variant-picker-label">
                    Chọn phiên bản ({variants.length} phiên bản)
                  </span>
                  <a href="#bang-thong-so" className="pd-compare-jump">
                    Xem bảng so sánh ↓
                  </a>
                </div>
                <div
                  className="pd-variant-tabs"
                  role="radiogroup"
                  aria-label="Chọn phiên bản sản phẩm"
                >
                  {variants.map((v) => {
                    const isActive = v.id === selectedVariant.id
                    return (
                      <button
                        key={v.id}
                        type="button"
                        role="radio"
                        aria-checked={isActive}
                        className={`pd-variant-tab ${isActive ? "is-active" : ""}`}
                        onClick={() => setSelectedVariantId(v.id)}
                      >
                        <span className="pd-variant-tab-name">
                          <span>{v.name}</span>
                          <span className="pd-variant-radio" aria-hidden="true">
                            ✓
                          </span>
                        </span>
                        <span className="pd-variant-tab-price">{v.price}</span>
                      </button>
                    )
                  })}
                </div>
                <div className="pd-variant-active-summary">
                  <strong>
                    {selectedVariant.fullName} · {selectedVariant.tagline}
                  </strong>
                  <p>{selectedVariant.description}</p>
                </div>
              </div>
            )}

            <div
              className="specs"
              style={{ margin: "24px 0", padding: "18px 0" }}
            >
              <span>
                <small>Chất liệu chính</small>
                <strong>{product.specifications.material}</strong>
              </span>
              <span>
                <small>Kích thước</small>
                <strong>
                  {product.specifications.size.replace(/^Khoảng\s+/i, "~")}
                </strong>
              </span>
              <span>
                <small>Đối tượng</small>
                <strong>{product.specifications.audience}</strong>
              </span>
            </div>

            {!product.detailedInfo && (
              <div style={{ marginTop: "16px" }}>
                <p>
                  <small>Số mảnh:</small>{" "}
                  <strong>
                    {product.specifications.pieces &&
                    product.specifications.pieces !== "xxx"
                      ? `${product.specifications.pieces} mảnh`
                      : "Đang cập nhật"}
                  </strong>
                </p>
                <p>
                  <small>Độ khó:</small>{" "}
                  <strong>{product.specifications.difficulty}</strong>
                </p>
                <p>
                  <small>Trọng lượng:</small>{" "}
                  <strong>{product.specifications.weight}</strong>
                </p>
              </div>
            )}

            <div className="modal-buy" style={{ marginTop: "28px" }}>
              <div className="pd-buy-price-wrap">
                {selectedVariant && (
                  <span className="pd-buy-version-tag">
                    Phiên bản: {selectedVariant.fullName}
                  </span>
                )}
                <strong>
                  {selectedVariant ? selectedVariant.price : product.price}
                </strong>
              </div>
              <button onClick={() => handleAddVariantToCart()}>
                <span>Thêm vào giỏ</span>
                <Icon name="bag" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* DETAILED PRODUCT INFO, VERSIONS & SPECIFICATION TABLE */}
      {product.detailedInfo && (
        <section className="pd-details-section" id="chi-tiet-san-pham">
          <div className="pd-details-container">
            {/* 1. Giới thiệu chung về sản phẩm */}
            <div className="pd-overview-grid reveal">
              <div className="pd-overview-story">
                <p className="kicker" style={{ marginBottom: "14px" }}>
                  01. Giới thiệu chung về sản phẩm
                </p>
                <h3>{product.detailedInfo.fullTitle}</h3>
                <div className="pd-story-paragraphs">
                  {product.detailedInfo.introParagraphs.map(
                    (paragraph, idx) => (
                      <p key={idx}>{paragraph}</p>
                    ),
                  )}
                </div>
              </div>

              <aside className="pd-general-card">
                <h4>Thông tin tổng quan</h4>
                <ul className="pd-general-list">
                  <li>
                    <small>Tên sản phẩm</small>
                    <strong>
                      {product.detailedInfo.generalInfo.productName}
                    </strong>
                  </li>
                  <li>
                    <small>Kích thước mô hình</small>
                    <strong>
                      {product.detailedInfo.generalInfo.dimensions}
                    </strong>
                  </li>
                  <li>
                    <small>Chất liệu chính</small>
                    <strong>{product.detailedInfo.generalInfo.material}</strong>
                  </li>
                  <li>
                    <small>Đối tượng phù hợp</small>
                    <strong>
                      {product.detailedInfo.generalInfo.targetAudience}
                    </strong>
                  </li>
                  <li>
                    <small>Phiên bản phát hành</small>
                    <strong>
                      {variants.length} phiên bản (
                      {variants.map((v) => v.name).join(", ")})
                    </strong>
                  </li>
                </ul>
              </aside>
            </div>

            {/* 2. Chi tiết các phiên bản */}
            <div className="pd-versions-block reveal">
              <p className="kicker" style={{ marginBottom: "14px" }}>
                02. Các phiên bản trải nghiệm
              </p>
              <h3>Lựa chọn phiên bản phù hợp với bạn</h3>
              <div className="pd-version-cards">
                {variants.map((v, idx) => {
                  const isSelected = selectedVariant?.id === v.id
                  return (
                    <article
                      key={v.id}
                      className={`pd-version-card ${isSelected ? "is-selected" : ""}`}
                    >
                      <div className="pd-version-card-top">
                        <div className="pd-version-badge-row">
                          <span className="pd-version-index">
                            Phiên bản 0{idx + 1} · {v.name}
                          </span>
                          {isSelected && (
                            <span className="pd-version-selected-pill">
                              ✓ Đang chọn
                            </span>
                          )}
                        </div>
                        <h4>{v.fullName}</h4>
                        <div className="pd-version-price">Giá: {v.price}</div>
                        <p className="pd-version-desc">{v.description}</p>
                        <ul className="pd-version-highlights">
                          {v.highlights.map((hl, hlIdx) => (
                            <li key={hlIdx}>{hl}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="pd-version-actions">
                        <button
                          type="button"
                          className={`pd-version-select-btn ${isSelected ? "is-active" : ""}`}
                          onClick={() => setSelectedVariantId(v.id)}
                        >
                          <span>
                            {isSelected ? "✓ Đang chọn" : "Chọn phiên bản"}
                          </span>
                        </button>
                        <button
                          type="button"
                          className="pd-version-btn"
                          onClick={() => {
                            setSelectedVariantId(v.id)
                            handleAddVariantToCart(v)
                          }}
                        >
                          <span>Thêm vào giỏ</span>
                          <Icon name="bag" size={16} />
                        </button>
                      </div>
                    </article>
                  )
                })}
              </div>
            </div>

            {/* 3. Bảng thông số kỹ thuật */}
            <div className="pd-specs-table-block reveal" id="bang-thong-so">
              <p className="kicker" style={{ marginBottom: "14px" }}>
                03. So sánh phiên bản
              </p>
              <h3>Bảng thông số kỹ thuật</h3>
              <div className="pd-table-scroll-hint">
                <span>↔ Vuốt ngang để xem đầy đủ các cột</span>
              </div>
              <div className="pd-table-wrap">
                <table className="pd-spec-table">
                  <thead>
                    <tr>
                      <th>Thông số</th>
                      {variants.map((v) => {
                        const isColActive = selectedVariant?.id === v.id
                        return (
                          <th
                            key={v.id}
                            className={isColActive ? "is-active-col" : ""}
                            onClick={() => setSelectedVariantId(v.id)}
                            style={{ cursor: "pointer" }}
                            title={`Chọn phiên bản ${v.name}`}
                          >
                            <span>{v.name}</span>
                            <span className="pd-th-price">{v.price}</span>
                          </th>
                        )
                      })}
                    </tr>
                  </thead>
                  <tbody>
                    {product.detailedInfo.specTable.map((row) => (
                      <tr key={row.label}>
                        <td>{row.label}</td>
                        {variants.map((v) => {
                          const isColActive = selectedVariant?.id === v.id
                          return (
                            <td
                              key={v.id}
                              className={isColActive ? "is-active-col" : ""}
                            >
                              {renderSpecCellValue(row.values[v.id])}
                            </td>
                          )
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="intro section-pad">
        <div className="section-heading reveal">
          <p className="kicker">Hành trình trải nghiệm</p>
          <h2>
            Khám phá
            <br />
            từng mảnh ghép.
          </h2>
        </div>
        <div className="steps steps-four">
          {[
            [
              "01",
              "Open",
              "Mở hộp",
              "Bắt đầu hành trình với những mảnh ghép gỗ được sắp xếp tinh tế.",
            ],
            [
              "02",
              "Build",
              "Lắp ghép",
              "Lắp từng mảnh gỗ, cảm nhận cấu trúc nguyên bản của di sản.",
            ],
            [
              "03",
              "Complete",
              "Hoàn thiện",
              "Hoàn thiện mô hình và biến nó thành một dấu tích đáng tự hào.",
            ],
            [
              "04",
              "Discover",
              "Khám phá",
              "Chạm NFC và khám phá câu chuyện phía sau di sản.",
            ],
          ].map(([number, en, title, text]) => (
            <article className="step-card reveal" key={number}>
              <span className="step-number">{number}</span>
              <div className="step-icon">
                <Icon
                  name={
                    number === "01"
                      ? "box"
                      : number === "02"
                        ? "cube"
                        : number === "03"
                          ? "sparkle"
                          : "nfc"
                  }
                  size={30}
                />
              </div>
              <p className="step-en">{en}</p>
              <h3>{title}</h3>
              <p>{text}</p>
              <span className="step-line" />
            </article>
          ))}
        </div>
      </section>

      <section className="tech section-pad">
        <div className="tech-visual reveal">
          <div className="phone">
            <div className="phone-screen">
              <audio
                ref={audioRef}
                src={product.audioUrl || "/audio/thap-rua.mp3"}
                preload="none"
                onEnded={() => setPlaying(false)}
                onPause={() => setPlaying(false)}
                onPlay={() => setPlaying(true)}
              />
              <span className="phone-label">Kiến Tích Việt</span>
              <img src={product.image} alt={product.name} />
              <button
                type="button"
                className={`play-button ${playing ? "is-playing" : ""}`}
                onClick={handleTogglePlay}
                aria-label={playing ? "Tạm dừng audio" : "Phát audio"}
              >
                <Icon name={playing ? "close" : "play"} size={25} />
              </button>
              <div className="audio-copy">
                <small>{playing ? "Đang nghe" : "Thuyết minh Audio"}</small>
                <strong>
                  {product.audioTitle || `Sự tích ${product.name}`}
                </strong>
                <span className={`audio-wave ${playing ? "is-playing" : ""}`}>
                  {Array.from({ length: 17 }).map((_, index) => (
                    <i key={index} />
                  ))}
                </span>
              </div>
            </div>
          </div>
          <div className="nfc-pulse pulse-one" />
          <div className="nfc-pulse pulse-two" />
          <div className="nfc-tag">
            <Icon name="nfc" size={38} />
            <span>Chạm NFC</span>
          </div>
        </div>
        <div className="tech-copy reveal">
          <p className="kicker light">Công nghệ</p>
          <h2>
            Chạm để
            <br />
            mở hành trình.
          </h2>
          <div className="tech-features">
            <div>
              <Icon name="nfc" />
              <span>
                <strong>NFC</strong> Chạm để mở hành trình
              </span>
            </div>
            <div>
              <Icon name="headphones" />
              <span>
                <strong>Audio</strong> Nghe câu chuyện
              </span>
            </div>
            <div>
              <Icon name="phone" />
              <span>
                <strong>AR</strong> Khám phá di sản trong không gian tương tác
              </span>
            </div>
          </div>
          <LinkButton href={`/heritage/${product.slug}`} dark>
            Khám phá trải nghiệm số
          </LinkButton>
        </div>
      </section>

      {/* RELATED PRODUCTS SECTION */}
      <section className="related-products section-pad">
        <div className="section-heading reveal">
          <p className="kicker">Khám phá thêm</p>
          <h2>CÓ THỂ BẠN CŨNG QUAN TÂM</h2>
        </div>
        <div className="product-grid" style={{ marginTop: "40px" }}>
          {products
            .filter((p) => p.id !== product.id)
            .slice(0, 3)
            .map((relatedProduct) => (
              <article className="product-card reveal" key={relatedProduct.id}>
                <Link
                  to={`/products/${relatedProduct.slug}`}
                  className="product-image"
                  aria-label={`Xem ${relatedProduct.name}`}
                >
                  <img
                    className="reveal-image"
                    src={relatedProduct.image}
                    alt={relatedProduct.name}
                  />
                  <span className="product-number">
                    {relatedProduct.number}
                  </span>
                  <span
                    className={`product-accent badge-${
                      relatedProduct.accent === "Mới"
                        ? "new"
                        : relatedProduct.accent === "Bán chạy"
                          ? "bestseller"
                          : "upcoming"
                    }`}
                  >
                    {relatedProduct.accent}
                  </span>
                  <span className="product-view">
                    <Icon name="plus" /> Xem chi tiết
                  </span>
                </Link>
                <div className="product-info">
                  <div>
                    <p className="product-eyebrow">{relatedProduct.eyebrow}</p>
                    <h3 className="product-title">
                      <Link to={`/products/${relatedProduct.slug}`}>
                        {relatedProduct.name}
                      </Link>
                    </h3>
                  </div>
                  <div className="product-price-row">
                    <div className="price-block">
                      {relatedProduct.accent === "Sắp ra mắt" ? (
                        <>
                          <span className="price-label">Dự kiến</span>
                          <strong className="product-price">
                            {relatedProduct.price}
                          </strong>
                        </>
                      ) : (
                        <>
                          {relatedProduct.detailedInfo?.variants &&
                            relatedProduct.detailedInfo.variants.length > 1 && (
                              <span className="price-label">Giá chỉ từ</span>
                            )}
                          <strong className="product-price">
                            {relatedProduct.price}
                          </strong>
                        </>
                      )}
                    </div>
                    <Link
                      to={`/products/${relatedProduct.slug}`}
                      className="product-inline-cta"
                    >
                      Khám phá
                    </Link>
                  </div>
                </div>
              </article>
            ))}
        </div>
      </section>
    </>
  )
}
