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
  Smartphone,
  RotateCcw,
  Maximize2,
  ZoomIn,
  ZoomOut,
  RefreshCw,
  CheckCircle2,
} from "lucide-react"

import ModelViewer3D from "../components/ModelViewer3D"
import HeritageHub from "../components/HeritageHub"

export default function Heritage() {
  const { id } = useParams<{ id: string }>()

  // If no ID is specified in URL (e.g. visiting /heritage), show the selection hub
  if (!id) {
    return <HeritageHub />
  }

  const product = findProduct(id)

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
        <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", justifyContent: "center" }}>
          <LinkButton href="/heritage">Xem danh sách di sản</LinkButton>
          <LinkButton href="/">Trở về trang chủ</LinkButton>
        </div>
      </div>
    )
  }

  const otherHeritages = products.filter((p) => p.slug !== product.slug)

  const isThapRua = product.slug === "thap-rua"

  const isChuaMotCot = product.slug === "chua-mot-cot"

  const isHangTrong = product.slug === "pho-hang-trong"

  const [is3DModalOpen, setIs3DModalOpen] = useState(false)

  const [showArGuideModal, setShowArGuideModal] = useState(false)

  const [inlineAutoRotate, setInlineAutoRotate] = useState(true)

  const [isInlineZoomed, setIsInlineZoomed] = useState(false)

  const [hasInteractedInline, setHasInteractedInline] = useState(false)

  const [activeMobileTool, setActiveMobileTool] = useState<string | null>(null)

  const [isIOSDevice, setIsIOSDevice] = useState(false)

  const [isMobileDevice, setIsMobileDevice] = useState(false)

  const inlineViewerRef = useRef<any>(null)

  const open3DButtonRef = useRef<HTMLButtonElement>(null)

  const scrollPositionRef = useRef<number>(0)

  // Detect mobile & iOS for smart AR button label and direct QuickLook launch
  useEffect(() => {
    if (typeof window !== "undefined") {
      const ua = navigator.userAgent || ""
      const ios =
        /iPhone|iPad|iPod/i.test(ua) ||
        (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
      const android = /Android/i.test(ua)
      const mobile =
        ios ||
        android ||
        window.matchMedia("(max-width: 768px)").matches ||
        "ontouchstart" in window
      setIsIOSDevice(ios)
      setIsMobileDevice(mobile)
    }
  }, [])

  // Reset inline 3D state when navigating between heritages
  useEffect(() => {
    setHasInteractedInline(false)
    setIsInlineZoomed(false)
    setInlineAutoRotate(true)
    setShowArGuideModal(false)
  }, [product.slug])

  // Ensure @google/model-viewer is registered for the inline 3D gallery stage
  useEffect(() => {
    if (!product?.modelUrl || typeof window === "undefined") return
    if (customElements.get("model-viewer")) return

    import("@google/model-viewer").catch(() => {
      if (!document.querySelector('script[data-model-viewer="true"]')) {
        const script = document.createElement("script")
        script.type = "module"
        script.src =
          "https://ajax.googleapis.com/ajax/libs/model-viewer/4.3.1/model-viewer.min.js"
        script.setAttribute("data-model-viewer", "true")
        document.head.appendChild(script)
      }
    })
  }, [product?.modelUrl])

  const handleInlineToggleRotate = () => {
    const el = inlineViewerRef.current
    const next = !inlineAutoRotate
    setInlineAutoRotate(next)
    setActiveMobileTool("rotate")
    if (el) {
      if (next) {
        el.setAttribute("auto-rotate", "")
      } else {
        el.removeAttribute("auto-rotate")
      }
    }
  }

  const handleInlineZoomToggle = () => {
    const el = inlineViewerRef.current
    const nextZoom = !isInlineZoomed
    setIsInlineZoomed(nextZoom)
    setHasInteractedInline(true)
    setActiveMobileTool("zoom")
    if (el) {
      el.cameraOrbit = nextZoom ? "35deg 72deg 64%" : "35deg 75deg 98%"
    }
  }

  const handleInlineResetCamera = () => {
    const el = inlineViewerRef.current
    setIsInlineZoomed(false)
    setActiveMobileTool("reset")
    if (el) {
      el.cameraOrbit = "35deg 75deg 98%"
      el.cameraTarget = "auto auto auto"
      if (typeof el.jumpCameraToGoal === "function") {
        el.jumpCameraToGoal()
      }
    }
  }

  const handleInlineArTrigger = () => {
    const el = inlineViewerRef.current
    if (el && el.canActivateAR && typeof el.activateAR === "function") {
      try {
        el.activateAR()
        return
      } catch {
        setShowArGuideModal(true)
      }
    } else {
      setShowArGuideModal(true)
    }
  }

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
    if (!product?.modelUrl) return

    const timer = setTimeout(() => {
      const glbLink = document.createElement("link")
      glbLink.rel = "prefetch"
      glbLink.href = product.modelUrl!
      glbLink.as = "fetch"
      glbLink.crossOrigin = "anonymous"
      document.head.appendChild(glbLink)

      if (product.usdzUrl) {
        const usdzLink = document.createElement("link")
        usdzLink.rel = "prefetch"
        usdzLink.href = product.usdzUrl
        usdzLink.as = "fetch"
        document.head.appendChild(usdzLink)
      }
    }, 1200)

    return () => clearTimeout(timer)
  }, [product?.modelUrl, product?.usdzUrl])

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
            {/* Top Navigation Back Link */}
            <div style={{ marginBottom: "16px" }}>
              <Link
                to="/heritage"
                style={{
                  display: "inline-flex",

                  alignItems: "center",

                  gap: "6px",

                  color: "rgba(255, 235, 209, 0.75)",

                  fontSize: "12px",

                  letterSpacing: "0.1em",

                  textTransform: "uppercase",

                  textDecoration: "none",

                  transition: "color 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "var(--gold)"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "rgba(255, 235, 209, 0.75)"
                }}
              >
                <span>← Khám phá di sản</span>
              </Link>
            </div>

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
                ? "Biểu tượng giữa lòng Hồ Hoàn Kiếm · Dấu ấn lịch sử và kiến trúc Thủ đô"
                : isChuaMotCot
                  ? "Diên Hựu Tự nghìn năm văn hiến · Đóa sen gỗ vươn mình giữa lòng hồ Linh Chiểu"
                  : "Nơi sắc màu dân gian lưu dấu giữa lòng Hà Nội · Ký ức tinh hoa phố nghề xưa"}
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
              id="audio-guide"
              className="reveal"
              style={{
                maxWidth: "920px",

                margin: "0 auto 80px",

                scrollMarginTop: "120px",
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
                    : isHangTrong
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
                    ? "Đeo tai nghe và hòa mình vào thanh âm trầm lắng của Hà Nội xưa. Bản thuyết minh âm thanh sẽ cùng bạn lần giở huyền tích gươm báu, dấu ấn Gò Rùa và những thăng trầm lịch sử qua bao thế kỷ của ngọn tháp rêu phong giữa lòng hồ xanh."
                    : isHangTrong
                      ? "Lắng nghe âm sắc phố nghề và dòng tranh dân gian cổ truyền. Cùng Kiến Tích Việt ngược dòng thời gian về với nhịp sống phố thị nhộn nhịp, kỹ thuật vờn màu độc bản và ký ức văn hóa tao nhã của người Tràng An."
                      : "Lắng nghe câu chuyện về Diên Hựu Tự nghìn năm văn hiến. Mời bạn cùng bước vào hành trình tâm linh từ giấc mộng đài sen của vua Lý Thái Tông đến kiệt tác kiến trúc mộng mộc độc nhất vô nhị giữa lòng Thăng Long."}
                </p>
              </div>

              <AudioGuidePlayer
                key={product.slug}
                audioUrl={product.audioUrl}
                title={
                  isThapRua
                    ? "Tháp Rùa"
                    : isHangTrong
                      ? "Phố Hàng Trống"
                      : product.audioTitle || product.name
                }
                subtitle={
                  isThapRua
                    ? "Biểu tượng giữa lòng Hồ Hoàn Kiếm"
                    : isHangTrong
                      ? "Nơi sắc màu dân gian lưu dấu giữa lòng Hà Nội"
                      : product.audioAuthor ||
                        "Thuyết minh Di sản · Kiến Tích Việt"
                }
                heritageName={product.name}
                coverImage={product.image}
                caption={
                  isThapRua
                    ? "Âm vang Hồ Gươm"
                    : isHangTrong
                      ? "Âm sắc phố nghề"
                      : "Âm vang sen ngọc"
                }
              />
            </section>
          )}

          {/* Heritage Story & Cultural Architecture: Balanced 55/45 Two-Column Layout */}
          <div
            id="story"
            className="reveal heritage-story-grid"
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
              className="heritage-story-narrative"
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
                      ? "Ký ức Thăng Long · Dấu ấn Gò Rùa"
                      : isHangTrong
                        ? "Di sản Phố Nghề · Sắc Màu Dân Gian"
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
                    ? "“Hồ Gươm nước biếc bốn mùa, ngọn tháp rêu phong soi bóng gò xưa. Không chỉ là nét chấm phá cổ kính giữa lòng Hà Nội, Tháp Rùa còn là chứng nhân của lịch sử, nơi lắng đọng linh khí đất trời và ký ức thiêng liêng của người Thăng Long qua bao thăng trầm dâu bể.”"
                    : isHangTrong
                      ? "“Dẫu những cửa hàng xưa đã thưa vắng, những nét khắc trên gỗ và sắc màu trên giấy dó vẫn tiếp tục kể câu chuyện về người Hà Nội, về nghệ thuật dân gian và về những giá trị văn hóa cần được trao truyền cho các thế hệ mai sau.”"
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
                    ? "Nguồn gốc lịch sử & Dấu ấn Gò Rùa"
                    : isHangTrong
                      ? "Ký ức phố nghề xưa & Nơi hội tụ trăm thợ"
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
                      Về nguồn gốc lịch sử, trước khi có Tháp Rùa ngày nay, Gò
                      Rùa từng là nơi tọa lạc của những công trình gắn với các
                      triều đại trước. Theo các tư liệu được ghi lại, dưới thời
                      vua Lê Thánh Tông, nơi đây có Điếu Đài, là nơi nhà vua câu
                      cá và ngâm vịnh thơ ca. Đến thời Lê Trung Hưng, chúa Trịnh
                      cho xây dựng đình Tả Vọng trên gò. Về sau, những công
                      trình này bị phá bỏ và không còn tồn tại.
                    </p>
                    <p
                      style={{
                        lineHeight: 1.75,

                        color: "rgba(255, 235, 209, 0.85)",

                        fontSize: "16px",

                        marginBottom: "16px",
                      }}
                    >
                      Tháp Rùa ngày nay được xây dựng trong khoảng từ giữa năm
                      1884 đến tháng 4/1886, gắn với một nhân vật thường được
                      gọi là Bá hộ Kim. Theo một câu chuyện được lưu truyền, ông
                      nhận thấy Gò Rùa có vị trí đẹp về phong thủy nên muốn xây
                      tháp để an táng hài cốt cha mình. Tuy nhiên, việc an táng
                      được cho là đã không thành công. Công trình vẫn được hoàn
                      thành và ban đầu được gọi là Tháp Bá hộ Kim. Bên cạnh đó,
                      một cách lý giải khác cho rằng Tháp Rùa được xây dựng nhằm
                      tạo thế hậu chẩm cho chùa Báo Ân, một ngôi chùa lớn từng
                      tồn tại gần Hồ Hoàn Kiếm. Những cách lý giải khác nhau cho
                      thấy nguồn gốc và mục đích xây dựng Tháp Rùa vẫn còn những
                      điểm chưa hoàn toàn thống nhất.
                    </p>
                    <p
                      style={{
                        lineHeight: 1.75,

                        color: "rgba(255, 235, 209, 0.85)",

                        fontSize: "16px",
                      }}
                    >
                      Tháp Rùa còn gắn với những dấu ấn lịch sử đáng nhớ. Theo
                      các tư liệu ghi lại, ngày 19/5/1948, chiến sĩ trẻ Nguyễn
                      Trọng Quang cùng đồng đội đã bơi ra Tháp Rùa để treo lá cờ
                      đỏ sao vàng trên đỉnh tháp, ngay trong thời kỳ Hà Nội bị
                      thực dân Pháp chiếm đóng. Sự kiện này trở thành một câu
                      chuyện đặc biệt về tinh thần yêu nước và ý chí đấu tranh
                      của người dân Thủ đô.
                    </p>
                  </>
                ) : isHangTrong ? (
                  <>
                    <p
                      style={{
                        lineHeight: 1.75,

                        color: "rgba(255, 235, 209, 0.85)",

                        fontSize: "16px",

                        marginBottom: "16px",
                      }}
                    >
                      Ngược dòng thời gian, khu vực phố Hàng Trống ngày nay vốn
                      được hình thành từ đất của nhiều thôn xóm cũ, trong đó có
                      Cổ Vũ, Khánh Thụy Hữu và Tự Tháp. Những cộng đồng dân cư
                      với nghề nghiệp và tập quán riêng đã góp phần tạo nên diện
                      mạo đặc trưng của khu phố. Khi người thợ từ các làng nghề
                      lân cận tìm đến đây sinh sống và buôn bán, con phố dần trở
                      thành nơi hội tụ của nhiều nghề thủ công truyền thống.
                    </p>
                    <p
                      style={{
                        lineHeight: 1.75,

                        color: "rgba(255, 235, 209, 0.85)",

                        fontSize: "16px",

                        marginBottom: "16px",
                      }}
                    >
                      Ngày ấy, Hàng Trống không chỉ có một nghề. Người dân từ
                      làng Liên Thượng mang nghề làm trống đến đây, tạo ra nhiều
                      loại trống phục vụ đời sống và các hoạt động văn hóa.
                      Những người thợ từ Đào Xá lại nổi tiếng với nghề làm lọng,
                      làm tàn, tán dùng trong các nghi lễ và tại đình, đền,
                      chùa, miếu. Ở một đoạn khác của phố, những người thợ thêu
                      từ vùng Quất Động, Hướng Dương cũng góp mặt, khiến nơi đây
                      từng có đoạn được gọi là phố Hàng Thêu.
                    </p>
                    <p
                      style={{
                        lineHeight: 1.75,

                        color: "rgba(255, 235, 209, 0.85)",

                        fontSize: "16px",
                      }}
                    >
                      Thế nhưng, giữa những âm thanh của nghề thủ công và nhịp
                      buôn bán ấy, có một nghề đã tạo nên dấu ấn đặc biệt cho
                      Hàng Trống: nghề làm tranh dân gian. Tranh Hàng Trống phát
                      triển mạnh vào cuối thế kỷ XIX, đầu thế kỷ XX, khi người
                      dân Hà Nội vẫn có nhu cầu lớn về tranh để thờ cúng, trang
                      trí nhà cửa và đón Tết. Những bức tranh không đơn thuần
                      dùng để làm đẹp không gian sống, mà còn gửi gắm niềm tin,
                      mong ước bình an, may mắn và cuộc sống sung túc.
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
                    ? "Kiến trúc giao thoa Đông – Tây & Biểu tượng văn hóa"
                    : isHangTrong
                      ? "Kỹ thuật vờn màu độc bản & Giá trị văn hóa"
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
                      Về kiến trúc, Tháp Rùa cao khoảng 8,8 m, gồm ba tầng chính
                      và một tầng đỉnh dạng vọng lâu, với quy mô thu nhỏ dần từ
                      dưới lên trên. Công trình mang nét giao thoa giữa kiến
                      trúc phương Tây và kiến trúc truyền thống Việt Nam. Hai
                      tầng dưới nổi bật với hệ thống cửa vòm nhọn, trong khi các
                      tầng phía trên có những chi tiết mái cong mang dáng dấp
                      kiến trúc Á Đông. Trên mặt phía đông của tầng ba có ba chữ
                      “Quy Sơn Tháp”, nghĩa là Tháp Núi Rùa. Sự kết hợp này tạo
                      nên diện mạo riêng của công trình giữa không gian Hồ Gươm.
                    </p>
                    <p
                      style={{
                        lineHeight: 1.75,

                        color: "rgba(255, 235, 209, 0.85)",

                        fontSize: "16px",
                      }}
                    >
                      Trải qua thời gian, Tháp Rùa không chỉ là một công trình
                      kiến trúc giữa hồ mà còn trở thành biểu tượng gắn liền với
                      Hồ Gươm và Hà Nội. Hình ảnh ngọn tháp xuất hiện trong thơ
                      ca, hội họa, âm nhạc và ký ức của nhiều thế hệ. Giá trị
                      của Tháp Rùa vì thế không chỉ nằm ở tuổi đời hay hình dáng
                      kiến trúc, mà còn ở những câu chuyện lịch sử, văn hóa và
                      tình cảm mà cộng đồng đã gửi gắm vào công trình qua nhiều
                      thế hệ.
                    </p>
                  </>
                ) : isHangTrong ? (
                  <>
                    <p
                      style={{
                        lineHeight: 1.75,

                        color: "rgba(255, 235, 209, 0.85)",

                        fontSize: "16px",

                        marginBottom: "16px",
                      }}
                    >
                      Điều làm nên nét riêng của tranh Hàng Trống nằm ở cách
                      người nghệ nhân tạo ra từng tác phẩm. Họ dùng ván khắc gỗ
                      để in những đường nét chính lên giấy dó, sau đó tự tay tô
                      màu bằng bút lông. Đặc biệt, kỹ thuật vờn màu tạo nên
                      những mảng đậm nhạt mềm mại, khiến bức tranh vừa có đường
                      nét rõ ràng, vừa mang vẻ uyển chuyển và giàu sức sống. Nếu
                      tranh Đông Hồ thường in màu bằng các bản khắc riêng, thì
                      với tranh Hàng Trống, bàn tay và cảm quan màu sắc của
                      người nghệ nhân đóng vai trò đặc biệt quan trọng trong
                      công đoạn hoàn thiện.
                    </p>
                    <p
                      style={{
                        lineHeight: 1.75,

                        color: "rgba(255, 235, 209, 0.85)",

                        fontSize: "16px",

                        marginBottom: "16px",
                      }}
                    >
                      Mỗi bức tranh lại kể một câu chuyện khác nhau. Tranh Ngũ
                      Hổ gắn với tín ngưỡng dân gian; tranh Tố Nữ và Tứ Quý thể
                      hiện vẻ đẹp thanh nhã, hài hòa; còn tranh Lý Ngư Vọng
                      Nguyệt mang đến hình ảnh giàu tính biểu tượng. Có cả những
                      bức tranh tái hiện các nhân vật lịch sử như Hai Bà Trưng,
                      Bà Triệu và Trần Hưng Đạo. Qua từng nét khắc, từng lớp
                      màu, người xưa gửi gắm vào tranh niềm tin, quan niệm thẩm
                      mỹ và những giá trị được truyền từ thế hệ này sang thế hệ
                      khác.
                    </p>
                    <p
                      style={{
                        lineHeight: 1.75,

                        color: "rgba(255, 235, 209, 0.85)",

                        fontSize: "16px",
                      }}
                    >
                      Ngày nay, phố Hàng Trống không còn giữ nguyên không khí
                      của một phố nghề xưa, nhưng tên gọi của nó vẫn gợi nhắc về
                      một thời kỳ mà những người thợ làm trống, làm lọng, thêu
                      thùa và vẽ tranh cùng góp phần tạo nên bản sắc của Hà Nội.
                      Đặc biệt, tranh Hàng Trống vẫn là minh chứng cho sự khéo
                      léo, óc sáng tạo và đời sống tinh thần phong phú của người
                      Việt. Dẫu những cửa hàng xưa đã thưa vắng, những nét khắc
                      trên gỗ và sắc màu trên giấy dó vẫn tiếp tục kể câu chuyện
                      về người Hà Nội, về nghệ thuật dân gian và về những giá
                      trị văn hóa cần được trao truyền cho các thế hệ mai sau.
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

            {/* Column Right (45%): 3D & AR Interactive Showcase Stage (Spotlight #1) + Wooden Craft Model */}
            <div
              className="heritage-story-sidebar"
              style={{ display: "flex", flexDirection: "column", gap: "36px" }}
            >
              {/* SPOTLIGHT #1: Royal Lacquer & Gold Interactive 3D & AR Gallery Showcase */}
              <div
                id="experience-3d"
                className="heritage-3d-card"
                style={{
                  background:
                    "linear-gradient(155deg, #3b0f18 0%, #220a0f 52%, #140609 100%)",
                  borderRadius: "20px",
                  border: "1px solid rgba(255, 209, 141, 0.42)",
                  boxShadow:
                    "0 26px 65px rgba(0, 0, 0, 0.7), 0 0 45px rgba(143, 0, 25, 0.32), inset 0 1px 0 rgba(255, 209, 141, 0.28)",
                  position: "relative",
                  overflow: "hidden",
                  scrollMarginTop: "120px",
                }}
              >
                {/* Ambient Golden-Ruby Spotlight Glow */}
                <div
                  style={{
                    position: "absolute",
                    top: "-18%",
                    right: "-12%",
                    width: "320px",
                    height: "320px",
                    background:
                      "radial-gradient(circle, rgba(255, 209, 141, 0.16) 0%, rgba(143, 0, 25, 0.12) 45%, transparent 70%)",
                    pointerEvents: "none",
                    zIndex: 0,
                  }}
                />

                {/* Top Studio Broadcast Header Bar (Harmonized with AudioGuidePlayer) */}
                <div
                  style={{
                    position: "relative",
                    zIndex: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: "10px",
                    padding: "15px 26px",
                    background: "rgba(0, 0, 0, 0.32)",
                    borderBottom: "1px solid rgba(255, 209, 141, 0.18)",
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
                        width: "30px",
                        height: "30px",
                        borderRadius: "50%",
                        background:
                          "linear-gradient(135deg, #8f0019 0%, #590010 100%)",
                        border: "1px solid rgba(255, 209, 141, 0.45)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "var(--gold)",
                        boxShadow: "0 0 14px rgba(255, 209, 141, 0.25)",
                      }}
                    >
                      <Box size={15} />
                    </span>
                    <span
                      style={{
                        fontSize: "11.5px",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.15em",
                        color: "var(--gold)",
                      }}
                    >
                      TRẢI NGHIỆM TƯƠNG TÁC · 3D & AR
                    </span>
                  </div>

                  <div
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "7px",
                      padding: "4px 12px",
                      borderRadius: "99px",
                      background: product.modelUrl
                        ? "rgba(16, 185, 129, 0.12)"
                        : "rgba(255, 209, 141, 0.1)",
                      border: product.modelUrl
                        ? "1px solid rgba(52, 211, 153, 0.35)"
                        : "1px solid rgba(255, 209, 141, 0.25)",
                    }}
                  >
                    <span
                      className={product.modelUrl ? "animate-pulse" : ""}
                      style={{
                        width: "7px",
                        height: "7px",
                        borderRadius: "50%",
                        background: product.modelUrl
                          ? "#34d399"
                          : "var(--gold)",
                        boxShadow: product.modelUrl
                          ? "0 0 8px #34d399"
                          : "0 0 8px rgba(255, 209, 141, 0.5)",
                      }}
                    />
                    <span
                      style={{
                        fontSize: "11.5px",
                        fontWeight: 600,
                        color: product.modelUrl
                          ? "#a7f3d0"
                          : "rgba(255, 235, 209, 0.8)",
                      }}
                    >
                      {product.modelUrl
                        ? "Sẵn sàng trên thiết bị này"
                        : "Đang số hóa 3D"}
                    </span>
                  </div>
                </div>

                {/* Main Studio Card Body */}
                <div
                  style={{
                    position: "relative",
                    zIndex: 2,
                    padding: "24px 26px 26px",
                  }}
                >
                  {/* Title & Subtitle */}
                  <div style={{ marginBottom: "18px" }}>
                    <h3
                      style={{
                        fontSize: "clamp(22px, 2.4vw, 26px)",
                        color: "#fff7ec",
                        fontFamily: '"Vollkorn", serif',
                        margin: "0 0 6px",
                        lineHeight: 1.22,
                      }}
                    >
                      Khám phá {product.name} trong không gian 3D
                    </h3>
                    <p
                      style={{
                        fontSize: "14.5px",
                        lineHeight: 1.55,
                        color: "rgba(255, 235, 209, 0.8)",
                        margin: 0,
                      }}
                    >
                      Xoay mô hình 360°, quan sát từng chi tiết kiến trúc và đặt
                      mô hình vào không gian thật qua AR.
                    </p>
                  </div>

                  {/* RECESSED ROYAL LACQUER & GOLD 3D VITRINE STAGE (65-70% of Card Area) */}
                  <div
                    className="heritage-3d-viewport relative overflow-hidden select-none flex items-center justify-center"
                    onPointerDown={() => setHasInteractedInline(true)}
                    onWheel={() => setHasInteractedInline(true)}
                    onTouchStart={() => setHasInteractedInline(true)}
                    style={{
                      borderRadius: "16px",
                      marginBottom: "16px",
                      background:
                        "radial-gradient(circle at 50% 42%, rgba(168, 14, 42, 0.52) 0%, rgba(36, 10, 15, 0.95) 58%, #0b0305 100%)",
                      border: "1px solid rgba(255, 209, 141, 0.38)",
                      boxShadow:
                        "inset 0 0 55px rgba(0, 0, 0, 0.8), 0 12px 30px rgba(0, 0, 0, 0.45)",
                    }}
                  >
                    {/* Subtle Architectural Blueprint Grid Background */}
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        backgroundImage:
                          "linear-gradient(rgba(255, 209, 141, 0.055) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 209, 141, 0.055) 1px, transparent 1px)",
                        backgroundSize: "28px 28px",
                        opacity: 0.7,
                        pointerEvents: "none",
                      }}
                    />

                    {/* Warm Golden-Ruby Museum Spotlight Halo Behind Model */}
                    <div
                      style={{
                        position: "absolute",
                        top: "44%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: "300px",
                        height: "300px",
                        borderRadius: "50%",
                        background:
                          "radial-gradient(circle, rgba(255, 209, 141, 0.22) 0%, rgba(143, 0, 25, 0.22) 48%, transparent 72%)",
                        filter: "blur(12px)",
                        pointerEvents: "none",
                        zIndex: 0,
                      }}
                    />

                    {/* Soft Pedestal Floor Glow (Without Dashed Oval Border) */}
                    <div
                      style={{
                        position: "absolute",
                        bottom: "18px",
                        left: "50%",
                        transform: "translateX(-50%)",
                        width: "76%",
                        height: "62px",
                        borderRadius: "50%",
                        background:
                          "radial-gradient(ellipse at center, rgba(255, 209, 141, 0.16) 0%, rgba(143, 0, 25, 0.15) 55%, transparent 75%)",
                        filter: "blur(8px)",
                        pointerEvents: "none",
                        zIndex: 1,
                      }}
                    />

                    {/* 4 Delicate Gold Viewfinder Corner Brackets */}
                    <div
                      style={{
                        position: "absolute",
                        top: "12px",
                        left: "12px",
                        width: "16px",
                        height: "16px",
                        borderTop: "2px solid var(--gold)",
                        borderLeft: "2px solid var(--gold)",
                        opacity: 0.72,
                        pointerEvents: "none",
                        zIndex: 3,
                      }}
                    />
                    <div
                      style={{
                        position: "absolute",
                        top: "12px",
                        right: "12px",
                        width: "16px",
                        height: "16px",
                        borderTop: "2px solid var(--gold)",
                        borderRight: "2px solid var(--gold)",
                        opacity: 0.72,
                        pointerEvents: "none",
                        zIndex: 3,
                      }}
                    />
                    <div
                      style={{
                        position: "absolute",
                        bottom: "12px",
                        left: "12px",
                        width: "16px",
                        height: "16px",
                        borderBottom: "2px solid var(--gold)",
                        borderLeft: "2px solid var(--gold)",
                        opacity: 0.72,
                        pointerEvents: "none",
                        zIndex: 3,
                      }}
                    />
                    <div
                      style={{
                        position: "absolute",
                        bottom: "12px",
                        right: "12px",
                        width: "16px",
                        height: "16px",
                        borderBottom: "2px solid var(--gold)",
                        borderRight: "2px solid var(--gold)",
                        opacity: 0.72,
                        pointerEvents: "none",
                        zIndex: 3,
                      }}
                    />

                    {/* Top-Left HUD Badge: 360 Orbit */}
                    <div
                      style={{
                        position: "absolute",
                        top: "15px",
                        left: "16px",
                        zIndex: 4,
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                        padding: "4px 10px",
                        borderRadius: "99px",
                        background: "rgba(12, 4, 6, 0.76)",
                        border: "1px solid rgba(255, 209, 141, 0.35)",
                        color: "var(--gold)",
                        fontSize: "10.5px",
                        fontWeight: 600,
                        letterSpacing: "0.06em",
                        backdropFilter: "blur(6px)",
                        pointerEvents: "none",
                      }}
                    >
                      <RotateCcw size={11} />
                      <span>XOAY 360°</span>
                    </div>

                    {/* Top-Right HUD Badge: AR Ready */}
                    <div
                      style={{
                        position: "absolute",
                        top: "15px",
                        right: "16px",
                        zIndex: 4,
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                        padding: "4px 10px",
                        borderRadius: "99px",
                        background: "rgba(143, 0, 25, 0.82)",
                        border: "1px solid rgba(255, 209, 141, 0.42)",
                        color: "#fff7ec",
                        fontSize: "10.5px",
                        fontWeight: 600,
                        letterSpacing: "0.06em",
                        backdropFilter: "blur(6px)",
                        pointerEvents: "none",
                      }}
                    >
                      <Smartphone size={11} color="var(--gold)" />
                      <span>THỰC TẾ ẢO AR</span>
                    </div>

                    {/* Live Interactive 3D Model (When modelUrl is available) */}
                    {product.modelUrl ? (
                      !is3DModalOpen && (
                        <model-viewer
                          ref={inlineViewerRef}
                          src={product.modelUrl}
                          ios-src={product.usdzUrl}
                          poster={product.image}
                          alt={`Mô hình 3D ${product.name}`}
                          camera-controls
                          touch-action="pan-y"
                          render-scale="auto"
                          reveal="auto"
                          loading="eager"
                          auto-rotate={inlineAutoRotate ? "" : undefined}
                          auto-rotate-delay="1800"
                          rotation-per-second="14deg"
                          shadow-intensity="1.15"
                          shadow-softness="0.45"
                          exposure="1.05"
                          camera-orbit="35deg 75deg 98%"
                          min-camera-orbit="auto auto 45%"
                          max-camera-orbit="auto auto 220%"
                          field-of-view="30deg"
                          ar
                          ar-modes="webxr scene-viewer quick-look"
                          quick-look-browsers="safari chrome"
                          ar-scale="auto"
                          interaction-prompt="none"
                          style={{
                            position: "relative",
                            zIndex: 2,
                            width: "100%",
                            height: "100%",
                            outline: "none",
                          }}
                        />
                      )
                    ) : (
                      /* Elegant Stage Preview when 3D model is upcoming */
                      <>
                        <img
                          src={product.image}
                          alt={product.name}
                          style={{
                            position: "absolute",
                            inset: 0,
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            opacity: 0.55,
                          }}
                        />
                        <div
                          style={{
                            position: "absolute",
                            inset: 0,
                            background:
                              "radial-gradient(circle at 50% 48%, rgba(21, 10, 11, 0.2) 0%, rgba(12, 4, 6, 0.9) 100%)",
                            pointerEvents: "none",
                          }}
                        />
                        <div
                          style={{
                            position: "relative",
                            zIndex: 3,
                            width: "56px",
                            height: "56px",
                            borderRadius: "50%",
                            background: "rgba(94, 0, 18, 0.88)",
                            border: "1px solid rgba(255, 209, 141, 0.55)",
                            color: "var(--gold)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            boxShadow: "0 0 28px rgba(255, 209, 141, 0.35)",
                          }}
                        >
                          <Box size={24} />
                        </div>
                      </>
                    )}

                    {/* Subtle Bottom Gesture Guide Pill (Auto-hides after first user interaction) */}
                    <div
                      style={{
                        position: "absolute",
                        bottom: "14px",
                        left: "50%",
                        transform: "translateX(-50%)",
                        zIndex: 5,
                        padding: "5px 14px",
                        borderRadius: "99px",
                        background: "rgba(15, 5, 7, 0.85)",
                        border: "1px solid rgba(255, 209, 141, 0.35)",
                        color: "var(--gold)",
                        fontSize: "11.5px",
                        fontWeight: 600,
                        letterSpacing: "0.03em",
                        whiteSpace: "nowrap",
                        pointerEvents: "none",
                        opacity: hasInteractedInline ? 0 : 1,
                        transition: "opacity 0.35s ease",
                        backdropFilter: "blur(8px)",
                        boxShadow: "0 4px 16px rgba(0, 0, 0, 0.5)",
                      }}
                    >
                      {product.modelUrl
                        ? "Kéo để xoay 360° · Cuộn để phóng to"
                        : "Bản số hóa 3D đang được hoàn thiện"}
                    </div>
                  </div>

                  {/* Compact Interactive Toolbar */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: "6px",
                      padding: "8px 10px",
                      borderRadius: "12px",
                      background: "rgba(0, 0, 0, 0.32)",
                      border: "1px solid rgba(255, 209, 141, 0.16)",
                      marginBottom: "16px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                    >
                      {/* Tool 1: Xoay (Toggle Auto-Rotate) */}
                      <button
                        type="button"
                        disabled={!product.modelUrl}
                        onClick={handleInlineToggleRotate}
                        className={
                          product.modelUrl
                            ? "cursor-pointer"
                            : "cursor-not-allowed opacity-50"
                        }
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "6px",
                          padding: "7px 12px",
                          borderRadius: "8px",
                          background: inlineAutoRotate
                            ? "rgba(143, 0, 25, 0.72)"
                            : "rgba(255, 255, 255, 0.04)",
                          border: inlineAutoRotate
                            ? "1px solid rgba(255, 209, 141, 0.42)"
                            : "1px solid rgba(255, 209, 141, 0.12)",
                          color: inlineAutoRotate ? "var(--gold)" : "#fff7ec",
                          fontSize: "12px",
                          fontWeight: 600,
                          transition: "all 0.2s ease",
                        }}
                        title="Bật / Tắt tự động xoay"
                      >
                        <RefreshCw size={13} />
                        <span
                          className={
                            activeMobileTool === "rotate"
                              ? "inline"
                              : "hidden sm:inline"
                          }
                        >
                          Xoay
                        </span>
                      </button>

                      {/* Tool 2: Phóng to (Toggle Zoom) */}
                      <button
                        type="button"
                        disabled={!product.modelUrl}
                        onClick={handleInlineZoomToggle}
                        className={
                          product.modelUrl
                            ? "cursor-pointer"
                            : "cursor-not-allowed opacity-50"
                        }
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "6px",
                          padding: "7px 12px",
                          borderRadius: "8px",
                          background: isInlineZoomed
                            ? "rgba(143, 0, 25, 0.72)"
                            : "rgba(255, 255, 255, 0.04)",
                          border: isInlineZoomed
                            ? "1px solid rgba(255, 209, 141, 0.42)"
                            : "1px solid rgba(255, 209, 141, 0.12)",
                          color: isInlineZoomed ? "var(--gold)" : "#fff7ec",
                          fontSize: "12px",
                          fontWeight: 600,
                          transition: "all 0.2s ease",
                        }}
                        title="Phóng to / Thu nhỏ góc nhìn"
                      >
                        {isInlineZoomed ? (
                          <ZoomOut size={13} />
                        ) : (
                          <ZoomIn size={13} />
                        )}
                        <span
                          className={
                            activeMobileTool === "zoom"
                              ? "inline"
                              : "hidden sm:inline"
                          }
                        >
                          {isInlineZoomed ? "Thu nhỏ" : "Phóng to"}
                        </span>
                      </button>

                      {/* Tool 3: Đặt lại góc nhìn */}
                      <button
                        type="button"
                        disabled={!product.modelUrl}
                        onClick={handleInlineResetCamera}
                        className={
                          product.modelUrl
                            ? "cursor-pointer"
                            : "cursor-not-allowed opacity-50"
                        }
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "6px",
                          padding: "7px 12px",
                          borderRadius: "8px",
                          background: "rgba(255, 255, 255, 0.04)",
                          border: "1px solid rgba(255, 209, 141, 0.12)",
                          color: "#fff7ec",
                          fontSize: "12px",
                          fontWeight: 600,
                          transition: "all 0.2s ease",
                        }}
                        title="Đặt lại góc nhìn mặc định"
                      >
                        <RotateCcw size={13} />
                        <span
                          className={
                            activeMobileTool === "reset"
                              ? "inline"
                              : "hidden sm:inline"
                          }
                        >
                          Đặt lại góc nhìn
                        </span>
                      </button>
                    </div>

                    {/* Tool 4 (Right): Toàn màn hình */}
                    <button
                      type="button"
                      disabled={!product.modelUrl}
                      onClick={() => {
                        if (product.modelUrl) setIs3DModalOpen(true)
                      }}
                      className={
                        product.modelUrl
                          ? "cursor-pointer"
                          : "cursor-not-allowed opacity-50"
                      }
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                        padding: "7px 12px",
                        borderRadius: "8px",
                        background: "rgba(143, 0, 25, 0.45)",
                        border: "1px solid rgba(255, 209, 141, 0.3)",
                        color: "var(--gold)",
                        fontSize: "12px",
                        fontWeight: 600,
                        transition: "all 0.2s ease",
                      }}
                      title="Mở chế độ toàn màn hình (90%)"
                    >
                      <Maximize2 size={13} />
                      <span className="hidden sm:inline">Toàn màn hình</span>
                    </button>
                  </div>

                  {/* Split CTA Row: Primary 3D Button + Secondary AR Button */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fit, minmax(190px, 1fr))",
                      gap: "12px",
                    }}
                  >
                    {/* Primary CTA: Khám phá mô hình 3D */}
                    <button
                      ref={open3DButtonRef}
                      type="button"
                      disabled={!product.modelUrl}
                      onClick={() => {
                        if (product.modelUrl) setIs3DModalOpen(true)
                      }}
                      className={
                        product.modelUrl
                          ? "cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
                          : "cursor-not-allowed opacity-60"
                      }
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "8px",
                        minHeight: "50px",
                        padding: "12px 18px",
                        borderRadius: "11px",
                        background: product.modelUrl
                          ? "linear-gradient(135deg, #ffe2ad 0%, var(--gold) 55%, #dfab60 100%)"
                          : "rgba(255, 209, 141, 0.15)",
                        border: "1px solid rgba(255, 247, 236, 0.65)",
                        color: product.modelUrl ? "#2b110e" : "var(--gold)",
                        fontSize: "13.5px",
                        fontWeight: 700,
                        letterSpacing: "0.04em",
                        boxShadow: product.modelUrl
                          ? "0 8px 24px rgba(0, 0, 0, 0.45), 0 0 22px rgba(255, 209, 141, 0.25)"
                          : "none",
                        transition:
                          "transform 0.2s ease, box-shadow 0.2s ease, filter 0.2s ease",
                      }}
                      onMouseEnter={(e) => {
                        if (product.modelUrl) {
                          e.currentTarget.style.transform = "translateY(-2px)"
                          e.currentTarget.style.filter = "brightness(1.04)"
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (product.modelUrl) {
                          e.currentTarget.style.transform = "translateY(0)"
                          e.currentTarget.style.filter = "brightness(1)"
                        }
                      }}
                      aria-haspopup="dialog"
                      aria-expanded={is3DModalOpen}
                      aria-controls="heritage-3d-dialog"
                    >
                      <Box size={16} />
                      <span>
                        {product.modelUrl
                          ? "Khám phá mô hình 3D"
                          : "Mô hình 3D sắp ra mắt"}
                      </span>
                    </button>

                    {/* Secondary CTA: Xem trong không gian AR / Xem AR trên điện thoại */}
                    {isIOSDevice && product.usdzUrl ? (
                      <a
                        rel="ar"
                        href={`${product.usdzUrl.split("#")[0]}#allowsContentScaling=0`}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "8px",
                          minHeight: "50px",
                          padding: "12px 18px",
                          borderRadius: "11px",
                          background:
                            "linear-gradient(135deg, rgba(143, 0, 25, 0.72) 0%, rgba(89, 0, 16, 0.72) 100%)",
                          border: "1px solid rgba(255, 209, 141, 0.42)",
                          color: "var(--gold)",
                          fontSize: "13.5px",
                          fontWeight: 600,
                          textDecoration: "none",
                          boxShadow: "0 8px 20px rgba(0, 0, 0, 0.35)",
                          transition: "all 0.2s ease",
                        }}
                      >
                        <Smartphone size={16} color="var(--gold)" />
                        <span>Xem trong không gian AR</span>
                      </a>
                    ) : (
                      <button
                        type="button"
                        disabled={!product.modelUrl}
                        onClick={handleInlineArTrigger}
                        className={
                          product.modelUrl
                            ? "cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
                            : "cursor-not-allowed opacity-60"
                        }
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "8px",
                          minHeight: "50px",
                          padding: "12px 18px",
                          borderRadius: "11px",
                          background:
                            "linear-gradient(135deg, rgba(143, 0, 25, 0.72) 0%, rgba(89, 0, 16, 0.72) 100%)",
                          border: "1px solid rgba(255, 209, 141, 0.42)",
                          color: "var(--gold)",
                          fontSize: "13.5px",
                          fontWeight: 600,
                          boxShadow: "0 8px 20px rgba(0, 0, 0, 0.35)",
                          transition: "all 0.2s ease",
                        }}
                        onMouseEnter={(e) => {
                          if (product.modelUrl) {
                            e.currentTarget.style.transform = "translateY(-2px)"
                            e.currentTarget.style.borderColor =
                              "rgba(255, 209, 141, 0.7)"
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (product.modelUrl) {
                            e.currentTarget.style.transform = "translateY(0)"
                            e.currentTarget.style.borderColor =
                              "rgba(255, 209, 141, 0.42)"
                          }
                        }}
                      >
                        <Smartphone size={16} color="var(--gold)" />
                        <span>
                          {isMobileDevice
                            ? "Xem trong không gian AR"
                            : "Xem AR trên điện thoại"}
                        </span>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* SPOTLIGHT #2: Product Card - Physical Wooden Craft Model */}
              <div
                className="heritage-product-card"
                style={{
                  background:
                    "linear-gradient(145deg, #2d0d13 0%, #1c080c 100%)",

                  padding: "32px",

                  borderRadius: "18px",

                  border: "1px solid rgba(255, 209, 141, 0.24)",

                  boxShadow: "0 16px 40px rgba(0, 0, 0, 0.45)",

                  position: "relative",

                  overflow: "hidden",
                }}
              >
                <div style={{ position: "relative", zIndex: 2 }}>
                  <p
                    style={{
                      color: "var(--gold)",

                      fontSize: "11.5px",

                      textTransform: "uppercase",

                      letterSpacing: "0.15em",

                      fontWeight: 600,

                      marginBottom: "6px",
                    }}
                  >
                    MÔ HÌNH LẮP GHÉP GỖ NGUYÊN BẢN
                  </p>
                  <h3
                    style={{
                      fontSize: "24px",

                      color: "#fff7ec",

                      marginBottom: "16px",

                      fontFamily: '"Vollkorn", serif',
                    }}
                  >
                    Sở hữu Mô hình {product.name}
                  </h3>

                  <div
                    style={{
                      borderRadius: "10px",

                      overflow: "hidden",

                      marginBottom: "18px",

                      border: "1px solid rgba(255, 209, 141, 0.2)",
                    }}
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      style={{
                        width: "100%",

                        height: "195px",

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

                      marginBottom: "20px",
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
                          : product.detailedInfo?.variants &&
                              product.detailedInfo.variants.length > 1
                            ? `Giá từ (${product.detailedInfo.variants.length} phiên bản)`
                            : "Giá phát hành"}
                      </span>
                      <strong
                        style={{ fontSize: "22px", color: "var(--gold)" }}
                      >
                        {product.priceRange || product.price}
                      </strong>
                    </div>

                    <Link
                      to={`/products/${product.slug}`}
                      style={{
                        display: "inline-flex",

                        alignItems: "center",

                        gap: "8px",

                        padding: "11px 22px",

                        borderRadius: "99px",

                        background: "rgba(143, 0, 25, 0.65)",

                        border: "1px solid rgba(255, 209, 141, 0.45)",

                        color: "var(--gold)",

                        fontWeight: 700,

                        fontSize: "13px",

                        textTransform: "uppercase",

                        letterSpacing: "0.08em",

                        boxShadow: "0 6px 20px rgba(0, 0, 0, 0.3)",

                        transition: "all 0.2s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "var(--gold)"
                        e.currentTarget.style.color = "#2b110e"
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background =
                          "rgba(143, 0, 25, 0.65)"
                        e.currentTarget.style.color = "var(--gold)"
                      }}
                    >
                      Xem chi tiết sản phẩm <ArrowRight size={15} />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section: Next Heritage Journey / Other Destinations (Unified, no duplicates) */}
          <section
            id="other-heritages"
            className="reveal"
            style={{
              marginTop: "40px",

              paddingTop: "60px",

              borderTop: "1px solid rgba(255, 209, 141, 0.16)",

              maxWidth: "1200px",

              margin: "0 auto",
            }}
          >
            <div
              style={{
                display: "flex",

                alignItems: "flex-end",

                justifyContent: "space-between",

                flexWrap: "wrap",

                gap: "20px",

                marginBottom: "36px",
              }}
            >
              <div>
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
                  TIẾP TỤC HÀNH TRÌNH DI SẢN
                </p>
                <h3
                  style={{
                    fontSize: "clamp(26px, 3.5vw, 34px)",

                    color: "#fff7ec",

                    fontFamily: '"Vollkorn", serif',

                    margin: 0,
                  }}
                >
                  Khám phá các điểm đến tiếp theo
                </h3>
              </div>

              <Link
                to="/heritage"
                style={{
                  display: "inline-flex",

                  alignItems: "center",

                  gap: "8px",

                  color: "var(--gold)",

                  fontSize: "13px",

                  textTransform: "uppercase",

                  letterSpacing: "0.1em",

                  fontWeight: 600,

                  padding: "8px 18px",

                  borderRadius: "99px",

                  border: "1px solid rgba(255, 209, 141, 0.3)",

                  background: "rgba(143, 0, 25, 0.35)",

                  transition: "all 0.2s ease",

                  textDecoration: "none",
                }}
              >
                <Compass size={15} />
                <span>Xem tất cả di sản</span>
              </Link>
            </div>

            <div
              style={{
                display: "grid",

                gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",

                gap: "28px",
              }}
            >
              {products.map((p) => {
                const isCurrent = p.slug === product.slug

                return (
                  <Link
                    key={p.id}
                    to={`/heritage/${p.slug}`}
                    onClick={() => {
                      window.scrollTo({ top: 0, behavior: "smooth" })
                    }}
                    className="group"
                    style={{
                      background: isCurrent
                        ? "linear-gradient(145deg, #2a1217 0%, #1a0b0e 100%)"
                        : "linear-gradient(145deg, #201214 0%, #170a0c 100%)",

                      borderRadius: "14px",

                      border: isCurrent
                        ? "1px solid rgba(255, 209, 141, 0.45)"
                        : "1px solid rgba(255, 209, 141, 0.18)",

                      overflow: "hidden",

                      boxShadow: isCurrent
                        ? "0 14px 35px rgba(0, 0, 0, 0.5), 0 0 25px rgba(143, 0, 25, 0.25)"
                        : "0 12px 30px rgba(0, 0, 0, 0.4)",

                      display: "flex",

                      flexDirection: "column",

                      justifyContent: "space-between",

                      textDecoration: "none",

                      cursor: "pointer",

                      transition:
                        "transform 0.35s cubic-bezier(0.22, 1, 0.36, 1), border-color 0.35s ease, box-shadow 0.35s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-7px)"
                      e.currentTarget.style.borderColor =
                        "rgba(255, 209, 141, 0.65)"
                      e.currentTarget.style.boxShadow =
                        "0 22px 48px rgba(0, 0, 0, 0.65), 0 0 30px rgba(143, 0, 25, 0.32), 0 0 18px rgba(255, 209, 141, 0.14)"
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)"
                      e.currentTarget.style.borderColor = isCurrent
                        ? "rgba(255, 209, 141, 0.45)"
                        : "rgba(255, 209, 141, 0.18)"
                      e.currentTarget.style.boxShadow = isCurrent
                        ? "0 14px 35px rgba(0, 0, 0, 0.5), 0 0 25px rgba(143, 0, 25, 0.25)"
                        : "0 12px 30px rgba(0, 0, 0, 0.4)"
                    }}
                  >
                    <div>
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
                          className="transition-transform duration-500 ease-out group-hover:scale-105"
                          style={{
                            width: "100%",

                            height: "100%",

                            objectFit: "cover",
                          }}
                        />
                        <span
                          style={{
                            position: "absolute",

                            top: "14px",

                            left: "14px",

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
                          DI SẢN {p.number}
                        </span>

                        {isCurrent && (
                          <span
                            style={{
                              position: "absolute",

                              top: "14px",

                              right: "14px",

                              padding: "4px 10px",

                              borderRadius: "99px",

                              background: "rgba(143, 0, 25, 0.95)",

                              border: "1px solid var(--gold)",

                              color: "var(--gold)",

                              fontSize: "11px",

                              fontWeight: 700,

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
                          className="transition-colors duration-300 group-hover:text-[#ffd18d]"
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

                            fontSize: "14px",

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
                      <span
                        style={{
                          display: "inline-flex",

                          alignItems: "center",

                          gap: "8px",

                          color: "var(--gold)",

                          fontSize: "13px",

                          textTransform: "uppercase",

                          letterSpacing: "0.1em",

                          fontWeight: "bold",

                          paddingTop: "14px",

                          borderTop: "1px solid rgba(255, 209, 141, 0.12)",

                          width: "100%",
                        }}
                      >
                        <span>
                          {isCurrent ? "Đang khám phá" : "Khám phá di sản"}
                        </span>
                        <ArrowRight
                          size={15}
                          className="transition-transform duration-300 group-hover:translate-x-1.5"
                        />
                      </span>
                    </div>
                  </Link>
                )
              })}
            </div>
          </section>
        </div>
      </main>

      {/* 3D & AR Interactive Modal Dialog (90% Screen Gallery View) */}
      {is3DModalOpen && product.modelUrl && (
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
            className="w-full h-full sm:w-[92vw] sm:h-[90vh] max-w-[1240px] flex flex-col sm:rounded-2xl overflow-hidden shadow-2xl relative"
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
                src={product.modelUrl}
                iosSrc={product.usdzUrl}
                poster={product.image}
                alt={`Mô hình 3D tương tác ${product.name} - Di sản Kiến Tích Việt`}
                title={product.name}
                onClose={() => setIs3DModalOpen(false)}
              />
            </div>
          </div>
        </div>
      )}

      {/* AR Device Guidance Modal (When clicking "Xem AR trên điện thoại" on PC) */}
      {showArGuideModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/85 backdrop-blur-xs"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowArGuideModal(false)
            }
          }}
        >
          <div
            className="max-w-md w-full p-6 rounded-2xl relative shadow-2xl"
            style={{
              background: "linear-gradient(155deg, #2b0d13 0%, #17070a 100%)",
              border: "1px solid rgba(255, 209, 141, 0.35)",
            }}
          >
            <button
              type="button"
              onClick={() => setShowArGuideModal(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-[#fff7ec]/70 hover:text-[#fff7ec] hover:bg-white/10 cursor-pointer"
              aria-label="Đóng hướng dẫn AR"
            >
              <X size={18} />
            </button>

            <div
              style={{
                width: "46px",
                height: "46px",
                borderRadius: "50%",
                background: "rgba(143, 0, 25, 0.55)",
                border: "1px solid rgba(255, 209, 141, 0.4)",
                color: "var(--gold)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "14px",
              }}
            >
              <Smartphone size={22} />
            </div>

            <h3
              style={{
                fontSize: "21px",
                color: "#fff7ec",
                fontFamily: '"Vollkorn", serif',
                margin: "0 0 8px",
              }}
            >
              Xem {product.name} trong không gian AR
            </h3>

            <p
              style={{
                fontSize: "14px",
                lineHeight: 1.6,
                color: "rgba(255, 235, 209, 0.8)",
                marginBottom: "16px",
              }}
            >
              Tính năng Thực tế tăng cường (AR) sử dụng camera trên điện thoại
              hoặc máy tính bảng để đặt mô hình 3D trực tiếp lên mặt bàn và
              không gian thật của bạn:
            </p>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                marginBottom: "22px",
                padding: "14px",
                borderRadius: "12px",
                background: "rgba(0, 0, 0, 0.28)",
                border: "1px solid rgba(255, 209, 141, 0.14)",
                fontSize: "13.5px",
                color: "rgba(255, 235, 209, 0.88)",
              }}
            >
              <div style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
                <CheckCircle2 size={16} color="#34d399" style={{ marginTop: "2px", flexShrink: 0 }} />
                <span>
                  <strong>iPhone / iPad (iOS):</strong> Mở trang này bằng trình
                  duyệt Safari và bấm <em>“Xem trong không gian AR”</em> để khởi
                  chạy Apple AR Quick Look.
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
                <CheckCircle2 size={16} color="#34d399" style={{ marginTop: "2px", flexShrink: 0 }} />
                <span>
                  <strong>Android:</strong> Mở bằng trình duyệt Chrome trên điện
                  thoại hỗ trợ Google Play Services for AR (Scene Viewer / WebXR).
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowArGuideModal(false)}
              className="cursor-pointer"
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "10px",
                background:
                  "linear-gradient(135deg, #ffe2ad 0%, var(--gold) 55%, #e2ac60 100%)",
                border: "none",
                color: "#2b110e",
                fontSize: "13.5px",
                fontWeight: 700,
              }}
            >
              Đã hiểu
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
