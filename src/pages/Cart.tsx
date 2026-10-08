import { useState, FormEvent } from "react"
import { useCart } from "../context/CartContext"
import { LinkButton, Icon } from "../components/Shared"
import { Link } from "react-router-dom"

export default function Cart() {
  const { cartItems, updateQuantity, removeFromCart, clearCart } = useCart()
  
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    note: ""
  })
  
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")

  const subtotal = cartItems.reduce((total, item) => {
    const numericPrice = parseInt(item.product.price.replace(/\D/g, "")) || 0
    return total + numericPrice * item.quantity
  }, 0)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    
    // Basic Validation
    if (!formData.name.trim() || !formData.phone.trim() || !formData.address.trim()) {
      setErrorMessage("Vui lòng nhập đầy đủ thông tin bắt buộc.")
      setStatus("error")
      return
    }
    
    // Loosely validate phone
    const phoneRegex = /^[0-9\-\+]{9,15}$/
    if (!phoneRegex.test(formData.phone.replace(/\s+/g, ''))) {
      setErrorMessage("Số điện thoại không hợp lệ.")
      setStatus("error")
      return
    }

    // Email validation if provided
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setErrorMessage("Email không hợp lệ.")
      setStatus("error")
      return
    }

    setStatus("loading")
    setErrorMessage("")

    const orderPayload = {
      customer: formData,
      items: cartItems.map(item => ({
        productId: item.product.id,
        productName: item.product.name,
        quantity: item.quantity,
        price: item.product.price
      })),
      total: subtotal
    }

    // Architected for real endpoint, currently blocked
    const webhookUrl = import.meta.env.VITE_ORDER_WEBHOOK_URL
    
    try {
      if (!webhookUrl) {
        console.error("BLOCKED — official webhook endpoint/configuration not provided")
        setStatus("error")
        setErrorMessage("Hiện hệ thống chưa thể tiếp nhận đơn hàng. Vui lòng thử lại sau.")
        return
      }
      
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload)
      })
      
      if (!response.ok) {
        throw new Error("Server error")
      }
      
      setStatus("success")
      clearCart()
      window.scrollTo(0, 0)
    } catch (err) {
      console.error(err)
      setStatus("error")
      setErrorMessage("Đã có lỗi xảy ra. Vui lòng thử lại sau.")
    }
  }

  if (status === "success") {
    return (
      <div style={{ paddingTop: '200px', paddingBottom: '150px', textAlign: 'center', minHeight: '70vh' }}>
        <span style={{ color: 'var(--red)', display: 'block', margin: '0 auto 20px' }}>
          <Icon name="sparkle" size={60} />
        </span>
        <h1 style={{ color: 'var(--red)', marginBottom: '15px' }}>Đặt hàng thành công</h1>
        <p style={{ color: 'var(--muted)', marginBottom: '40px', fontSize: '20px' }}>
          Cảm ơn bạn đã lựa chọn Kiến Tích Việt.<br/>
          Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất để xác nhận đơn hàng.
        </p>
        <LinkButton href="/">Trở về trang chủ</LinkButton>
      </div>
    )
  }

  if (cartItems.length === 0) {
    return (
      <div style={{ paddingTop: '200px', paddingBottom: '150px', textAlign: 'center', minHeight: '70vh' }}>
        <div style={{ display: 'inline-flex', padding: '30px', background: 'var(--cream)', borderRadius: '50%', marginBottom: '30px' }}>
          <span style={{ color: 'var(--red)' }}>
            <Icon name="bag" size={60} />
          </span>
        </div>
        <h1 style={{ color: 'var(--red)', marginBottom: '15px' }}>Giỏ hàng của bạn đang trống</h1>
        <p style={{ color: 'var(--muted)', marginBottom: '40px', fontSize: '20px' }}>
          Một dấu tích đang chờ bạn tự tay dựng nên.
        </p>
        <LinkButton href="/#products">Khám phá sản phẩm</LinkButton>
      </div>
    )
  }

  return (
    <div className="section-pad" style={{ paddingTop: '160px', background: 'var(--paper)', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ color: 'var(--red)', marginBottom: '40px', fontSize: '42px' }}>Thanh toán</h1>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '60px' }}>
          {/* Cart Items Summary */}
          <div>
            <h2 style={{ fontSize: '24px', marginBottom: '30px', borderBottom: '1px solid rgba(143, 0, 25, 0.2)', paddingBottom: '15px' }}>
              Đơn hàng của bạn
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
              {cartItems.map((item) => (
                <div key={item.product.id} style={{ display: 'grid', gridTemplateColumns: '80px 1fr auto', gap: '20px', alignItems: 'center' }}>
                  <img src={item.product.image} alt={item.product.name} style={{ width: '80px', height: '80px', objectFit: 'cover' }} />
                  <div>
                    <h3 style={{ fontSize: '18px', margin: '0 0 5px', color: 'var(--red)' }}>{item.product.name}</h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(255, 255, 255, 0.5)', padding: '2px 8px', borderRadius: '4px' }}>
                        <button 
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          style={{ opacity: item.quantity <= 1 ? 0.5 : 1, cursor: item.quantity <= 1 ? 'not-allowed' : 'pointer', background: 'none', border: 'none', fontSize: '16px' }}
                        >
                          -
                        </button>
                        <span style={{ fontSize: '14px', width: '20px', textAlign: 'center' }}>{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          style={{ background: 'none', border: 'none', fontSize: '16px', cursor: 'pointer' }}
                        >
                          +
                        </button>
                      </div>
                      <button onClick={() => removeFromCart(item.product.id)} style={{ color: 'var(--red)', textDecoration: 'underline', fontSize: '13px', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                        Xoá
                      </button>
                    </div>
                  </div>
                  <strong style={{ color: 'var(--red)', fontSize: '16px' }}>{item.product.price}</strong>
                </div>
              ))}
            </div>
            
            <div style={{ marginTop: '40px', paddingTop: '20px', borderTop: '1px solid rgba(143, 0, 25, 0.2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '18px' }}>Tổng cộng</span>
              <strong style={{ fontSize: '28px', color: 'var(--red)' }}>{subtotal.toLocaleString("vi-VN")}₫</strong>
            </div>
          </div>

          {/* Checkout Form */}
          <div style={{ background: 'var(--cream)', padding: '40px', borderRadius: '8px' }}>
            <h2 style={{ fontSize: '24px', marginBottom: '30px', color: 'var(--red)' }}>Thông tin giao hàng</h2>
            
            {status === "error" && (
              <div style={{ background: 'rgba(143, 0, 25, 0.1)', color: 'var(--red)', padding: '15px', borderRadius: '4px', marginBottom: '25px', fontSize: '15px' }}>
                {errorMessage}
              </div>
            )}
            
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--muted)', fontWeight: 600 }}>
                  Họ và tên *
                </label>
                <input 
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  style={{ width: '100%', padding: '12px 15px', border: '1px solid rgba(143, 0, 25, 0.2)', borderRadius: '4px', background: 'white' }}
                  placeholder="Nhập họ và tên"
                />
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--muted)', fontWeight: 600 }}>
                    Số điện thoại *
                  </label>
                  <input 
                    type="tel"
                    value={formData.phone}
                    onChange={e => setFormData({...formData, phone: e.target.value})}
                    style={{ width: '100%', padding: '12px 15px', border: '1px solid rgba(143, 0, 25, 0.2)', borderRadius: '4px', background: 'white' }}
                    placeholder="Nhập số điện thoại"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--muted)', fontWeight: 600 }}>
                    Email (Tuỳ chọn)
                  </label>
                  <input 
                    type="email"
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                    style={{ width: '100%', padding: '12px 15px', border: '1px solid rgba(143, 0, 25, 0.2)', borderRadius: '4px', background: 'white' }}
                    placeholder="Nhập email"
                  />
                </div>
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--muted)', fontWeight: 600 }}>
                  Địa chỉ giao hàng *
                </label>
                <input 
                  type="text"
                  value={formData.address}
                  onChange={e => setFormData({...formData, address: e.target.value})}
                  style={{ width: '100%', padding: '12px 15px', border: '1px solid rgba(143, 0, 25, 0.2)', borderRadius: '4px', background: 'white' }}
                  placeholder="Nhập địa chỉ nhận hàng"
                />
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--muted)', fontWeight: 600 }}>
                  Ghi chú (Tuỳ chọn)
                </label>
                <textarea 
                  value={formData.note}
                  onChange={e => setFormData({...formData, note: e.target.value})}
                  style={{ width: '100%', padding: '12px 15px', border: '1px solid rgba(143, 0, 25, 0.2)', borderRadius: '4px', background: 'white', minHeight: '100px', resize: 'vertical' }}
                  placeholder="Ghi chú thêm về đơn hàng"
                />
              </div>

              <button 
                type="submit"
                disabled={status === "loading"}
                style={{ 
                  marginTop: '10px', 
                  background: 'var(--red)', 
                  color: 'white', 
                  border: 'none', 
                  padding: '18px', 
                  fontSize: '18px', 
                  fontWeight: 700, 
                  cursor: status === "loading" ? 'not-allowed' : 'pointer',
                  opacity: status === "loading" ? 0.7 : 1,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '10px'
                }}
              >
                {status === "loading" ? (
                  "Đang xử lý..."
                ) : (
                  <>Hoàn tất đặt hàng <Icon name="arrow" /></>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
