const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const OFFICIAL_DATA = `
Thương hiệu: Kiến Tích Việt — mô hình lắp ghép gỗ di sản Việt Nam. Slogan: "Dựng hình di sản, nối nhịp thời gian". Mỗi bộ: tự lắp ghép → trưng bày → chạm NFC để nghe câu chuyện (audio), AR đang phát triển.
Sản phẩm:
1. Chùa Một Cột (Hà Nội · Bộ sưu tập Thăng Long) — 890.000₫ — 120 mảnh, 3–4 giờ, độ khó Trung bình. Nhãn: Mới.
2. Khuê Văn Các (Văn Miếu · Quốc Tử Giám) — 790.000₫. Nhãn: Bán chạy.
3. Tháp Phổ Minh (Nam Định · Dấu ấn nhà Trần) — 820.000₫. Nhãn: Sắp ra mắt.
Chưa được cung cấp: chất liệu chi tiết, kích thước, cân nặng, độ tuổi, tồn kho, chính sách đổi trả/vận chuyển/bảo hành.`;

const SYSTEM = `Bạn là "Trợ lý Kiến Tích Việt", trả lời bằng tiếng Việt, thân thiện, ngắn gọn (≤150 từ).
Tuân thủ 3 tầng:
- Tầng 1 (Kiến Tích Việt: sản phẩm, giá, chất liệu, tồn kho, chính sách, thương hiệu): CHỈ dùng DỮ LIỆU CHÍNH THỨC bên dưới. Nếu thông tin không có, nói rõ "Thông tin này hiện chưa được Kiến Tích Việt cung cấp" và gợi ý liên hệ qua Facebook. Tuyệt đối không bịa giá, thông số, chính sách.
- Tầng 2 (văn hóa/lịch sử/kiến trúc/nhân vật Việt Nam): được dùng kiến thức nền, chỉ nêu điều phổ biến, chắc chắn; nếu không chắc thì nói rõ.
- Tầng 3 (kết nối): chỉ liên hệ kiến thức với sản phẩm khi thật sự liên quan; không ép bán hàng.
DỮ LIỆU CHÍNH THỨC:${OFFICIAL_DATA}`;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: cors });
  try {
    const { messages } = await req.json();
    if (!Array.isArray(messages) || messages.length === 0 || messages.length > 30) {
      return json({ error: "Yêu cầu không hợp lệ." }, 400);
    }
    const contents = messages.slice(-20).map((m: { sender: string; text: string }) => ({
      role: m.sender === "user" ? "user" : "model",
      parts: [{ text: String(m.text).slice(0, 2000) }],
    }));
    const keys = ["GOOGLE_API_KEY", "GEMINI_API_KEY_2", "GEMINI_API_KEY_3", "GEMINI_API_KEY_4", "GEMINI_API_KEY_5"]
      .map((k) => Deno.env.get(k)).filter(Boolean) as string[];

    let lastStatus = 500;
    for (const key of keys) {
      const r = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent",
        {
          method: "POST",
          headers: { "Content-Type": "application/json", "x-goog-api-key": key },
          body: JSON.stringify({ systemInstruction: { parts: [{ text: SYSTEM }] }, contents }),
        },
      );
      if (r.ok) {
        const d = await r.json();
        const text = d?.candidates?.[0]?.content?.parts?.map((p: { text?: string }) => p.text ?? "").join("").trim();
        return json({ reply: text || "Xin lỗi, mình chưa có câu trả lời phù hợp." });
      }
      lastStatus = r.status;
      console.error("gemini key failed", r.status, (await r.text()).slice(0, 300));
    }
    return json({ error: lastStatus === 429 ? "Trợ lý đang quá tải, vui lòng thử lại sau ít phút." : "Trợ lý tạm thời không phản hồi. Vui lòng thử lại." }, 503);
  } catch (e) {
    console.error(e);
    return json({ error: "Có lỗi xảy ra, vui lòng thử lại." }, 500);
  }
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { ...cors, "Content-Type": "application/json" } });
}
