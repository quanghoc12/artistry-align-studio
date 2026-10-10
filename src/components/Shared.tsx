import { ReactNode } from "react"
import { Link } from "react-router-dom"

export type IconName = "arrow" | "bag" | "box" | "close" | "cube" | "headphones" | "menu" | "nfc" | "phone" | "play" | "plus" | "sparkle"

export { products } from "../data/products"
export type { Product } from "../data/products"

export const stories = [
  {
    title: "Một đóa sen giữa lòng Thăng Long",
    place: "Chùa Một Cột · Hà Nội",
    image: "/images/one-pillar-pagoda.jpg",
  },
  {
    title: "Nơi tinh hoa đất học được lưu truyền",
    place: "Văn Miếu · Hà Nội",
    image: "/images/heritage-door.jpg",
  },
  {
    title: "Dấu son kiến trúc từ triều Trần",
    place: "Tháp Phổ Minh · Nam Định",
    image: "/images/heritage-pagoda.jpg",
  },
]

export function Icon({ name, size = 20 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, ReactNode> = {
    arrow: <path d="M5 12h14M14 7l5 5-5 5" />,
    bag: (
      <>
        <path d="M5 8h14l-1 12H6L5 8Z" />
        <path d="M9 9V6a3 3 0 0 1 6 0v3" />
      </>
    ),
    box: (
      <>
        <path d="m4 7 8-4 8 4-8 4-8-4Z" />
        <path d="m4 7 8 4v10l-8-4V7Zm16 0-8 4v10l8-4V7Z" />
      </>
    ),
    close: <path d="m6 6 12 12M18 6 6 18" />,
    cube: (
      <>
        <path d="m12 2 9 5-9 5-9-5 9-5Z" />
        <path d="m3 7 9 5v10l-9-5V7Zm18 0-9 5v10l9-5V7Z" />
      </>
    ),
    headphones: (
      <>
        <path d="M4 14v-2a8 8 0 0 1 16 0v2" />
        <path d="M4 14h3v7H5a1 1 0 0 1-1-1v-6Zm16 0h-3v7h2a1 1 0 0 0 1-1v-6Z" />
      </>
    ),
    menu: <path d="M4 7h16M4 12h16M4 17h16" />,
    nfc: (
      <>
        <path d="M8 8a6 6 0 0 1 0 8M5 5a10 10 0 0 1 0 14" />
        <path d="M12 11a2 2 0 0 1 0 2" />
        <path d="M16 8a6 6 0 0 0 0 8M19 5a10 10 0 0 0 0 14" />
      </>
    ),
    phone: (
      <>
        <rect x="6" y="2" width="12" height="20" rx="2" />
        <path d="M10 18h4" />
      </>
    ),
    play: <path d="m9 7 9 5-9 5V7Z" />,
    plus: <path d="M12 5v14M5 12h14" />,
    sparkle: (
      <>
        <path d="M12 3c.8 4.8 3.2 7.2 8 8-4.8.8-7.2 3.2-8 8-.8-4.8-3.2-7.2-8-8 4.8-.8 7.2-3.2 8-8Z" />
        <path d="M19 3v4M17 5h4" />
      </>
    ),
  }

  return (
    <svg
      aria-hidden="true"
      fill="none"
      height={size}
      viewBox="0 0 24 24"
      width={size}
    >
      <g
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.7"
      >
        {paths[name]}
      </g>
    </svg>
  )
}

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link aria-label="Kiến Tích Việt — Trang chủ" className={`brand-logo ${light ? "is-light" : ""}`} to="/">
      <img src="/images/logo.png" alt="Kiến Tích Việt" width={600} height={725} />
    </Link>
  )
}

export function LinkButton({
  children,
  href,
  dark = false,
}: {
  children: ReactNode
  href: string
  dark?: boolean
}) {
  return (
    <Link className={`button ${dark ? "button-dark" : ""}`} to={href}>
      <span>{children}</span>
      <Icon name="arrow" />
    </Link>
  )
}
