# Kiến Tích Việt — Nền tảng Trải nghiệm Di sản Số & Mô hình Lắp ghép Gỗ 3D

Website chính thức của **Kiến Tích Việt**, kết hợp giới thiệu bộ sưu tập mô hình lắp ghép gỗ 3D di sản Việt Nam với không gian trải nghiệm số đa giác quan: **Thuyết minh âm thanh (Audio Guide)**, **Mô hình 3D tương tác 360°**, **Thực tế tăng cường (WebAR / QuickLook)** và **Trợ lý AI Di sản**.

---

## Công nghệ sử dụng

- **Frontend:** React 19, TypeScript, React Router v7
- **Styling:** Tailwind CSS v4 & Custom Heritage Design System (`src/index.css`)
- **3D & WebAR:** `@google/model-viewer` (hỗ trợ WebXR trên Android & Apple QuickLook `.usdz` trên iOS)
- **Build Tool:** Vite 8
- **Backend / Edge Functions:** Supabase (`supabase/functions`)

---

## Cấu trúc thư mục chính

```text
├── public/
│   ├── audio/               # File âm thanh thuyết minh di sản (.mp3)
│   ├── images/              # Hình ảnh sản phẩm và tư liệu di sản
│   └── models/              # File mô hình 3D (.glb cho Web/Android, .usdz cho iOS AR)
├── src/
│   ├── components/
│   │   ├── layout/          # Header, Footer, MainLayout, CartDrawer
│   │   ├── AudioGuidePlayer.tsx  # Trình phát thuyết minh âm thanh
│   │   ├── Chatbox.tsx           # Trợ lý AI trò chuyện về di sản
│   │   ├── HeritageHub.tsx       # Trang tổng quan cổng di sản số
│   │   ├── ModelViewer3D.tsx     # Trình xem 3D & kích hoạt AR
│   │   └── Shared.tsx            # Các component dùng chung (Icon, Logo, Button)
│   ├── context/
│   │   └── CartContext.tsx  # Quản lý trạng thái giỏ hàng
│   ├── data/
│   │   └── products.ts      # Dữ liệu sản phẩm, thông số, đường dẫn audio & 3D model
│   ├── pages/
│   │   ├── Home.tsx         # Trang chủ
│   │   ├── OurStory.tsx     # Về chúng tôi
│   │   ├── Products.tsx     # Danh sách sản phẩm
│   │   ├── ProductDetail.tsx# Chi tiết sản phẩm
│   │   ├── Heritage.tsx     # Trang trải nghiệm di sản số (Audio + 3D/AR)
│   │   └── Cart.tsx         # Giỏ hàng & Đặt hàng
│   ├── App.tsx              # Định tuyến ứng dụng (Routing)
│   └── index.css            # Hệ thống giao diện & CSS toàn cục
└── supabase/
    └── functions/           # Edge Functions (Chat AI & Xử lý đơn hàng)
```

---

## Hướng dẫn cài đặt và phát triển

### 1. Cài đặt thư viện
```bash
npm install
```

### 2. Chạy môi trường phát triển (Local Development)
```bash
npm run dev
```

### 3. Build bản Production
```bash
npm run build
```

