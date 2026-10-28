export interface ProductVariant {
  id: string
  name: string
  fullName: string
  tagline: string
  price: string
  numericPrice: number
  description: string
  highlights: string[]
}

export interface ProductSpecRow {
  label: string
  values: Record<string, string>
}

export interface ProductDetailedInfo {
  fullTitle: string
  generalInfo: {
    productName: string
    dimensions: string
    material: string
    targetAudience: string
    structureSummary?: string
  }
  introParagraphs: string[]
  variants: ProductVariant[]
  specTable: ProductSpecRow[]
}

export interface Product {
  id: string
  slug: string
  legacySlugs?: string[]
  name: string
  eyebrow: string
  price: string
  priceRange?: string
  image: string
  number: string
  accent: string
  description: string
  modelUrl?: string
  usdzUrl?: string
  specifications: {
    pieces: string
    time: string
    difficulty: string
    material: string
    size: string
    audience: string
    weight: string
  }
  detailedInfo?: ProductDetailedInfo
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
    price: "369.000 ₫",
    priceRange: "369.000 ₫ - 669.000 ₫",
    image: "/images/thap-rua.jpg",
    number: "01",
    accent: "Bán chạy",
    description:
      "Lấy cảm hứng từ Tháp Rùa - biểu tượng kiến trúc giữa Hồ Hoàn Kiếm, Hà Nội, mô hình lắp ghép gỗ 3D của Kiến Tích Việt tái hiện những đặc trưng nhận diện của công trình thông qua trải nghiệm tự tay lắp ráp.",
    modelUrl: "/models/Thap-rua-model.glb",
    usdzUrl: "/models/Thap-rua-model.usdz",
    audioUrl: "/audio/thap-rua.mp3",
    audioTitle: "Tháp Rùa - Biểu tượng giữa lòng Hồ Hoàn Kiếm",
    audioAuthor: "Thuyết minh Di sản · Kiến Tích Việt",
    specifications: {
      pieces: "148",
      time: "",
      difficulty: "Module lắp ghép",
      material: "Gỗ basswood",
      size: "Khoảng 20 × 20 × 30 cm",
      audience: "18-30 tuổi",
      weight: "620g",
    },
    detailedInfo: {
      fullTitle: "Mô hình lắp ghép gỗ 3D Tháp Rùa",
      generalInfo: {
        productName: "Mô hình lắp ghép gỗ 3D Tháp Rùa",
        dimensions: "Khoảng 20 × 20 × 30 cm",
        material: "Gỗ basswood",
        targetAudience: "18-30 tuổi",
        structureSummary:
          "Cấu trúc module: phần đế, thân tháp nhiều tầng, hệ cửa - tường, mái và chi tiết trang trí",
      },
      introParagraphs: [
        "Lấy cảm hứng từ Tháp Rùa - biểu tượng kiến trúc giữa Hồ Hoàn Kiếm, Hà Nội, mô hình lắp ghép gỗ 3D của Kiến Tích Việt tái hiện những đặc trưng nhận diện của công trình thông qua trải nghiệm tự tay lắp ráp.",
        "Mô hình được thiết kế theo cấu trúc module, gồm phần đế, thân tháp nhiều tầng, hệ cửa - tường, mái và các chi tiết trang trí. Người dùng từng bước ghép các bộ phận để hoàn thiện công trình, từ đó trực tiếp trải nghiệm quá trình “dựng hình di sản”.",
        "Sản phẩm được phát triển thành 3 phiên bản: Basic, Signature và Premium, phù hợp với những nhu cầu trải nghiệm khác nhau.",
      ],
      variants: [
        {
          id: "basic",
          name: "Basic",
          fullName: "Tháp Rùa Basic",
          tagline: "Gỗ mộc nguyên bản · Trải nghiệm DIY tối giản",
          price: "369.000 ₫",
          numericPrice: 369000,
          description:
            "Phiên bản gỗ mộc nguyên bản, tập trung vào trải nghiệm tự tay lắp ghép mô hình 3D. Thiết kế module dễ thao tác, giữ nguyên màu sắc và vẻ đẹp tự nhiên của gỗ, phù hợp với người yêu thích DIY và phong cách tối giản.",
          highlights: [
            "Bề mặt: Gỗ mộc tự nhiên",
            "Thiết kế module dễ thao tác",
            "Phong cách mộc tối giản",
          ],
        },
        {
          id: "signature",
          name: "Signature",
          fullName: "Tháp Rùa Signature",
          tagline: "Gỗ hoàn thiện có màu · Tích hợp NFC & AR, Audio",
          price: "499.000 ₫",
          numericPrice: 499000,
          description:
            "Phiên bản nâng cấp với mô hình gỗ có màu, kết hợp công nghệ NFC và AR. Người dùng vừa trải nghiệm lắp ráp, vừa khám phá lịch sử, văn hóa Tháp Rùa qua nội dung số, thuyết minh âm thanh và tương tác 3D.",
          highlights: [
            "Bề mặt: Hoàn thiện có màu",
            "Công nghệ NFC và AR tương tác 3D",
            "Tích hợp Audio Storytelling",
          ],
        },
        {
          id: "premium",
          name: "Premium",
          fullName: "Tháp Rùa Premium",
          tagline: "Khảm thủ công đá Mosaic · Cá nhân hóa · NFC & AR",
          price: "669.000 ₫",
          numericPrice: 669000,
          description:
            "Phiên bản cao cấp kết hợp lắp ghép gỗ 3D, khảm mosaic toàn bộ bề mặt và công nghệ NFC/AR. Người dùng có thể cá nhân hóa màu sắc trong phạm vi cho phép, tạo nên mô hình mang dấu ấn riêng mà vẫn giữ được đặc trưng kiến trúc của Tháp Rùa. Sản phẩm đi kèm bộ dụng cụ khảm mosaic.",
          highlights: [
            "Bề mặt: Khảm thủ công đá mosaic",
            "Tích hợp NFC & AR + Audio Storytelling",
            "Cá nhân hóa màu sắc trong bảng màu cho phép",
            "Kèm bộ dụng cụ: Nhíp, bọt biển, bột trám, keo sữa, que trộn, cốc",
          ],
        },
      ],
      specTable: [
        {
          label: "Bề mặt",
          values: {
            basic: "Gỗ mộc",
            signature: "Hoàn thiện có màu",
            premium: "Khảm thủ công đá mosaic",
          },
        },
        {
          label: "Công nghệ NFC và AR",
          values: {
            basic: "Không",
            signature: "Có",
            premium: "Có",
          },
        },
        {
          label: "Audio Storytelling",
          values: {
            basic: "Không",
            signature: "Có",
            premium: "Có",
          },
        },
        {
          label: "Trang trí thủ công sáng tạo",
          values: {
            basic: "Không",
            signature: "Không",
            premium: "Đá mosaic",
          },
        },
        {
          label: "Cá nhân hóa",
          values: {
            basic: "Không",
            signature: "Không",
            premium: "Có, trong bảng màu cho phép",
          },
        },
        {
          label: "Bộ dụng cụ",
          values: {
            basic: "Không",
            signature: "Không",
            premium: "Nhíp, bọt biển, bột trám, keo sữa, que trộn, cốc",
          },
        },
      ],
    },
  },
  {
    id: "p2",
    slug: "chua-mot-cot",
    name: "Chùa Một Cột",
    eyebrow: "Hà Nội · Di sản Thăng Long",
    price: "890.000 ₫",
    image: "/images/chua-mot-cot.jpg",
    number: "02",
    accent: "Sắp ra mắt",
    description:
      "Mô hình lắp ghép gỗ 3D lấy cảm hứng từ kiến trúc độc đáo mang hình tượng đóa sen của Chùa Một Cột.",
    audioUrl:
      "/audio/chuyen_ve_doa_sen_go_cua_ngan_nam_van_hienco_270f3316-cf23-4e17-8255-8693ab8597a5.mp3",
    audioTitle: "Chuyện về đóa sen gỗ của ngàn năm văn hiến",
    audioAuthor: "Thuyết minh Di sản · Kiến Tích Việt",
    specifications: {
      pieces: "xxx",
      time: "",
      difficulty: "Trung bình",
      material: "Gỗ basswood",
      size: "Khoảng 20 × 20 × 25 cm",
      audience: "18-30 tuổi",
      weight: "500g",
    },
  },
  {
    id: "p3",
    slug: "pho-hang-trong",
    legacySlugs: ["khue-van-cac"],
    name: "Phố Hàng Trống",
    eyebrow: "Hà Nội · Phố cổ Hà Nội",
    price: "219.000 ₫",
    priceRange: "219.000 ₫ - 289.000 ₫",
    image: "/images/pho-hang-trong.jpg",
    number: "03",
    accent: "Mới",
    description:
      "Lấy cảm hứng từ phố Hàng Trống - một trong những phố nghề truyền thống nổi tiếng của Hà Nội, mô hình lắp ghép gỗ 3D Phố Hàng Trống của Kiến Tích Việt tái hiện không gian cửa hàng tranh dân gian xưa.",
    modelUrl: "/models/Hang-Trong-Model.glb",
    usdzUrl: "/models/Hang-Trong-Model.usdz",
    audioUrl: "/audio/pho-hang-trong.mp3",
    audioTitle:
      "Phố Hàng Trống - Nơi sắc màu dân gian lưu dấu giữa lòng Hà Nội",
    audioAuthor: "Thuyết minh Di sản · Kiến Tích Việt",
    specifications: {
      pieces: "xxx",
      time: "",
      difficulty: "Nhà chữ L",
      material: "Gỗ basswood",
      size: "Khoảng 15 × 15 × 20 cm",
      audience: "18-30 tuổi",
      weight: "450g",
    },
    detailedInfo: {
      fullTitle: "Mô hình lắp ghép gỗ 3D Hàng Trống",
      generalInfo: {
        productName: "Mô hình lắp ghép gỗ 3D Hàng Trống",
        dimensions: "Khoảng 15 × 15 × 20 cm",
        material: "Gỗ basswood",
        targetAudience: "18-30 tuổi",
        structureSummary:
          "Cấu trúc nhà chữ L: khung nhà, biển hiệu, bàn ghế, giá trưng bày tranh và bộ sticker tranh dân gian",
      },
      introParagraphs: [
        "Lấy cảm hứng từ phố Hàng Trống - một trong những phố nghề truyền thống nổi tiếng của Hà Nội, mô hình lắp ghép gỗ 3D Phố Hàng Trống của Kiến Tích Việt tái hiện không gian cửa hàng tranh dân gian xưa, gắn liền với nghề làm tranh Hàng Trống và những giá trị văn hóa đặc trưng của phố cổ.",
        "Mô hình được thiết kế theo cấu trúc nhà chữ L, gồm khung nhà, biển hiệu, bàn ghế, giá trưng bày tranh và các chi tiết trang trí. Người dùng từng bước lắp ghép các bộ phận, đồng thời tự tay lựa chọn, sắp xếp và dán những bức tranh dân gian thu nhỏ, tạo nên không gian phố nghề mang dấu ấn cá nhân.",
        "Sản phẩm được phát triển thành 2 phiên bản: Basic và Signature, kết hợp trải nghiệm lắp ráp, trang trí và khám phá văn hóa, phù hợp với những nhu cầu trải nghiệm khác nhau.",
      ],
      variants: [
        {
          id: "basic",
          name: "Basic",
          fullName: "Phố Hàng Trống - Basic",
          tagline: "Gỗ mộc nguyên bản · Kèm bộ sticker tranh dân gian",
          price: "219.000 ₫",
          numericPrice: 219000,
          description:
            "Phố Hàng Trống Basic là mô hình lắp ghép gỗ 3D tái hiện không gian cửa hàng tranh dân gian Hàng Trống xưa. Sản phẩm giữ nguyên bề mặt gỗ mộc, kết hợp bộ sticker tranh dân gian, biển hiệu và các chi tiết trang trí, cho phép người dùng tự tay lắp ráp và cá nhân hóa không gian phố nghề theo sở thích.",
          highlights: [
            "Bề mặt: Gỗ mộc, không phủ màu",
            "Kèm bộ sticker tranh dân gian & biển hiệu",
            "Tự tay sắp xếp và cá nhân hóa không gian phố nghề",
          ],
        },
        {
          id: "signature",
          name: "Signature",
          fullName: "Phố Hàng Trống - Signature",
          tagline: "Gỗ hoàn thiện có màu · Sticker tranh dân gian · NFC & AR",
          price: "289.000 ₫",
          numericPrice: 289000,
          description:
            "Phố Hàng Trống Signature là phiên bản mô hình gỗ 3D có màu, tái hiện sinh động không gian cửa hàng tranh dân gian Hàng Trống. Sản phẩm kết hợp trải nghiệm lắp ráp, tự tay trang trí bằng sticker tranh dân gian và công nghệ NFC/AR, giúp người dùng khám phá lịch sử, văn hóa và nghề làm tranh Hàng Trống qua nội dung số tương tác.",
          highlights: [
            "Bề mặt: Gỗ hoàn thiện có màu",
            "Trang trí bằng bộ sticker tranh dân gian",
            "Công nghệ NFC và AR tương tác số",
            "Tích hợp Audio Storytelling",
          ],
        },
      ],
      specTable: [
        {
          label: "Bề mặt",
          values: {
            basic: "Gỗ mộc, không phủ màu",
            signature: "Gỗ hoàn thiện có màu",
          },
        },
        {
          label: "Công nghệ NFC và AR",
          values: {
            basic: "Không",
            signature: "Có",
          },
        },
        {
          label: "Audio Storytelling",
          values: {
            basic: "Không",
            signature: "Có",
          },
        },
      ],
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
