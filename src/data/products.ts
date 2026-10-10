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

    price: "890.000₫",

    image: "/images/one-pillar-pagoda.jpg",

    number: "01",

    accent: "Mới",

    description:
      "Mỗi chi tiết được cắt chính xác từ gỗ tự nhiên, tái hiện tinh thần kiến trúc nguyên bản trong một trải nghiệm lắp ghép đầy cảm hứng.",

    specifications: {
      pieces: "120",

      time: "3–4 giờ",

      difficulty: "Trung bình",

      material: "[NỘI DUNG CHỜ CUNG CẤP]",

      size: "[NỘI DUNG CHỜ CUNG CẤP]",

      audience: "[NỘI DUNG CHỜ CUNG CẤP]",

      weight: "[NỘI DUNG CHỜ CUNG CẤP]",
    },
  },

  {
    id: "p2",

    slug: "khue-van-cac",

    name: "Khuê Văn Các",

    eyebrow: "Văn Miếu · Quốc Tử Giám",

    price: "790.000₫",

    image: "/images/heritage-door.jpg",

    number: "02",

    accent: "Bán chạy",

    description:
      "Mỗi chi tiết được cắt chính xác từ gỗ tự nhiên, tái hiện tinh thần kiến trúc nguyên bản trong một trải nghiệm lắp ghép đầy cảm hứng.",

    specifications: {
      pieces: "[NỘI DUNG CHỜ CUNG CẤP]",

      time: "[NỘI DUNG CHỜ CUNG CẤP]",

      difficulty: "[NỘI DUNG CHỜ CUNG CẤP]",

      material: "[NỘI DUNG CHỜ CUNG CẤP]",

      size: "[NỘI DUNG CHỜ CUNG CẤP]",

      audience: "[NỘI DUNG CHỜ CUNG CẤP]",

      weight: "[NỘI DUNG CHỜ CUNG CẤP]",
    },
  },

  {
    id: "p3",

    slug: "thap-pho-minh",

    name: "Tháp Phổ Minh",

    eyebrow: "Nam Định · Dấu ấn nhà Trần",

    price: "820.000₫",

    image: "/images/heritage-pagoda.jpg",

    number: "03",

    accent: "Sắp ra mắt",

    description:
      "Mỗi chi tiết được cắt chính xác từ gỗ tự nhiên, tái hiện tinh thần kiến trúc nguyên bản trong một trải nghiệm lắp ghép đầy cảm hứng.",

    specifications: {
      pieces: "[NỘI DUNG CHỜ CUNG CẤP]",

      time: "[NỘI DUNG CHỜ CUNG CẤP]",

      difficulty: "[NỘI DUNG CHỜ CUNG CẤP]",

      material: "[NỘI DUNG CHỜ CUNG CẤP]",

      size: "[NỘI DUNG CHỜ CUNG CẤP]",

      audience: "[NỘI DUNG CHỜ CUNG CẤP]",

      weight: "[NỘI DUNG CHỜ CUNG CẤP]",
    },
  },
]
