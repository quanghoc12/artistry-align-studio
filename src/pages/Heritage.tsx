import { useParams, Link } from "react-router-dom"

import { Icon, Logo, LinkButton } from "../components/Shared"

import { products } from "../data/products"

export default function Heritage() {
  const { id } = useParams<{ id: string }>()

  const currentSlug = id || products[0]?.slug || "chua-mot-cot"
  const product = products.find((p) => p.slug === currentSlug) || products[0]

  if (!product) {
    return (
      <div
        className="site-shell"
        style={{
          background: "#111",
          color: "#fff",
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <h1 style={{ color: "var(--red)", marginBottom: "15px" }}>
          Không tìm thấy nội dung di sản
        </h1>
        <p style={{ color: "var(--muted)", marginBottom: "30px" }}>
          Nội dung bạn đang tìm kiếm không tồn tại hoặc đã được di dời.
        </p>
        <LinkButton href="/">Trở về trang chủ</LinkButton>
      </div>
    )
  }

  const otherHeritages = products.filter((p) => p.slug !== product.slug)

  return (
    <div
      className="site-shell"
      style={{
        background: "#111",
        color: "#fff",
        minHeight: "100vh",
        overflowX: "hidden",
      }}
    >
      <header
        className="site-header"
        style={{
          borderBottom: "1px solid rgba(255,255,255,0.1)",
          position: "absolute",
          width: "100%",
          zIndex: 10,
        }}
      >
        <Logo horizontal light />
        <nav
          className="main-nav"
          style={{
            opacity: 1,
            position: "static",
            background: "transparent",
            flexDirection: "row",
            padding: 0,
            transform: "none",
            pointerEvents: "auto",
          }}
        >
          <Link to="/" style={{ color: "#fff" }}>
            Trang chủ
          </Link>
          <Link to="/our-story" style={{ color: "#fff" }}>
            Câu chuyện
          </Link>
        </nav>
        <div className="header-actions">
          <Link
            to={`/products/${product.slug}`}
            className="menu-button"
            style={{ color: "#fff" }}
          >
            <Icon name="close" size={24} />
          </Link>
        </div>
      </header>

      <main
        style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
      >
        {/* Hero Section */}
        <div
          style={{
            position: "relative",
            height: "70vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
          }}
        >
          <img
            src={product.image}
            alt={product.name}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              opacity: 0.5,
              zIndex: 0,
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: "0",
              left: "0",
              width: "100%",
              background: "linear-gradient(transparent, rgba(0,0,0,0.9))",
              padding: "60px 5vw 40px",
              zIndex: 5,
            }}
          >
            <p
              className="kicker"
              style={{ color: "var(--red)", marginBottom: "10px" }}
            >
              CHUYỆN DI SẢN
            </p>
            <h1
              style={{
                fontSize: "clamp(40px, 6vw, 64px)",
                margin: "0 0 15px",
                lineHeight: 1.1,
                fontFamily: '"Vollkorn", serif',
                color: "#fff",
              }}
            >
              {product.name}
            </h1>
          </div>
        </div>

        <div style={{ background: "#111", padding: "60px 5vw 100px" }}>
          {/* Introduction */}
          <section
            className="reveal"
            style={{
              maxWidth: "800px",
              margin: "0 auto 60px",
              textAlign: "center",
            }}
          >
            <p
              style={{
                fontSize: "20px",
                lineHeight: 1.6,
                color: "rgba(255,255,255,0.8)",
              }}
            >
              [NỘI DUNG GIỚI THIỆU CHỜ CUNG CẤP]
            </p>
          </section>

          {/* Heritage Cards / Destinations */}
          <section
            id="destinations"
            className="reveal"
            style={{ marginBottom: "80px", scrollMarginTop: "120px" }}
          >
            <h3
              style={{
                fontSize: "24px",
                color: "var(--gold)",
                marginBottom: "30px",
                fontFamily: '"Vollkorn", serif',
                textAlign: "center",
              }}
            >
              Khám phá các điểm đến di sản
            </h3>
            <div
              className="reveal"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: "30px",
                maxWidth: "1200px",
                margin: "0 auto",
              }}
            >
              {products.map((p) => (
                <div
                  key={p.id}
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    borderRadius: "8px",
                    overflow: "hidden",
                  }}
                >
                  <img
                    src={p.image}
                    alt={p.name}
                    style={{
                      width: "100%",
                      height: "200px",
                      objectFit: "cover",
                    }}
                  />
                  <div style={{ padding: "20px" }}>
                    <h4
                      style={{
                        fontSize: "20px",
                        color: "#fff",
                        marginBottom: "10px",
                        fontFamily: '"Vollkorn", serif',
                      }}
                    >
                      {p.name}
                    </h4>
                    <p
                      style={{
                        color: "rgba(255,255,255,0.6)",
                        fontSize: "14px",
                        marginBottom: "20px",
                        display: "-webkit-box",
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {p.description || "[NỘI DUNG LỊCH SỬ CHỜ CUNG CẤP]"}
                    </p>
                    <Link
                      to={`/heritage/${p.slug}`}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "8px",
                        color: "var(--gold)",
                        fontSize: "14px",
                        textTransform: "uppercase",
                        letterSpacing: "0.1em",
                        fontWeight: "bold",
                      }}
                    >
                      Khám phá <Icon name="plus" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <div
            id="story"
            className="reveal"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "60px",
              maxWidth: "1200px",
              margin: "0 auto",
              scrollMarginTop: "120px",
            }}
          >
            {/* Individual Heritage Story */}
            <div>
              <h3
                style={{
                  fontSize: "28px",
                  color: "var(--gold)",
                  marginBottom: "25px",
                  fontFamily: '"Vollkorn", serif',
                }}
              >
                Câu chuyện di sản
              </h3>
              <p
                style={{
                  lineHeight: 1.7,
                  color: "rgba(255,255,255,0.8)",
                  marginBottom: "20px",
                }}
              >
                [NỘI DUNG LỊCH SỬ CHỜ CUNG CẤP]
              </p>

              <h3
                style={{
                  fontSize: "28px",
                  color: "var(--gold)",
                  margin: "45px 0 25px",
                  fontFamily: '"Vollkorn", serif',
                }}
              >
                Kiến trúc & Văn hóa
              </h3>
              <p style={{ lineHeight: 1.7, color: "rgba(255,255,255,0.8)" }}>
                [THÔNG TIN KIẾN TRÚC CHỜ CUNG CẤP]
              </p>
            </div>

            <div>
              {/* Product Connection */}
              <div
                style={{
                  background: "var(--red)",
                  padding: "35px",
                  borderRadius: "8px",
                  marginBottom: "40px",
                }}
              >
                <p
                  style={{
                    color: "var(--cream)",
                    fontSize: "14px",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    marginBottom: "10px",
                  }}
                >
                  Khám phá mô hình
                </p>
                <h3
                  style={{
                    fontSize: "28px",
                    color: "#fff",
                    marginBottom: "20px",
                    fontFamily: '"Vollkorn", serif',
                  }}
                >
                  {product.name}
                </h3>
                <img
                  src={product.image}
                  alt={product.name}
                  style={{
                    width: "100%",
                    height: "200px",
                    objectFit: "cover",
                    marginBottom: "25px",
                    borderRadius: "4px",
                  }}
                />
                <LinkButton href={`/products/${product.slug}`} dark>
                  Xem chi tiết sản phẩm
                </LinkButton>
              </div>

              {/* Audio */}
              <div
                style={{
                  background: "rgba(255,255,255,0.05)",
                  padding: "35px",
                  borderRadius: "8px",
                  marginBottom: "40px",
                }}
              >
                <h3
                  style={{
                    fontSize: "22px",
                    color: "#fff",
                    marginBottom: "15px",
                    fontFamily: '"Vollkorn", serif',
                  }}
                >
                  Nghe câu chuyện di sản
                </h3>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "20px",
                    marginTop: "20px",
                    opacity: 0.5,
                  }}
                >
                  <div
                    style={{
                      background: "rgba(255,255,255,0.2)",
                      borderRadius: "50%",
                      width: "50px",
                      height: "50px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Icon name="play" />
                  </div>
                  <div>
                    <strong style={{ display: "block", fontSize: "15px" }}>
                      [NỘI DUNG AUDIO CHỜ CUNG CẤP]
                    </strong>
                  </div>
                </div>
              </div>

              {/* AR */}
              <div
                style={{
                  background: "rgba(255,255,255,0.05)",
                  padding: "35px",
                  borderRadius: "8px",
                }}
              >
                <h3
                  style={{
                    fontSize: "22px",
                    color: "#fff",
                    marginBottom: "15px",
                    fontFamily: '"Vollkorn", serif',
                  }}
                >
                  Trải nghiệm AR
                </h3>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "column",
                    padding: "40px 0",
                    opacity: 0.5,
                  }}
                >
                  <span
                    style={{
                      color: "rgba(255,255,255,0.5)",
                      marginBottom: "15px",
                    }}
                  >
                    <Icon name="cube" size={48} />
                  </span>
                  <strong style={{ fontSize: "15px" }}>
                    [MÔ HÌNH 3D CHỜ CUNG CẤP]
                  </strong>
                </div>
              </div>
            </div>
          </div>

          {/* Related heritage/product exploration */}
          <section
            className="reveal"
            style={{
              marginTop: "80px",
              paddingTop: "60px",
              borderTop: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <h3
              style={{
                fontSize: "24px",
                color: "#fff",
                marginBottom: "30px",
                fontFamily: '"Vollkorn", serif',
                textAlign: "center",
              }}
            >
              Hành trình tiếp theo
            </h3>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "20px",
                flexWrap: "wrap",
              }}
            >
              {otherHeritages.map((p) => (
                <Link
                  to={`/heritage/${p.slug}`}
                  key={p.id}
                  style={{
                    padding: "15px 30px",
                    background: "rgba(255,255,255,0.05)",
                    borderRadius: "30px",
                    color: "#fff",
                    textDecoration: "none",
                    transition: "background 0.2s",
                  }}
                >
                  Đến {p.name} →
                </Link>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
