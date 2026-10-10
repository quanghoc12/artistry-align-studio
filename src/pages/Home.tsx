import { useState } from "react"
import { Icon, LinkButton, stories } from "../components/Shared"
import { products } from "../data/products"
import { Link } from "react-router-dom"

export default function Home() {
  const [playing, setPlaying] = useState(false)

  return (
    <>
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-copy">
          <p className="kicker">Mô hình lắp ghép di sản Việt Nam</p>
          <h1 id="hero-title">
            Dựng hình di sản,
            <em>nối nhịp thời gian.</em>
          </h1>
          <p className="hero-description">
            Kiến Tích Việt biến những dấu tích văn hóa Việt thành những mô hình lắp ghép
            để bạn tự tay kiến tạo, trưng bày và khám phá.
          </p>
          <div className="hero-actions">
            <LinkButton href="/products">Khám phá sản phẩm</LinkButton>
            <a className="text-link" href="/#story">
              Về Kiến Tích Việt <Icon name="arrow" />
            </a>
          </div>
        </div>
        <div className="hero-visual">
          <div className="hero-image-wrap parallax-layer" data-speed="0.08">
            <img
              src="/images/one-pillar-pagoda.jpg"
              alt="Chùa Một Cột giữa khuôn viên xanh"
            />
            <div className="image-frame" aria-hidden="true" />
            <span className="image-note image-note-top">Di sản số 01</span>
            <span className="image-note image-note-bottom">
              Chùa Một Cột · Hà Nội
            </span>
          </div>
          <div className="wood-card">
            <span className="wood-card-label">Từ 120 mảnh gỗ</span>
            <div className="model-mark" aria-hidden="true">
              <span className="roof roof-one" />
              <span className="roof roof-two" />
              <span className="pillar" />
              <span className="base" />
            </div>
            <span className="wood-card-title">thành một dấu tích</span>
          </div>
        </div>
        <a className="scroll-cue" href="/#story">
          <span>Cuộn để khám phá</span>
          <span className="scroll-line" />
        </a>
      </section>

      <section className="intro section-pad" id="story">
        <div className="section-heading reveal">
          <p className="kicker">Kiến Tích Việt là gì?</p>
          <h2>
            Không chỉ là một mô hình.
            <br />
            Đó là một hành trình.
          </h2>
        </div>
        <p className="intro-copy reveal">
          Từ đôi tay người trẻ đến những ký ức trăm năm, mỗi bộ mô hình là một
          cách mới để di sản hiện diện gần gũi hơn trong cuộc sống hôm nay.
        </p>
        <div className="steps">
          {[
            [
              "01",
              "Build",
              "Lắp ghép",
              "Tự tay ghép từng mảnh gỗ, cảm nhận cấu trúc và dáng hình của công trình.",
            ],
            [
              "02",
              "Display",
              "Trưng bày",
              "Biến di sản thành một vật phẩm trang trí có chiều sâu và câu chuyện.",
            ],
            [
              "03",
              "Discover",
              "Khám phá",
              "Chạm NFC để lắng nghe, tương tác AR và mở ra thế giới phía sau mô hình.",
            ],
          ].map(([number, en, title, text]) => (
            <article className="step-card reveal" key={number}>
              <span className="step-number">{number}</span>
              <div className="step-icon">
                <Icon
                  name={
                    number === "01" ? "cube" : number === "02" ? "box" : "nfc"
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

      <section className="products section-pad" id="products">
        <div className="products-head reveal">
          <div className="section-heading reveal">
            <p className="kicker">Bộ sưu tập đầu tiên</p>
            <h2>
              Những dấu tích
              <br />
              trong lòng bàn tay
            </h2>
          </div>
          <Link className="text-link" to="/products">
            Xem tất cả sản phẩm <Icon name="arrow" />
          </Link>
        </div>
        <div className="product-grid">
          {products.map((product) => (
            <article className="product-card reveal" key={product.id}>
              <Link
                className="product-image"
                to={`/products/${product.slug}`}
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
                </div>
                <strong>{product.price}</strong>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="tech section-pad" id="discover">
        <div className="tech-visual reveal">
          <div className="phone">
            <div className="phone-screen">
              <span className="phone-label">Kiến Tích Việt</span>
              <img src="/images/one-pillar-pagoda.jpg" alt="" />
              <button
                className={`play-button ${playing ? "is-playing" : ""}`}
                onClick={() => setPlaying(!playing)}
                aria-label={playing ? "Tạm dừng audio" : "Phát audio"}
              >
                <Icon name={playing ? "close" : "play"} size={25} />
              </button>
              <div className="audio-copy">
                <small>Đang nghe</small>
                <strong>Sự tích Chùa Một Cột</strong>
                <span className="audio-wave">
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
          <p className="kicker light">Công nghệ chạm vào di sản</p>
          <h2>
            Một cú chạm.
            <br />
            Cả ngàn câu chuyện.
          </h2>
          <p>
            Một mô hình không chỉ dừng lại ở những mảnh gỗ. Chạm NFC để mở ra câu chuyện phía sau di sản.
          </p>
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
                <strong>Audio</strong> Nghe những chuyện xưa
              </span>
            </div>
            <div>
              <Icon name="phone" />
              <span>
                <strong>AR</strong> Đưa di sản vào không gian
              </span>
            </div>
          </div>
          <LinkButton href="/#journal" dark>
            Khám phá trải nghiệm
          </LinkButton>
        </div>
      </section>

      <section className="journal section-pad" id="journal">
        <div className="journal-intro reveal">
          <p className="kicker">Chuyện di sản</p>
          <h2>
            Mỗi công trình
            <br />
            đều có một câu chuyện.
          </h2>
          <p>
            Đi qua lịch sử bằng những câu chuyện nhỏ, những chi tiết kiến trúc
            và ký ức được kể lại.
          </p>
          <a className="text-link" href="/#journal">
            Khám phá di sản <Icon name="arrow" />
          </a>
        </div>
        <div className="story-list">
          {stories.map((story, index) => (
            <article className="story-item reveal" key={story.title}>
              <span className="story-index">0{index + 1}</span>
              <img src={story.image} alt="" />
              <div>
                <p>{story.place}</p>
                <h3>{story.title}</h3>
              </div>
              <span className="story-arrow">
                <Icon name="arrow" />
              </span>
            </article>
          ))}
        </div>
      </section>

      <section className="statement reveal">
        <div className="statement-mark">“</div>
        <p>Từ những mảnh ghép nhỏ,</p>
        <h2>dựng nên những dấu tích lớn.</h2>
        <LinkButton href="/products">Bắt đầu hành trình</LinkButton>
        <span className="statement-outline">KIẾN TÍCH VIỆT</span>
      </section>
    </>
  )
}
