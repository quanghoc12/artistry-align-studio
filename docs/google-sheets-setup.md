# Hướng dẫn kết nối Đơn hàng về Google Sheet (Kiến Tích Việt)

Để nhận đơn hàng tự động từ website về Google Sheet, bạn chỉ cần thực hiện 4 bước đơn giản sau (mất khoảng 2 phút):

---

### Bước 1: Tạo Google Sheet mới
1. Mở [Google Sheets](https://sheets.google.com) và tạo một bảng tính mới (đặt tên ví dụ: `Đơn Hàng Kiến Tích Việt`).
2. Ở hàng đầu tiên (Dòng 1), tạo các cột tiêu đề sau:
   - Cột A: **Mã đơn**
   - Cột B: **Thời gian**
   - Cột C: **Họ tên khách hàng**
   - Cột D: **Số điện thoại**
   - Cột E: **Email**
   - Cột F: **Địa chỉ giao hàng**
   - Cột G: **Sản phẩm đặt mua**
   - Cột H: **Tổng tiền**
   - Cột I: **Ghi chú**

---

### Bước 2: Dán mã Google Apps Script
1. Trên thanh menu Google Sheet, chọn: **Tiện ích mở rộng (Extensions)** -> **Apps Script**.
2. Xóa hết mã có sẵn trong cửa sổ soạn thảo, rồi copy & paste toàn bộ đoạn code dưới đây vào:

```javascript
function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);

    // Ghi một dòng mới vào Google Sheet
    sheet.appendRow([
      data.orderId || "",
      data.createdAt || new Date().toLocaleString("vi-VN"),
      data.customerName || "",
      "'" + (data.customerPhone || ""), // Thêm dấu ' để giữ nguyên số 0 ở đầu SĐT
      data.customerEmail || "",
      data.customerAddress || "",
      data.products || "",
      data.totalAmount || "",
      data.customerNote || ""
    ]);

    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      message: "Order recorded successfully"
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
```

3. Bấm biểu tượng **Lưu (Save / Ctrl+S)**.

---

### Bước 3: Triển khai Web App (Lấy URL Webhook)
1. Ở góc trên bên phải của trang Apps Script, bấm nút **Triển khai (Deploy)** -> **Tùy chọn triển khai mới (New deployment)**.
2. Bấm vào biểu tượng bánh răng **Chọn loại (Select type)** -> chọn **Ứng dụng web (Web app)**.
3. Điền cấu hình:
   - **Mô tả (Description):** `Webhook đơn hàng Kiến Tích Việt`
   - **Thực thi dưới dạng (Execute as):** `Tôi (Email của bạn)`
   - **Ai có quyền truy cập (Who has access):** **Bất kỳ ai (Anyone)** *(Quan trọng: phải chọn Anyone để website gửi dữ liệu được)*.
4. Bấm **Triển khai (Deploy)**.
5. Nếu Google yêu cầu cấp quyền truy cập tài khoản, bấm **Xem lại quyền truy cập (Review permissions)** -> Chọn tài khoản Google của bạn -> Bấm **Nâng cao (Advanced)** -> Chọn **Đi tới Untitled project (không an toàn)** -> Bấm **Cho phép (Allow)**.
6. Copy đường link tại mục **URL ứng dụng web (Web app URL)** (dạng `https://script.google.com/macros/s/.../exec`).

---

### Bước 4: Cấu hình vào Website
1. Mở file `.env` (hoặc `.env.local`) trong thư mục dự án website.
2. Thêm dòng sau:
```env
VITE_ORDER_WEBHOOK_URL=https://script.google.com/macros/s/ĐOẠN_MÃ_URL_BẠN_VỪA_COPY/exec
```
3. Lưu file lại. Từ lúc này, mỗi khi khách bấm **Hoàn tất đặt hàng**, đơn hàng sẽ ngay lập tức xuất hiện trên Google Sheet của bạn!

