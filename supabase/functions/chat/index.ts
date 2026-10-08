import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const KNOWLEDGE_BASE = `
Sản phẩm của Kiến Tích Việt (SOURCE OF TRUTH):

1. Chùa Một Cột:
- Bộ sưu tập: Thăng Long (Hà Nội)
- Giá: 890.000₫
- Tình trạng: Mới
- Mô tả: Mỗi chi tiết được cắt chính xác từ gỗ tự nhiên, tái hiện tinh thần kiến trúc nguyên bản trong một trải nghiệm lắp ghép đầy cảm hứng.
- Thông số: 120 chi tiết, thời gian lắp 3-4 giờ, độ khó: Trung bình. (Vật liệu, kích thước: đang cập nhật)

2. Khuê Văn Các:
- Bộ sưu tập: Văn Miếu - Quốc Tử Giám
- Giá: 790.000₫
- Tình trạng: Bán chạy
- Mô tả: Mỗi chi tiết được cắt chính xác từ gỗ tự nhiên, tái hiện tinh thần kiến trúc nguyên bản trong một trải nghiệm lắp ghép đầy cảm hứng.
- Thông số: (đang cập nhật)

3. Tháp Phổ Minh:
- Bộ sưu tập: Dấu ấn nhà Trần (Nam Định)
- Giá: 820.000₫
- Tình trạng: Sắp ra mắt
- Mô tả: Mỗi chi tiết được cắt chính xác từ gỗ tự nhiên, tái hiện tinh thần kiến trúc nguyên bản trong một trải nghiệm lắp ghép đầy cảm hứng.
- Thông số: (đang cập nhật)

Chính sách chung: Chưa cập nhật.
Nếu khách hàng hỏi các thông tin (giá, thông số, tồn kho) không có trong dữ liệu này, hãy trả lời rõ là hiện chưa có thông tin chính thức. KHÔNG được tự bịa ra số liệu hoặc giá cả.
`;

const SYSTEM_INSTRUCTION = `
You are the official AI assistant for Kiến Tích Việt.

Your role is to help users understand Kiến Tích Việt products,
Vietnamese history, culture, architecture, heritage and landmarks.

KNOWLEDGE PRIORITY:
1. Official Kiến Tích Việt data is the source of truth for products, prices, availability, specs. Never invent or guess these facts. See the knowledge base below.
2. For general Vietnamese history, culture, architecture, use your general knowledge. Do not fabricate facts or invent dates/people.
3. When combining general knowledge with a product, answer the general part first, then connect to the product using ONLY confirmed data.

Never force a sales pitch.
Be helpful, concise, natural and educational.
Answer in Vietnamese.

Knowledge Base:
${KNOWLEDGE_BASE}
`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { message, history } = await req.json()
    
    if (!message || typeof message !== 'string' || message.length > 1000) {
      throw new Error('Invalid input');
    }

    const apiKey = Deno.env.get('GEMINI_API_KEY')
    if (!apiKey) {
      throw new Error('Internal Server Error')
    }

    const formattedHistory = (history || []).map((msg: any) => ({
      role: msg.sender === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }]
    }));

    formattedHistory.push({
      role: 'user',
      parts: [{ text: message }]
    });

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: formattedHistory,
          systemInstruction: {
            role: "system",
            parts: [{ text: SYSTEM_INSTRUCTION }]
          },
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 500,
          }
        })
      }
    )

    if (!response.ok) {
      console.error('Gemini API Error:', await response.text())
      throw new Error('Failed to connect to AI assistant.')
    }

    const data = await response.json()
    const replyText = data.candidates?.[0]?.content?.parts?.[0]?.text || "Xin lỗi, tôi không thể trả lời lúc này."

    return new Response(JSON.stringify({ reply: replyText }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (error: any) {
    console.error(error);
    return new Response(JSON.stringify({ error: error.message || 'Server error' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})