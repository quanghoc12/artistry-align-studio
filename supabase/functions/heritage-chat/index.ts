function getCorsHeaders(req: Request) {
  const origin = req.headers.get("origin") || ""
  const isAllowed =
    !origin ||
    origin.endsWith(".vercel.app") ||
    origin.includes("kientichviet.com") ||
    origin.startsWith("http://localhost:") ||
    origin.startsWith("http://127.0.0.1:") ||
    origin.startsWith("https://localhost:")

  return {
    "Access-Control-Allow-Origin": isAllowed ? (origin || "*") : "https://kientichviet.com",
    "Access-Control-Allow-Headers":
      "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  }
}

// In-memory sliding window rate limiter: 12 requests / 60 seconds per IP
interface RateLimitRecord {
  count: number
  resetAt: number
}
const chatRateLimitMap = new Map<string, RateLimitRecord>()

function isRateLimited(ip: string, maxRequests = 12, windowMs = 60_000): boolean {
  const now = Date.now()
  if (chatRateLimitMap.size > 1000) {
    for (const [key, val] of chatRateLimitMap.entries()) {
      if (now > val.resetAt) chatRateLimitMap.delete(key)
    }
  }

  const record = chatRateLimitMap.get(ip)
  if (!record || now > record.resetAt) {
    chatRateLimitMap.set(ip, { count: 1, resetAt: now + windowMs })
    return false
  }

  if (record.count >= maxRequests) {
    return true
  }

  record.count += 1
  return false
}

const OFFICIAL_DATA = `
Thương hiệu: Kiến Tích Việt — mô hình lắp ghép gỗ di sản Việt Nam. Slogan: "Dựng hình di sản, nối nhịp thời gian". Mỗi bộ: tự lắp ghép → trưng bày → chạm NFC để nghe câu chuyện (audio), trải nghiệm AR trên điện thoại.
Sản phẩm:
1. Tháp Rùa (Hà Nội · Hồ Gươm) — Giá dự kiến: 820.000₫ — 148 mảnh. Nhãn: Sắp ra mắt. (Lưu ý: Không dùng truyền thuyết trả gươm thần, Tháp Rùa tọa lạc trên Gò Rùa, từng có Điếu Đài thời Lê Thánh Tông, đình Tả Vọng thời chúa Trịnh, xây dựng 1884-1886 gắn với Bá hộ Kim / thế hậu chẩm chùa Báo Ân, kiến trúc giao thoa Đông - Tây, chiến sĩ Nguyễn Trọng Quang treo cờ đỏ sao vàng năm 1948).
2. Chùa Một Cột (Hà Nội · Di sản Thăng Long) — 890.000₫ — Số mảnh: xxx mảnh (đang cập nhật). Nhãn: Mới.
3. Phố Hàng Trống (Hà Nội · Phố cổ Hà Nội) — 790.000₫ — Số mảnh: xxx mảnh (đang cập nhật). Nhãn: Bán chạy. (Phố nghề thủ công truyền thống, nổi tiếng với tranh dân gian Hàng Trống, kỹ thuật vờn màu độc đáo).
Chưa được cung cấp: tồn kho, chính sách đổi trả/vận chuyển/bảo hành.`

const SYSTEM = `Bạn là "Trợ lý Kiến Tích Việt", trả lời bằng tiếng Việt, thân thiện, ngắn gọn (≤150 từ).
Tuân thủ 3 tầng:
- Tầng 1 (Kiến Tích Việt: sản phẩm, giá, chất liệu, tồn kho, chính sách, thương hiệu): CHỈ dùng DỮ LIỆU CHÍNH THỨC bên dưới. Nếu thông tin không có, nói rõ "Thông tin này hiện chưa được Kiến Tích Việt cung cấp" và gợi ý liên hệ qua Facebook. Tuyệt đối không bịa giá, thông số, chính sách.
- Tầng 2 (văn hóa/lịch sử/kiến trúc/nhân vật Việt Nam): được dùng kiến thức nền, chỉ nêu điều phổ biến, chắc chắn; nếu không chắc thì nói rõ.
- Tầng 3 (kết nối): chỉ liên hệ kiến thức với sản phẩm khi thật sự liên quan; không ép bán hàng.
DỮ LIỆU CHÍNH THỨC:${OFFICIAL_DATA}`

Deno.serve(async (req) => {
  const corsHeaders = getCorsHeaders(req)
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders })

  const clientIp =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("cf-connecting-ip") ||
    "client-default"

  if (isRateLimited(clientIp, 12, 60_000)) {
    return json(
      { error: "Bạn đang gửi câu hỏi quá nhanh. Vui lòng chờ 1 phút trước khi hỏi tiếp nhé." },
      429,
      corsHeaders
    )
  }

  try {
    const { messages } = await req.json()

    if (
      !Array.isArray(messages) ||
      messages.length === 0 ||
      messages.length > 30
    ) {
      return json({ error: "Yêu cầu không hợp lệ." }, 400, corsHeaders)
    }

    const contents = messages
      .slice(-20)
      .map((m: { sender: string; text: string }) => ({
        role: m.sender === "user" ? "user" : "model",
        parts: [{ text: String(m.text).slice(0, 2000) }],
      }))

    const rawKeys = [
      "GOOGLE_API_KEY",
      "GEMINI_API_KEY",
      "GEMINI_API_KEY_1",
      "GEMINI_API_KEY_2",
      "GEMINI_API_KEY_3",
      "GEMINI_API_KEY_4",
      "GEMINI_API_KEY_5",
    ]
      .map((k) => Deno.env.get(k))
      .filter(Boolean) as string[]

    // Remove duplicates and keep only API keys
    const keys = Array.from(new Set(rawKeys))

    if (keys.length === 0) {
      console.error(
        "No Gemini API key found in environment variables (GOOGLE_API_KEY / GEMINI_API_KEY).",
      )

      return json(
        { error: "Chưa cấu hình API Key (GOOGLE_API_KEY) trên Supabase." },
        500,
        corsHeaders
      )
    }

    // Các model thực tế:
    // - gemini-3.8-flash: Model Gemini 3.8 Flash trong bảng hạn ngạch Google AI Studio của bạn
    // - gemini-3.5-flash: Model dự phòng có tỷ lệ sẵn sàng cao, đảm bảo không bị gián đoạn khi 3.8-flash chạm trần ngày
    const PRIMARY_MODEL = "gemini-3.8-flash"
    const FALLBACK_MODEL = "gemini-3.5-flash"

    // Trộn ngẫu nhiên các key để phân tải đều giữa các dự án (load balancing)
    const shuffledKeys = [...keys].sort(() => Math.random() - 0.5)

    // Cơ chế 1 - 1 nghiêm ngặt:
    // Lần 1: Gọi PRIMARY_MODEL với Key A
    // Lần 2 (nếu Lần 1 bị lỗi 503/429): Gọi FALLBACK_MODEL với Key B
    // Tối đa 2 lần gọi. Tuyệt đối không thử tiếp để bảo vệ hạn ngạch RPM / RPD của các key khác.
    const attempts = [
      { key: shuffledKeys[0], model: PRIMARY_MODEL },
      { key: shuffledKeys[1] || shuffledKeys[0], model: FALLBACK_MODEL },
    ]

    let lastStatus = 500

    for (let i = 0; i < attempts.length; i++) {
      const { key, model } = attempts[i]
      try {
        const r = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-goog-api-key": key,
            },
            body: JSON.stringify({
              systemInstruction: { parts: [{ text: SYSTEM }] },
              contents,
            }),
          },
        )

        if (r.ok) {
          const d = await r.json()
          const text = d?.candidates?.[0]?.content?.parts
            ?.map((p: { text?: string }) => p.text ?? "")
            .join("")
            .trim()

          if (text) {
            return json({ reply: text }, 200, corsHeaders)
          }
        }

        lastStatus = r.status
        const errText = await r.text()
        console.warn(
          `Gemini request attempt ${i + 1}/${attempts.length} failed [${model}]:`,
          r.status,
          errText.slice(0, 200),
        )

        // Nếu lỗi 400 (Bad Request do nội dung câu hỏi) thì không cần thử tiếp
        if (r.status === 400) {
          break
        }
      } catch (err) {
        console.error(`Network error calling Gemini attempt ${i + 1}:`, err)
      }
    }

    return json(
      {
        error:
          lastStatus === 429 || lastStatus === 503
            ? "Trợ lý đang bận xử lý nhiều câu hỏi. Bạn vui lòng đợi 1 chút rồi thử lại nhé!"
            : "Trợ lý tạm thời không phản hồi. Vui lòng thử lại sau giây lát.",
      },
      lastStatus === 429 || lastStatus === 503 ? 429 : 503,
      corsHeaders
    )
  } catch (e) {
    console.error("Heritage chat error:", e)
    return json({ error: "Có lỗi xảy ra, vui lòng thử lại." }, 500, corsHeaders)
  }
})

function json(body: unknown, status = 200, corsHeaders: Record<string, string>) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  })
}
