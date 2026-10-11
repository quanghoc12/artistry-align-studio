export interface Product {
  id: string

  slug: string

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
}

export const products: Product[] = [
  {
    id: "p1",

    slug: "chua-mot-cot",

    name: "Chùa Một Cột",

    eyebrow: "Hà Nội · Bộ sưu tập Thăng Long",

    price: "890.000 ₫",

    image: "/images/one-pillar-pagoda.jpg",

    number: "01",

    accent: "Mới",

    description:
      "Mỗi chi tiết được cắt chính xác từ gỗ tự nhiên, tái hiện tinh thần kiến trúc nguyên bản trong một trải nghiệm lắp ghép đầy cảm hứng.",

    specifications: {
      pieces: "120",

      time: "3–4 giờ",

      difficulty: "Trung bình",

      material: "Gỗ bồ đề tự nhiên",

      size: "20 × 20 × 25 cm",

      audience: "12 tuổi trở lên",

      weight: "500g",
    },
  },

  {
    id: "p2",

    slug: "khue-van-cac",

    name: "Khuê Văn Các",

    eyebrow: "Văn Miếu · Quốc Tử Giám",

    price: "790.000 ₫",

    image: "/images/heritage-door.jpg",

    number: "02",

    accent: "Bán chạy",

    description:
      "Mỗi chi tiết được cắt chính xác từ gỗ tự nhiên, tái hiện tinh thần kiến trúc nguyên bản trong một trải nghiệm lắp ghép đầy cảm hứng.",

    specifications: {
      pieces: "96",

      time: "2–3 giờ",

      difficulty: "Trung bình",

      material: "Gỗ bồ đề tự nhiên",

      size: "18 × 18 × 22 cm",

      audience: "12 tuổi trở lên",

      weight: "450g",
    },
  },

  {
    id: "p3",

    slug: "thap-pho-minh",

    name: "Tháp Phổ Minh",

    eyebrow: "Nam Định · Dấu ấn nhà Trần",

    price: "820.000 ₫",

    image: "/images/heritage-pagoda.jpg",

    number: "03",

    accent: "Sắp ra mắt",

    description:
      "Mỗi chi tiết được cắt chính xác từ gỗ tự nhiên, tái hiện tinh thần kiến trúc nguyên bản trong một trải nghiệm lắp ghép đầy cảm hứng.",

    specifications: {
      pieces: "148",

      time: "4–5 giờ",

      difficulty: "Nâng cao",

      material: "Gỗ sồi & bồ đề",

      size: "15 × 15 × 38 cm",

      audience: "14 tuổi trở lên",

      weight: "620g",
    },
  },
]
