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
    const rawKeys = [
      "GOOGLE_API_KEY",
      "GEMINI_API_KEY",
      "GEMINI_API_KEY_1",
      "GEMINI_API_KEY_2",
      "GEMINI_API_KEY_3",
      "GEMINI_API_KEY_4",
      "GEMINI_API_KEY_5",
    ].map((k) => Deno.env.get(k)).filter(Boolean) as string[];

    // Remove duplicates and keep only API keys
    const keys = Array.from(new Set(rawKeys));

    if (keys.length === 0) {
      console.error("No Gemini API key found in environment variables (GOOGLE_API_KEY / GEMINI_API_KEY).");
      return json({ error: "Chưa cấu hình API Key (GOOGLE_API_KEY) trên Supabase." }, 500);
    }

    let lastStatus = 500;
    const models = ["gemini-2.5-flash", "gemini-2.5-flash-lite", "gemini-flash-latest", "gemini-3.7-flash"];
    const attempts = models.flatMap((model) => keys.map((key) => ({ model, key })));
    for (const { model, key } of attempts) {
      try {
        const r = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json", "x-goog-api-key": key },
            body: JSON.stringify({ systemInstruction: { parts: [{ text: SYSTEM }] }, contents }),
          },
        );
        if (r.ok) {
          const d = await r.json();
          const text = d?.candidates?.[0]?.content?.parts?.map((p: { text?: string }) => p.text ?? "").join("").trim();
          if (text) {
            return json({ reply: text });
          }
        }
        lastStatus = r.status;
        const errText = await r.text();
        console.error(`Gemini request failed [${model}]:`, r.status, errText.slice(0, 300));
      } catch (err) {
        console.error(`Network error calling Gemini [${model}]:`, err);
      }
    }
    return json({ error: lastStatus === 429 ? "Trợ lý đang quá tải (Rate Limit), vui lòng thử lại sau ít phút." : "Trợ lý tạm thời không phản hồi. Vui lòng thử lại." }, 503);
  } catch (e) {
    console.error("Heritage chat error:", e);
    return json({ error: "Có lỗi xảy ra, vui lòng thử lại." }, 500);
  }
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { ...cors, "Content-Type": "application/json" } });
}

