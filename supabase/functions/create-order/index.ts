const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: cors })
  }

  try {
    const payload = await req.json()
    const { customerName, customerPhone, customerAddress } = payload || {}

    // Server-side validation
    if (!customerName || !customerPhone || !customerAddress) {
      return json(
        { error: "Vui lòng cung cấp đầy đủ họ tên, số điện thoại và địa chỉ." },
        400,
      )
    }

    const cleanPhone = String(customerPhone).replace(/\D/g, "")
    if (cleanPhone.length < 9 || cleanPhone.length > 12) {
      return json({ error: "Số điện thoại không hợp lệ." }, 400)
    }

    const webhookUrl = Deno.env.get("ORDER_WEBHOOK_URL")
    if (!webhookUrl) {
      console.error("ORDER_WEBHOOK_URL is not set in Supabase secrets.")
      return json(
        { error: "Hệ thống đặt hàng tạm thời bảo trì. Vui lòng liên hệ hotline." },
        500,
      )
    }

    // Forward order payload to Google Apps Script Web App
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain;charset=utf-8",
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      console.warn("Google Apps Script response status:", response.status)
    }

    return json({
      success: true,
      message: "Đơn hàng đã được tiếp nhận thành công.",
      orderId: payload.orderId,
    })
  } catch (err) {
    console.error("Create order error:", err)
    return json({ error: "Có lỗi khi xử lý đơn hàng. Vui lòng thử lại." }, 500)
  }
})

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...cors, "Content-Type": "application/json" },
  })
}
