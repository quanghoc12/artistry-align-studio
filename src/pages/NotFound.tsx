import { LinkButton } from "../components/Shared"

export default function NotFound() {
  return (
    <section
      className="section-pad flex flex-col items-center justify-center text-center"
      style={{ minHeight: "70vh" }}
    >
      <div className="section-heading reveal flex flex-col items-center">
        <p className="kicker !justify-center before:hidden">404 - Lỗi</p>
        <h2 className="mb-6 text-[clamp(40px,5vw,60px)]">
          Không tìm thấy trang.
        </h2>
      </div>
      <p className="intro-copy reveal !self-center !mx-auto !text-center mb-12">
        Trang bạn đang tìm kiếm không tồn tại hoặc đã bị di dời.
      </p>
      <LinkButton href="/">Trở về trang chủ</LinkButton>
    </section>
  )
}
