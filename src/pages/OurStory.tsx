import { LinkButton } from "../components/Shared"

const chapters = [
  {
    id: "tich", no: "Chương 01", word: "Tích", meaning: "Dấu tích · Ký ức", title: "Dấu Tích Của Thời Gian", img: "/images/heritage-door.jpg", seal: "TÍCH", flip: false, alt: false,
    body: [
      "Thời gian có thể đi qua một công trình, nhưng không thể xóa đi những dấu tích mà nó để lại. Một ngôi đình, một mái chùa không chỉ là gạch ngói hay những cây cột gỗ — chúng mang theo bóng dáng người xưa và bản sắc dân tộc.",
      "Trân trọng những mảnh ghép ấy là cách giữ cho nhịp đập của quá khứ tiếp tục vang vọng trong hiện tại.",
    ],
  },
  {
    id: "kien", no: "Chương 02", word: "Kiến", meaning: "Kiến tạo · Lắp ráp", title: "Tự Tay Kiến Tạo", img: "/images/heritage-pagoda.jpg", seal: "KIẾN", flip: true, alt: true,
    body: [
      "Kiến Tích Việt bắt đầu từ chữ “Kiến” – kiến tạo, lắp ráp, xây dựng. Một mảnh gỗ, một khớp nối, một cấu trúc dần hình thành đưa bạn vào hành trình của những người thợ mộc tài hoa thuở trước.",
      "Lịch sử không còn khô khan trên trang giấy, mà sống lại ngay dưới đôi tay bạn.",
    ],
  },
  {
    id: "viet", no: "Chương 03", word: "Việt", meaning: "Văn hóa · Con người", title: "Một Câu Chuyện Mang Tên Việt Nam", img: "/images/one-pillar-pagoda.jpg", seal: "VIỆT", flip: false, alt: false,
    body: [
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
          <p className="kicker">Câu chuyện thương hiệu</p>
          <h1>
            Có những công trình được xây bằng đá.
            <br />
            <em>Có những ký ức được xây bằng thời gian.</em>
          </h1>
          <p className="lead">
            Dọc chiều dài đất nước, những công trình cổ là chứng nhân của lịch sử. Kiến Tích Việt tin còn một cách khác để trải nghiệm chúng: <strong>tự tay dựng lại một phần ký ức ấy.</strong>
          </p>
        </div>
        <div className="story-hero-logo reveal">
          <img src="/images/logo.png" alt="Logo Kiến Tích Việt" width={600} height={725} />
        </div>
      </section>

      <nav className="name-strip" aria-label="Ý nghĩa tên thương hiệu">
        {chapters.map((c) => (
          <a href={`#${c.id}`} key={c.id}>
            <b>{c.word}</b>
            <span>{c.meaning}</span>
          </a>
        ))}
      </nav>

      {chapters.map((c) => (
        <section id={c.id} key={c.id} className={`chapter reveal ${c.flip ? "flip" : ""} ${c.alt ? "alt" : ""}`}>
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
              <p className="body" key={t}>{t}</p>
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
          <p className="body" style={{ fontSize: 18, lineHeight: 1.75, color: "var(--muted)" }}>
            Mô hình hoàn thiện mới chỉ là khởi đầu. Mảnh ghép vật lý kết hợp công nghệ tương tác đánh thức tư liệu, hình ảnh và âm thanh của quá khứ — biến quan sát thụ động thành trải nghiệm văn hóa trọn vẹn.
          </p>
          <div className="journey-steps">
            {["Nhìn", "Lắp ghép", "Khám phá", "Hiểu", "Ghi nhớ"].map((s, i) => (
              <div key={s}><small>0{i + 1}</small><b>{s}</b></div>
            ))}
          </div>
        </div>
      </section>

      <section className="statement reveal">
        <div className="statement-mark">“</div>
        <p>Một mảnh ghép nhỏ. Một công trình lớn.</p>
        <h2>Một dấu tích Việt Nam.</h2>
        <LinkButton href="/products">Khám phá bộ sưu tập</LinkButton>
        <span className="statement-outline">DI SẢN</span>
      </section>
    </>
  )
}
