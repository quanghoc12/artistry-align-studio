import { LinkButton } from "../components/Shared"

const chapters = [
  {
    id: "kien",
    no: "Chương 01",
    word: "Kiến",
    meaning: "Kiến tạo · Lắp ráp · Xây dựng",
    title: "Tự Tay Kiến Tạo",
    img: "/images/heritage-pagoda.jpg",
    seal: "KIẾN",
    flip: false,
    alt: false,
    body: [
      "Gợi đến kiến tạo, lắp ghép, xây dựng.",
      "Liên tưởng trực tiếp đến trải nghiệm khách hàng: từ những mảnh gỗ nhỏ, người dùng tự tay tạo nên một công trình hoàn chỉnh.",
      "Thể hiện tinh thần tự tay làm - tự mình khám phá, thay vì chỉ đứng nhìn một di sản.",
    ],
  },
  {
    id: "tich",
    no: "Chương 02",
    word: "Tích",
    meaning: "Dấu tích · Ký ức thời gian",
    title: "Dấu Tích Của Thời Gian",
    img: "/images/heritage-door.jpg",
    seal: "TÍCH",
    flip: true,
    alt: true,
    body: [
      "Gợi đến dấu tích, di tích, những giá trị vật chất và câu chuyện được lưu giữ qua thời gian.",
      "Mỗi mô hình không chỉ tái hiện một công trình mà còn đại diện cho một “dấu tích Việt Nam” được kể lại bằng một hình thức mới.",
      "Trân trọng những mảnh ghép ấy là cách giữ cho nhịp đập của quá khứ tiếp tục vang vọng trong hiện tại.",
    ],
  },
  {
    id: "viet",
    no: "Chương 03",
    word: "Việt",
    meaning: "Văn hóa · Lịch sử · Di sản",
    title: "Một Câu Chuyện Mang Tên Việt Nam",
    img: "/images/one-pillar-pagoda.jpg",
    seal: "VIỆT",
    flip: false,
    alt: false,
    body: [
      "Khẳng định nguồn cảm hứng và giá trị cốt lõi đến từ văn hóa, lịch sử và di sản Việt Nam.",
      "Cảm hứng của chúng tôi khởi nguồn từ dòng chảy văn hóa, kiến trúc và con người Việt Nam — tìm một ngôn ngữ đương đại để đưa di sản đến gần cuộc sống hôm nay.",
      "Kiến tạo những dấu tích Việt bằng đôi tay và khối óc của thế hệ hôm nay.",
    ],
  },
]

export default function OurStory() {
  return (
    <>
      <section className="story-hero">
        <div className="reveal">
          <p className="kicker">Về chúng tôi · Thương hiệu</p>
          <h1>
            Có những công trình được xây bằng đá.
            <br />
            <em>Có những ký ức được xây bằng thời gian.</em>
          </h1>
          <p className="lead">
            Dọc chiều dài đất nước, những công trình cổ là chứng nhân của lịch
            sử. Kiến Tích Việt tin còn một cách khác để trải nghiệm chúng:{" "}
            <strong>tự tay dựng lại một phần ký ức ấy.</strong>
          </p>
        </div>
        <div className="story-hero-logo reveal">
          <img
            src="/images/logo.png"
            alt="Logo Kiến Tích Việt"
            width={600}
            height={725}
          />
        </div>
      </section>

      {/* Mission & Vision trước khi nói về Kiến Tích Việt */}
      <section className="story-mission-vision reveal" aria-label="Sứ mệnh và Tầm nhìn">
        <div className="mission-vision-grid">
          <div className="mission-card">
            <span className="mv-kicker">Sứ Mệnh · Mission</span>
            <h3>
              Biến những dấu tích của quá khứ thành trải nghiệm của thế hệ hôm nay.
            </h3>
          </div>
          <div className="vision-card">
            <span className="mv-kicker">Tầm Nhìn · Vision</span>
            <p>
              Kiến Tích Việt xây dựng hệ sinh thái sản phẩm và nền tảng số về di sản,
              góp phần số hóa, bảo tồn và lan tỏa những giá trị kiến trúc, văn hóa
              Việt Nam đến các thế hệ tương lai và bạn bè quốc tế.
            </p>
          </div>
        </div>

        <div className="about-ktv-card">
          <p className="about-ktv-intro">
            <strong>Kiến Tích Việt</strong> là công ty nghiên cứu, sản xuất mô hình lắp ráp 3D
            tái hiện những công trình kiến trúc và di sản Việt Nam kết hợp trải nghiệm công nghệ.
          </p>
          <p className="about-ktv-philosophy">
            Với triết lí <em>“Lấy di sản làm gốc, lấy sáng tạo làm cầu nối”</em>, Kiến Tích Việt
            phát triển mô hình lắp ghép kết hợp công nghệ, mang đến trải nghiệm khám phá kiến
            trúc và văn hóa Việt Nam trực quan, sáng tạo và gần gũi hơn đến người dân Việt Nam
            và bạn bè quốc tế.
          </p>
        </div>
      </section>

      <nav className="name-strip" aria-label="Ý nghĩa tên thương hiệu Kiến - Tích - Việt">
        {chapters.map((c) => (
          <a href={`#${c.id}`} key={c.id}>
            <b>{c.word}</b>
            <span>{c.meaning}</span>
          </a>
        ))}
      </nav>

      {chapters.map((c) => (
        <section
          id={c.id}
          key={c.id}
          className={`chapter reveal ${c.flip ? "flip" : ""} ${
            c.alt ? "alt" : ""
          }`}
        >
          <div className="chapter-media">
            <img src={c.img} alt={c.title} loading="lazy" />
            <span className="seal">{c.seal}</span>
          </div>
          <div>
            <p className="kicker">{c.no}</p>
            <div className="chapter-word">{c.word}</div>
            <p className="chapter-meaning">{c.meaning}</p>
            <h3>{c.title}</h3>
            {c.body.map((t) => (
              <p className="body" key={t}>
                {t}
              </p>
            ))}
          </div>
        </section>
      ))}

      <section className="journey reveal">
        <div>
          <p className="kicker">Di sản được kể lại</p>
          <h2>Hành trình khám phá bất tận</h2>
        </div>
        <div>
          <p
            className="body"
            style={{ fontSize: 18, lineHeight: 1.75, color: "var(--muted)" }}
          >
            Mô hình hoàn thiện mới chỉ là khởi đầu. Mảnh ghép vật lý kết hợp
            công nghệ tương tác đánh thức tư liệu, hình ảnh và âm thanh của quá
            khứ — biến quan sát thụ động thành trải nghiệm văn hóa trọn vẹn.
          </p>
          <div className="journey-steps">
            {["Nhìn", "Lắp ghép", "Khám phá", "Cảm nhận", "Hiểu"].map((s, i) => (
              <div key={s}>
                <small>0{i + 1}</small>
                <b>{s}</b>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="statement reveal">
        <div className="statement-mark">“</div>
        <p>Mỗi mảnh ghép một dấu ấn,</p>
        <h2>mỗi mô hình một câu chuyện.</h2>
        <LinkButton href="/products">Khám phá bộ sưu tập</LinkButton>
        <span className="statement-outline">DI SẢN</span>
      </section>
    </>
  )
}
