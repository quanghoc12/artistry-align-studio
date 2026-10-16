export interface Product {
  id: string
  slug: string
  legacySlugs?: string[]
  name: string
  eyebrow: string
  price: string
  image: string
  number: string
  accent: string
  description: string
  specifications: {
    pieces: string
    time: string
    difficulty: string
    material: string
    size: string
    audience: string
    weight: string
  }
  audioUrl?: string
  audioTitle?: string
  audioAuthor?: string
}

export const products: Product[] = [
  {
    id: "p1",
    slug: "thap-rua",
    legacySlugs: ["thap-pho-minh"],
    name: "Tháp Rùa",
    eyebrow: "Hà Nội · Hồ Gươm",
    price: "820.000 ₫",
    image: "/images/one-pillar-pagoda.jpg",
    number: "01",
    accent: "Sắp ra mắt",
    description:
      "Mô hình lắp ghép gỗ 3D tái hiện Tháp Rùa, biểu tượng quen thuộc giữa lòng Hồ Gươm.",
    audioUrl:
      "/audio/chuyen_ve_doa_sen_go_cua_ngan_nam_van_hienco_270f3316-cf23-4e17-8255-8693ab8597a5.mp3",
    audioTitle: "Tháp Rùa — Chuyện kể giữa lòng Hồ Gươm",
    audioAuthor: "Thuyết minh Di sản · Kiến Tích Việt",
    specifications: {
      pieces: "148",
      time: "", // Bỏ thông tin thời gian lắp ghép theo ghi chú PDF
      difficulty: "Nâng cao",
      material: "Gỗ sồi & bồ đề",
      size: "15 × 15 × 38 cm",
      audience: "14 tuổi trở lên",
      weight: "620g",
    },
  },
  {
    id: "p2",
    slug: "chua-mot-cot",
    name: "Chùa Một Cột",
    eyebrow: "Di sản Thăng Long",
    price: "890.000 ₫",
    image: "/images/heritage-pagoda.jpg",
    number: "02",
    accent: "Mới",
    description:
      "Mô hình lắp ghép gỗ 3D lấy cảm hứng từ kiến trúc độc đáo mang hình tượng đóa sen của Chùa Một Cột.",
    audioUrl:
      "/audio/chuyen_ve_doa_sen_go_cua_ngan_nam_van_hienco_270f3316-cf23-4e17-8255-8693ab8597a5.mp3",
    audioTitle: "Chuyện về đóa sen gỗ của ngàn năm văn hiến",
    audioAuthor: "Thuyết minh Di sản · Kiến Tích Việt",
    specifications: {
      pieces: "", // Không tự bịa số lượng mảnh ghép khi chưa có dữ liệu xác thực
      time: "3–4 giờ",
      difficulty: "Trung bình",
      material: "Gỗ bồ đề tự nhiên",
      size: "20 × 20 × 25 cm",
      audience: "12 tuổi trở lên",
      weight: "500g",
    },
  },
  {
    id: "p3",
    slug: "pho-hang-trong",
    legacySlugs: ["khue-van-cac"],
    name: "Phố Hàng Trống",
    eyebrow: "Hà Nội · Phố cổ Hà Nội",
    price: "790.000 ₫",
    image: "/images/heritage-door.jpg",
    number: "03",
    accent: "Bán chạy",
    description:
      "Mô hình lắp ghép gỗ 3D lấy cảm hứng từ kiến trúc phố Hàng Trống, tái hiện một góc phố nghề mang dấu ấn tranh dân gian Hà Nội xưa.",
    specifications: {
      pieces: "", // Không tự bịa số lượng mảnh ghép khi chưa có dữ liệu xác thực
      time: "2–3 giờ",
      difficulty: "Trung bình",
      material: "Gỗ bồ đề tự nhiên",
      size: "18 × 18 × 22 cm",
      audience: "12 tuổi trở lên",
      weight: "450g",
    },
  },
]

export function findProduct(slugOrId?: string): Product | undefined {
  if (!slugOrId) return undefined
  return (
    products.find((p) => p.slug === slugOrId || p.id === slugOrId) ||
    products.find((p) => p.legacySlugs?.includes(slugOrId))
  )
}
