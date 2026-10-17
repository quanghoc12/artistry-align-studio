import { useState, useEffect, useRef } from "react"

import { useParams, Link } from "react-router-dom"

import { Icon, LinkButton } from "../components/Shared"

import AudioGuidePlayer from "../components/AudioGuidePlayer"

import { products, findProduct } from "../data/products"

import {
  Sparkles,
  Box,
  ArrowRight,
  BookOpen,
  Compass,
  Layers,
  X,
} from "lucide-react"

import ModelViewer3D from "../components/ModelViewer3D"

export default function Heritage() {
  const { id } = useParams<{ id: string }>()

  const currentSlug = id || products[0]?.slug || "thap-rua"

  const product = findProduct(currentSlug) || products[0]

  if (!product) {
    return (
      <div
        className="site-shell"
        style={{
          background: "#150a0b",

          color: "#fff7ec",

          height: "100vh",

          display: "flex",

          flexDirection: "column",

          alignItems: "center",

          justifyContent: "center",
        }}
      >
        <h1
          style={{
            color: "var(--red)",
            marginBottom: "15px",
            fontFamily: '"Vollkorn", serif',
          }}
        >
          Không tìm thấy nội dung di sản
        </h1>
        <p style={{ color: "rgba(255, 235, 209, 0.7)", marginBottom: "30px" }}>
          Nội dung bạn đang tìm kiếm không tồn tại hoặc đã được di dời.
        </p>
        <LinkButton href="/">Trở về trang chủ</LinkButton>
      </div>
    )
  }

  const otherHeritages = products.filter((p) => p.slug !== product.slug)

  const isThapRua = product.slug === "thap-rua"

  const isChuaMotCot = product.slug === "chua-mot-cot"

  const [is3DModalOpen, setIs3DModalOpen] = useState(false)

  const open3DButtonRef = useRef<HTMLButtonElement>(null)

  const scrollPositionRef = useRef<number>(0)

  useEffect(() => {
    if (is3DModalOpen) {
      scrollPositionRef.current = window.scrollY
      document.body.style.overflow = "hidden"

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          setIs3DModalOpen(false)
        }
      }

      window.addEventListener("keydown", handleKeyDown)

      return () => {
        window.removeEventListener("keydown", handleKeyDown)
        document.body.style.overflow = ""
      }
    } else {
      document.body.style.overflow = ""

      // Reliably restore previous scroll position on closing 3D viewer
      if (scrollPositionRef.current > 0) {
        window.scrollTo({
          top: scrollPositionRef.current,
          behavior: "instant",
        })
      }

      if (open3DButtonRef.current) {
        open3DButtonRef.current.focus({ preventScroll: true })
      }
    }
  }, [is3DModalOpen])

  // Prefetch 3D model files in background to eliminate load wait time
  useEffect(() => {
    const timer = setTimeout(() => {
      const glbLink = document.createElement("link")
      glbLink.rel = "prefetch"
      glbLink.href = "/models/Thap-rua-model.glb"
      glbLink.as = "fetch"
      glbLink.crossOrigin = "anonymous"
      document.head.appendChild(glbLink)

      const usdzLink = document.createElement("link")
      usdzLink.rel = "prefetch"
      usdzLink.href = "/models/Thap-rua-model.usdz"
      usdzLink.as = "fetch"
      document.head.appendChild(usdzLink)
    }, 1200)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div
      className="heritage-page site-shell"
      style={{
        background: "#150a0b",

        color: "#fff7ec",

        minHeight: "100vh",

        overflowX: "hidden",
      }}
    >
      <main
        style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
      >
        {/* Hero Section */}
        <div
          style={{
            position: "relative",

            height: "clamp(480px, 62vh, 620px)",

            display: "flex",

            alignItems: "flex-end",

            justifyContent: "flex-start",

            overflow: "hidden",
          }}
        >
          {/* Background Heritage Image with centered crop */}
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

              objectPosition: "center 32%",

              opacity: 0.62,

              zIndex: 0,
            }}
          />

          {/* Multi-layered warm lacquer gradient overlay */}
          <div
            style={{
              position: "absolute",

              inset: 0,

              background:
                "linear-gradient(to top, #150a0b 0%, rgba(21, 10, 11, 0.82) 32%, rgba(21, 10, 11, 0.3) 68%, rgba(0, 0, 0, 0.45) 100%)",

              zIndex: 1,
            }}
          />

          {/* Hero Typography & Kicker */}
          <div
            style={{
              position: "relative",

              width: "100%",

              maxWidth: "1280px",

              margin: "0 auto",

              padding: "0 clamp(24px, 5vw, 80px) 48px",

              zIndex: 5,
            }}
          >
            {/* Elegant Kicker Badge */}
            <div style={{ marginBottom: "16px" }}>
              <span
                style={{
                  display: "inline-flex",

                  alignItems: "center",

                  gap: "8px",

                  padding: "6px 14px",

                  borderRadius: "99px",

                  background: "rgba(143, 0, 25, 0.55)",

                  border: "1px solid rgba(255, 209, 141, 0.32)",

                  color: "var(--gold)",

                  fontSize: "12px",

                  letterSpacing: "0.15em",

                  textTransform: "uppercase",

                  fontWeight: 600,

                  backdropFilter: "blur(6px)",
                }}
              >
                <Sparkles size={13} />
                {isThapRua
                  ? "HÀ NỘI · KIẾN TRÚC DI SẢN"
                  : isChuaMotCot
                    ? "HÀ NỘI · DI SẢN SỐ 02"
                    : `${product.eyebrow.split("·")[0]?.trim() || "DI SẢN"} · SỐ ${product.number}`}
              </span>
            </div>

            {/* Heritage Name */}
            <h1
              style={{
                fontSize: "clamp(40px, 6vw, 68px)",

                margin: "0 0 12px",

                lineHeight: 1.1,

                fontFamily: '"Vollkorn", serif',

                color: "#fff7ec",

                textShadow: "0 4px 20px rgba(0, 0, 0, 0.6)",
              }}
            >
              {product.name}
            </h1>

            {/* Heritage Subtitle */}
            <p
              style={{
                fontSize: "clamp(16px, 2vw, 20px)",

                color: "rgba(255, 235, 209, 0.85)",

                margin: 0,

                maxWidth: "700px",

                lineHeight: 1.5,

                fontFamily: '"Vollkorn", serif',

                fontStyle: "italic",
              }}
            >
              {isThapRua
                ? "Dấu ấn kiến trúc bên Hồ Hoàn Kiếm · Chứng nhân những đổi thay của Hà Nội"
                : isChuaMotCot
                  ? "Diên Hựu Tự nghìn năm văn hiến · Đóa sen gỗ vươn mình giữa lòng hồ Linh Chiểu"
                  : "Nơi lưu giữ sắc màu tranh dân gian và nét đẹp tinh hoa văn hóa phố cổ Hà Nội"}
            </p>
          </div>
        </div>

        {/* Main Content Area */}
        <div
          style={{
            background: "#150a0b",
            padding: "40px clamp(24px, 5vw, 80px) 100px",
          }}
        >
          {/* Audio Guide Section */}
          {product.audioUrl && (
            <section
              className="reveal"
              style={{
                maxWidth: "920px",

                margin: "0 auto 80px",
              }}
            >
              <div
                style={{
                  textAlign: "center",

                  marginBottom: "28px",
                }}
              >
                <h2
                  style={{
                    fontSize: "clamp(22px, 3vw, 30px)",

                    color: "var(--gold)",

                    fontFamily: '"Vollkorn", serif',

                    marginBottom: "10px",
                  }}
                >
                  {isThapRua
                    ? "LẮNG NGHE CÂU CHUYỆN"
                    : "Không gian Thuyết minh Âm thanh"}
                </h2>
                <p
                  style={{
                    fontSize: "17px",

                    lineHeight: 1.6,

                    color: "rgba(255, 235, 209, 0.82)",

                    maxWidth: "760px",

                    margin: "0 auto",
                  }}
                >
                  {isThapRua
                    ? "Nằm trên gò đảo nhỏ giữa Hồ Hoàn Kiếm, Tháp Rùa là một trong những biểu tượng quen thuộc của Hà Nội. Với nét kiến trúc giao thoa Đông - Tây cùng những dấu ấn lịch sử gắn liền với Hồ Gươm, công trình đã trở thành một phần trong ký ức và đời sống văn hóa Thủ đô. Hãy cùng Kiến Tích Việt lắng nghe câu chuyện về ngọn tháp giữa lòng hồ xanh."
                    : "Chùa Một Cột (Diên Hựu Tự) – kiệt tác kiến trúc tượng trưng cho đóa sen ngàn năm vươn lên từ mặt nước thanh tịnh của đất Thăng Long. Mời bạn lắng nghe câu chuyện về biểu tượng linh thiêng triều Lý qua bản thuyết minh âm thanh thời gian thực dưới đây."}
                </p>
              </div>

              <AudioGuidePlayer
                audioUrl={product.audioUrl}
                title={
                  isThapRua ? "Tháp Rùa" : product.audioTitle || product.name
                }
                subtitle={
                  isThapRua
                    ? "Chuyện kể giữa lòng Hồ Gươm"
                    : product.audioAuthor ||
                      "Thuyết minh Di sản · Kiến Tích Việt"
                }
                heritageName={product.name}
                coverImage={product.image}
              />
            </section>
          )}

          {/* Heritage Story & Cultural Architecture: Balanced 55/45 Two-Column Layout */}
          <div
            id="story"
            className="reveal"
            style={{
              display: "grid",

              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",

              gap: "60px",

              maxWidth: "1200px",

              margin: "0 auto 90px",

              scrollMarginTop: "120px",
            }}
          >
            {/* Column Left (55%): Deep Narrative, Ancient Chronicles & Architecture */}
            <div
              style={{ display: "flex", flexDirection: "column", gap: "32px" }}
            >
              {/* Ancient Chronicle Quote Block */}
              <div
                style={{
                  background:
                    "linear-gradient(135deg, #241315 0%, #190c0e 100%)",

                  borderLeft: "3px solid var(--gold)",

                  borderTop: "1px solid rgba(255, 209, 141, 0.15)",

                  borderRight: "1px solid rgba(255, 209, 141, 0.15)",

                  borderBottom: "1px solid rgba(255, 209, 141, 0.15)",

                  padding: "26px 28px",

                  borderRadius: "0 12px 12px 0",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    marginBottom: "12px",
                  }}
                >
                  <BookOpen size={16} color="var(--gold)" />
                  <span
                    style={{
                      fontSize: "12px",

                      textTransform: "uppercase",

                      letterSpacing: "0.15em",

                      color: "var(--gold)",

                      fontWeight: 600,
                    }}
                  >
                    {isThapRua
                      ? "Ký ức Thăng Long · Huyền tích Hồ Gươm"
                      : "Thư tịch cổ · Đại Việt Sử Ký Toàn Thư"}
                  </span>
                </div>
                <blockquote
                  style={{
                    margin: 0,

                    fontSize: "16.5px",

                    lineHeight: 1.7,

                    color: "rgba(255, 235, 209, 0.9)",

                    fontFamily: '"Vollkorn", serif',

                    fontStyle: "italic",
                  }}
                >
                  {isThapRua
                    ? "“Hồ Gươm soi bóng tháp thiêng, nơi gắn liền với huyền tích vua Lê Lợi trao trả gươm thần cho Rùa Vàng sau ngày toàn thắng giặc Minh — biểu tượng bất diệt cho ước vọng thái bình của muôn dân nước Việt...”"
                    : "“Mùa đông tháng 10 năm Kỷ Dậu (1049), dựng chùa Diên Hựu. Vua Lý Thái Tông chiêm bao thấy Phật Quan Âm dắt lên tòa sen, bèn sai dựng chùa, xây cột đá ở giữa hồ, làm tòa sen của Phật Quan Âm đặt trên cột như đã thấy trong mộng...”"}
                </blockquote>
              </div>

              {/* Story Chapter 1 */}
              <div>
                <h3
                  style={{
                    fontSize: "26px",

                    color: "var(--gold)",

                    marginBottom: "16px",

                    fontFamily: '"Vollkorn", serif',

                    display: "flex",

                    alignItems: "center",

                    gap: "10px",
                  }}
                >
                  <Compass size={22} />{" "}
                  {isThapRua
                    ? "Huyền tích Hồ Hoàn Kiếm & Rùa Vàng"
                    : "Huyền tích khởi lập (Năm 1049)"}
                </h3>
                {isThapRua ? (
                  <>
                    <p
                      style={{
                        lineHeight: 1.75,

                        color: "rgba(255, 235, 209, 0.85)",

                        fontSize: "16px",

                        marginBottom: "16px",
                      }}
                    >
                      Nằm trên gò đảo nhỏ giữa làn nước xanh biếc của Hồ Hoàn
                      Kiếm, Tháp Rùa gắn liền với truyền thuyết trả gươm thần
                      của vua Lê Thái Tổ sau cuộc kháng chiến Lam Sơn toàn
                      thắng. Nơi đây được xem là chốn hội tụ linh khí của đất
                      trời Thăng Long, biểu trưng cho tinh thần thượng võ và
                      khát vọng hòa bình muôn thuở của dân tộc.
                    </p>
                    <p
                      style={{
                        lineHeight: 1.75,

                        color: "rgba(255, 235, 209, 0.85)",

                        fontSize: "16px",
                      }}
                    >
                      Mỗi buổi sớm sương mờ hay chiều hoàng hôn buông xuống,
                      bóng tháp nghiêng mình soi mặt nước biếc, tạo nên nét chấm
                      phá thi vị đầy chất thơ giữa lòng đô thị phồn hoa.
                    </p>
                  </>
                ) : (
                  <>
                    <p
                      style={{
                        lineHeight: 1.75,

                        color: "rgba(255, 235, 209, 0.85)",

                        fontSize: "16px",

                        marginBottom: "16px",
                      }}
                    >
                      Theo huyền sử, vua Lý Thái Tông tuổi cao chưa có hoàng tử
                      nối dõi, thường đến cầu tự ở các chùa. Một đêm, ngài chiêm
                      bao thấy Bồ Tát Quan Âm tọa thiền trên tòa sen tỏa ánh hào
                      quang rực rỡ, đưa tay dắt nhà vua lên đài. Sau đó hoàng
                      hậu hạ sinh hoàng tử.
                    </p>
                    <p
                      style={{
                        lineHeight: 1.75,

                        color: "rgba(255, 235, 209, 0.85)",

                        fontSize: "16px",
                      }}
                    >
                      Để tạ ơn hồng ân Tam Bảo, nhà vua cho dựng một ngôi chùa
                      đặt tên là <strong>Diên Hựu</strong>
                      (nghĩa là "Phước lành dài lâu") với dáng dấp một đóa hoa
                      sen vươn lên giữa hồ nước Linh Chiểu, trở thành biểu tượng
                      của tâm hồn thuần khiết và lòng từ bi của dân tộc.
                    </p>
                  </>
                )}
              </div>

              {/* Story Chapter 2: Unique Architecture */}
              <div>
                <h3
                  style={{
                    fontSize: "26px",

                    color: "var(--gold)",

                    marginBottom: "16px",

                    fontFamily: '"Vollkorn", serif',

                    display: "flex",

                    alignItems: "center",

                    gap: "10px",
                  }}
                >
                  <Layers size={22} />{" "}
                  {isThapRua
                    ? "Dấu ấn kiến trúc giao thoa Đông - Tây"
                    : "Triết lý kiến trúc: Trời tròn Đất vuông"}
                </h3>
                {isThapRua ? (
                  <>
                    <p
                      style={{
                        lineHeight: 1.75,

                        color: "rgba(255, 235, 209, 0.85)",

                        fontSize: "16px",

                        marginBottom: "16px",
                      }}
                    >
                      Khác với các công trình kiến trúc thuần Việt, Tháp Rùa
                      mang vẻ đẹp giao thoa độc đáo giữa nét vòm cửa Gothic châu
                      Âu và phần mái đao uốn cong thanh thoát của kiến trúc đền
                      chùa Á Đông. Công trình gồm ba tầng tháp nhỏ dần lên cao,
                      bốn mặt trổ cửa vòm cân xứng.
                    </p>
                    <p
                      style={{
                        lineHeight: 1.75,

                        color: "rgba(255, 235, 209, 0.85)",

                        fontSize: "16px",
                      }}
                    >
                      Trải qua hơn một thế kỷ dãi dầu mưa nắng, Tháp Rùa đã trở
                      thành chứng nhân lặng lẽ chứng kiến biết bao thăng trầm và
                      đổi thay của Thủ đô Hà Nội, lắng đọng lại thành một phần
                      máu thịt trong tâm thức mỗi người Việt.
                    </p>
                  </>
                ) : (
                  <>
                    <p
                      style={{
                        lineHeight: 1.75,

                        color: "rgba(255, 235, 209, 0.85)",

                        fontSize: "16px",

                        marginBottom: "16px",
                      }}
                    >
                      Khác với cấu trúc chùa chiền truyền thống nhiều gian, Chùa
                      Một Cột sở hữu giải pháp kiến trúc độc nhất vô nhị trên
                      thế giới: Toàn bộ ngôi chùa gỗ hình vuông (mỗi cạnh 3m)
                      được nâng đỡ bởi
                      <strong> một cột đá trụ tròn duy nhất</strong> có đường
                      kính 1.2m, chôn sâu vững chãi giữa lòng hồ.
                    </p>
                    <p
                      style={{
                        lineHeight: 1.75,

                        color: "rgba(255, 235, 209, 0.85)",

                        fontSize: "16px",
                      }}
                    >
                      Cột đá tròn tượng trưng cho Trời (Dương), mái chùa vuông
                      tượng trưng cho Đất (Âm), bốn góc mái đao cong mềm mại vút
                      lên tựa những cánh sen xòe nở. Hệ thống giằng mộng gỗ đòn
                      tay vươn ra từ cột đá là minh chứng đỉnh cao cho kỹ thuật
                      ghép mộng mộc truyền thống của thợ tài hoa đất Thăng Long.
                    </p>
                  </>
                )}
              </div>
            </div>

            {/* Column Right (45%): Wooden Model Craft & AR Experience */}
            <div
              style={{ display: "flex", flexDirection: "column", gap: "35px" }}
            >
              {/* Product Card: Royal Deep Lacquer Ruby (Refined, no harsh red) */}
              <div
                style={{
                  background:
                    "linear-gradient(145deg, #380e15 0%, #220a0e 100%)",

                  padding: "36px",

                  borderRadius: "16px",

                  border: "1px solid rgba(255, 209, 141, 0.28)",

                  boxShadow:
                    "0 18px 45px rgba(0, 0, 0, 0.5), 0 0 30px rgba(143, 0, 25, 0.2)",

                  position: "relative",

                  overflow: "hidden",
                }}
              >
                <div style={{ position: "relative", zIndex: 2 }}>
                  <p
                    style={{
                      color: "var(--gold)",

                      fontSize: "12px",

                      textTransform: "uppercase",

                      letterSpacing: "0.15em",

                      fontWeight: 600,

                      marginBottom: "8px",
                    }}
                  >
                    MÔ HÌNH LẮP GHÉP GỖ NGUYÊN BẢN
                  </p>
                  <h3
                    style={{
                      fontSize: "26px",

                      color: "#fff7ec",

                      marginBottom: "16px",

                      fontFamily: '"Vollkorn", serif',
                    }}
                  >
                    Mô hình {product.name}
                  </h3>

                  <div
                    style={{
                      borderRadius: "10px",

                      overflow: "hidden",

                      marginBottom: "20px",

                      border: "1px solid rgba(255, 209, 141, 0.2)",
                    }}
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      style={{
                        width: "100%",

                        height: "220px",

                        objectFit: "cover",

                        display: "block",
                      }}
                    />
                  </div>

                  <p
                    style={{
                      fontSize: "14.5px",

                      lineHeight: 1.6,

                      color: "rgba(255, 235, 209, 0.8)",

                      marginBottom: "24px",
                    }}
                  >
                    {product.description}
                  </p>

                  <div
                    style={{
                      display: "flex",

                      alignItems: "center",

                      justifyContent: "space-between",

                      flexWrap: "wrap",

                      gap: "15px",

                      paddingTop: "15px",

                      borderTop: "1px solid rgba(255, 209, 141, 0.15)",
                    }}
                  >
                    <div>
                      <span
                        style={{
                          fontSize: "12px",

                          display: "block",

                          color: "rgba(255, 235, 209, 0.6)",

                          textTransform: "uppercase",
                        }}
                      >
                        {product.accent === "Sắp ra mắt"
                          ? "Giá dự kiến"
                          : "Giá phát hành"}
                      </span>
                      <strong
                        style={{ fontSize: "22px", color: "var(--gold)" }}
                      >
                        {product.price}
                      </strong>
                    </div>

                    <Link
                      to={`/products/${product.slug}`}
                      style={{
                        display: "inline-flex",

                        alignItems: "center",

                        gap: "8px",

                        padding: "12px 24px",

                        borderRadius: "99px",

                        background:
                          "linear-gradient(135deg, var(--gold) 0%, #e8ba75 100%)",

                        color: "#351b18",

                        fontWeight: 700,

                        fontSize: "14px",

                        textTransform: "uppercase",

                        letterSpacing: "0.08em",

                        boxShadow: "0 6px 20px rgba(0, 0, 0, 0.3)",

                        transition: "transform 0.2s ease",
                      }}
                    >
                      Khám phá chi tiết <ArrowRight size={16} />
                    </Link>
                  </div>
                </div>
              </div>

              {/* AR 3D Experience Portal Card */}
              <div
                style={{
                  background:
                    "linear-gradient(145deg, #201215 0%, #15090b 100%)",

                  padding: "32px",

                  borderRadius: "16px",

                  border: "1px solid rgba(255, 209, 141, 0.18)",

                  boxShadow: "0 12px 35px rgba(0, 0, 0, 0.4)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    marginBottom: "14px",
                  }}
                >
                  <div
                    style={{
                      width: "36px",

                      height: "36px",

                      borderRadius: "8px",

                      background: "rgba(143, 0, 25, 0.6)",

                      display: "flex",

                      alignItems: "center",

                      justifyContent: "center",

                      color: "var(--gold)",

                      border: "1px solid rgba(255, 209, 141, 0.25)",
                    }}
                  >
                    <Box size={20} />
                  </div>
                  <div>
                    <h3
                      style={{
                        fontSize: "20px",

                        color: "#fff7ec",

                        fontFamily: '"Vollkorn", serif',

                        margin: 0,
                      }}
                    >
                      Trải nghiệm Không gian AR & 3D
                    </h3>
                    <span style={{ fontSize: "12px", color: "var(--gold)" }}>
                      Thực tế tăng cường trên điện thoại
                    </span>
                  </div>
                </div>

                <p
                  style={{
                    fontSize: "14.5px",

                    lineHeight: 1.6,

                    color: "rgba(255, 235, 209, 0.75)",

                    marginBottom: "20px",
                  }}
                >
                  {isThapRua
                    ? "Quan sát mô hình Tháp Rùa 3D từ nhiều góc nhìn, phóng to để khám phá từng chi tiết thiết kế. Với thiết bị hỗ trợ AR, bạn còn có thể đặt mô hình ảo vào không gian thực thông qua camera điện thoại."
                    : "Chiêm ngưỡng từng chi tiết mộng gỗ di sản xoay 360 độ hoặc đặt trực tiếp mô hình vào không gian phòng của bạn thông qua camera và chip NFC gắn kèm sản phẩm."}
                </p>

                <div
                  style={{
                    background: "rgba(0, 0, 0, 0.3)",

                    borderRadius: "10px",

                    padding: "16px",

                    border: "1px dashed rgba(255, 209, 141, 0.2)",

                    display: "flex",

                    alignItems: "center",

                    justifyContent: "space-between",

                    flexWrap: "wrap",

                    gap: "15px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <span
                      style={{
                        width: "8px",

                        height: "8px",

                        borderRadius: "50%",

                        background: "#10b981",

                        boxShadow: "0 0 10px #10b981",
                      }}
                    />
                    <span
                      style={{
                        fontSize: "13px",
                        color: "rgba(255, 235, 209, 0.85)",
                      }}
                    >
                      Hỗ trợ iOS (QuickLook) & Android (WebXR)
                    </span>
                  </div>

                  <button
                    ref={open3DButtonRef}
                    type="button"
                    onClick={() => setIs3DModalOpen(true)}
                    className="cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
                    style={{
                      display: "inline-flex",

                      alignItems: "center",

                      gap: "8px",

                      minHeight: "44px",

                      padding: "10px 20px",

                      borderRadius: "8px",

                      background:
                        "linear-gradient(135deg, var(--gold) 0%, #e8ba75 100%)",

                      border: "1px solid rgba(255, 209, 141, 0.4)",

                      color: "#351b18",

                      fontSize: "12.5px",

                      fontWeight: 700,

                      textTransform: "uppercase",

                      letterSpacing: "0.06em",

                      boxShadow: "0 4px 15px rgba(0, 0, 0, 0.35)",

                      transition: "transform 0.2s ease, box-shadow 0.2s ease",
                    }}
                    aria-haspopup="dialog"
                    aria-expanded={is3DModalOpen}
                    aria-controls="heritage-3d-dialog"
                  >
                    <Box size={16} />
                    <span>Xem mẫu 3D</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Heritage Cards / Explore Destinations (High contrast, improved readability) */}
          <section
            id="destinations"
            className="reveal"
            style={{ marginBottom: "90px", scrollMarginTop: "120px" }}
          >
            <div style={{ textAlign: "center", marginBottom: "40px" }}>
              <p
                style={{
                  color: "var(--gold)",

                  fontSize: "13px",

                  textTransform: "uppercase",

                  letterSpacing: "0.15em",

                  marginBottom: "8px",

                  fontWeight: 600,
                }}
              >
                KHO TÀNG KIẾN TRÚC VIỆT
              </p>
              <h3
                style={{
                  fontSize: "clamp(26px, 3.5vw, 36px)",

                  color: "#fff7ec",

                  fontFamily: '"Vollkorn", serif',

                  margin: 0,
                }}
              >
                Khám phá các điểm đến di sản
              </h3>
            </div>

            <div
              className="reveal"
              style={{
                display: "grid",

                gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",

                gap: "32px",

                maxWidth: "1200px",

                margin: "0 auto",
              }}
            >
              {products.map((p) => {
                const isCurrent = p.slug === product.slug

                return (
                  <div
                    key={p.id}
                    style={{
                      background: isCurrent
                        ? "linear-gradient(145deg, #2a1217 0%, #1a0b0e 100%)"
                        : "linear-gradient(145deg, #201214 0%, #170a0c 100%)",

                      borderRadius: "14px",

                      border: isCurrent
                        ? "1px solid rgba(255, 209, 141, 0.45)"
                        : "1px solid rgba(255, 209, 141, 0.16)",

                      overflow: "hidden",

                      boxShadow: "0 12px 30px rgba(0, 0, 0, 0.4)",

                      display: "flex",

                      flexDirection: "column",

                      justifyContent: "space-between",

                      transition: "transform 0.3s ease, border-color 0.3s ease",
                    }}
                  >
                    <div>
                      {/* Image container with subtle zoom effect */}
                      <div
                        style={{
                          height: "210px",
                          overflow: "hidden",
                          position: "relative",
                        }}
                      >
                        <img
                          src={p.image}
                          alt={p.name}
                          style={{
                            width: "100%",

                            height: "100%",

                            objectFit: "cover",

                            transition: "transform 0.5s ease",
                          }}
                        />
                        {isCurrent && (
                          <span
                            style={{
                              position: "absolute",

                              top: "14px",

                              right: "14px",

                              padding: "4px 10px",

                              borderRadius: "99px",

                              background: "rgba(143, 0, 25, 0.85)",

                              border: "1px solid rgba(255, 209, 141, 0.4)",

                              color: "var(--gold)",

                              fontSize: "11px",

                              fontWeight: 600,

                              textTransform: "uppercase",

                              letterSpacing: "0.1em",
                            }}
                          >
                            Đang xem
                          </span>
                        )}
                      </div>

                      <div style={{ padding: "24px 24px 16px" }}>
                        <p
                          style={{
                            color: "var(--gold)",

                            fontSize: "12px",

                            textTransform: "uppercase",

                            letterSpacing: "0.1em",

                            marginBottom: "6px",
                          }}
                        >
                          {p.eyebrow}
                        </p>
                        <h4
                          style={{
                            fontSize: "22px",

                            color: "#fff7ec",

                            marginBottom: "10px",

                            fontFamily: '"Vollkorn", serif',

                            fontWeight: 600,
                          }}
                        >
                          {p.name}
                        </h4>
                        <p
                          style={{
                            color: "rgba(255, 235, 209, 0.8)",

                            fontSize: "14.5px",

                            lineHeight: 1.6,

                            marginBottom: "0",

                            display: "-webkit-box",

                            WebkitLineClamp: 3,

                            WebkitBoxOrient: "vertical",

                            overflow: "hidden",
                          }}
                        >
                          {p.description}
                        </p>
                      </div>
                    </div>

                    <div style={{ padding: "0 24px 24px" }}>
                      <Link
                        to={`/heritage/${p.slug}`}
                        style={{
                          display: "inline-flex",

                          alignItems: "center",

                          gap: "8px",

                          color: "var(--gold)",

                          fontSize: "13.5px",

                          textTransform: "uppercase",

                          letterSpacing: "0.1em",

                          fontWeight: "bold",

                          paddingTop: "14px",

                          borderTop: "1px solid rgba(255, 209, 141, 0.12)",

                          width: "100%",
                        }}
                      >
                        Khám phá di sản <ArrowRight size={15} />
                      </Link>
                    </div>
                  </div>
                )
              })}
            </div>
          </section>

          {/* Section: Next Heritage Journey Destination Cards (High Polish) */}
          <section
            className="reveal"
            style={{
              marginTop: "40px",

              paddingTop: "60px",

              borderTop: "1px solid rgba(255, 209, 141, 0.16)",

              maxWidth: "1200px",

              margin: "0 auto",
            }}
          >
            <div style={{ textAlign: "center", marginBottom: "36px" }}>
              <p
                style={{
                  color: "var(--gold)",

                  fontSize: "12px",

                  textTransform: "uppercase",

                  letterSpacing: "0.15em",

                  marginBottom: "8px",

                  fontWeight: 600,
                }}
              >
                TIẾP TỤC HÀNH TRÌNH
              </p>
              <h3
                style={{
                  fontSize: "28px",

                  color: "#fff7ec",

                  fontFamily: '"Vollkorn", serif',

                  margin: 0,
                }}
              >
                Hành trình di sản tiếp theo
              </h3>
            </div>

            <div
              style={{
                display: "grid",

                gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",

                gap: "28px",
              }}
            >
              {otherHeritages.map((p) => (
                <Link
                  to={`/heritage/${p.slug}`}
                  key={p.id}
                  style={{
                    position: "relative",

                    height: "170px",

                    borderRadius: "14px",

                    overflow: "hidden",

                    border: "1px solid rgba(255, 209, 141, 0.2)",

                    boxShadow: "0 10px 25px rgba(0, 0, 0, 0.4)",

                    display: "flex",

                    alignItems: "flex-end",

                    padding: "24px",

                    textDecoration: "none",

                    transition: "transform 0.3s ease, border-color 0.3s ease",
                  }}
                  className="group"
                >
                  <img
                    src={p.image}
                    alt={p.name}
                    style={{
                      position: "absolute",

                      inset: 0,

                      width: "100%",

                      height: "100%",

                      objectFit: "cover",

                      opacity: 0.5,

                      transition: "transform 0.5s ease",
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",

                      inset: 0,

                      background:
                        "linear-gradient(to top, rgba(16, 7, 8, 0.95) 0%, rgba(20, 8, 10, 0.55) 60%, rgba(0, 0, 0, 0.2) 100%)",
                    }}
                  />

                  <div
                    style={{
                      position: "relative",

                      zIndex: 2,

                      width: "100%",

                      display: "flex",

                      alignItems: "center",

                      justifyContent: "space-between",
                    }}
                  >
                    <div>
                      <span
                        style={{
                          fontSize: "11px",

                          textTransform: "uppercase",

                          letterSpacing: "0.15em",

                          color: "var(--gold)",

                          display: "block",

                          marginBottom: "4px",

                          fontWeight: 600,
                        }}
                      >
                        ĐIỂM DỪNG TIẾP THEO
                      </span>
                      <h4
                        style={{
                          fontSize: "22px",

                          color: "#fff7ec",

                          margin: 0,

                          fontFamily: '"Vollkorn", serif',
                        }}
                      >
                        {p.name}
                      </h4>
                      <span
                        style={{
                          fontSize: "13px",
                          color: "rgba(255, 235, 209, 0.7)",
                        }}
                      >
                        {p.eyebrow}
                      </span>
                    </div>

                    <span
                      style={{
                        width: "42px",

                        height: "42px",

                        borderRadius: "50%",

                        background: "rgba(143, 0, 25, 0.7)",

                        border: "1px solid rgba(255, 209, 141, 0.35)",

                        display: "flex",

                        alignItems: "center",

                        justifyContent: "center",

                        color: "var(--gold)",

                        flexShrink: 0,
                      }}
                    >
                      <ArrowRight size={18} />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </main>

      {/* 3D & AR Interactive Modal Dialog */}
      {is3DModalOpen && (
        <div
          id="heritage-3d-dialog"
          role="dialog"
          aria-modal="true"
          aria-labelledby="heritage-3d-modal-title"
          className="fixed inset-0 z-[9999] flex items-center justify-center p-0 sm:p-4 md:p-6 bg-black/90"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setIs3DModalOpen(false)
            }
          }}
        >
          <div
            className="w-full h-full sm:h-[90vh] sm:max-h-[820px] max-w-[1080px] flex flex-col sm:rounded-2xl overflow-hidden shadow-2xl relative"
            style={{
              background: "linear-gradient(145deg, #250f13 0%, #16080a 100%)",
              border: "1px solid rgba(255, 209, 141, 0.35)",
              boxShadow:
                "0 25px 60px rgba(0, 0, 0, 0.75), 0 0 40px rgba(143, 0, 25, 0.25)",
            }}
          >
            {/* Modal Body: 3D Viewer with unified, integrated header and single close button */}
            <div className="flex-1 relative min-h-0 w-full flex">
              <ModelViewer3D
                src={product.modelUrl || "/models/Thap-rua-model.glb"}
                iosSrc={product.usdzUrl || "/models/Thap-rua-model.usdz"}
                poster={product.image}
                alt={`Mô hình 3D tương tác ${product.name} - Di sản Kiến Tích Việt`}
                title={product.name}
                onClose={() => setIs3DModalOpen(false)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
