const fs = require("fs")

const content = fs.readFileSync("src/App.tsx", "utf8")

// Add state for checkout

let newContent = content.replace(
  "const [playing, setPlaying] = useState(false)",

  "const [playing, setPlaying] = useState(false)\n  const [isCheckout, setIsCheckout] = useState(false)\n  const [orderSuccess, setOrderSuccess] = useState(false)",
)

// Reset checkout state when closing cart

newContent = newContent.replace(
  /onClick={\(\) => setCartOpen\(false\)}/g,

  "onClick={() => { setCartOpen(false); setIsCheckout(false); setOrderSuccess(false); }}",
)

// Cart Drawer Replacement

const oldCartDrawer = `<aside className="cart-drawer">
          <div className="cart-head">
            <div>
              <p>Đơn hàng của bạn</p>
              <h2>Giỏ hàng ({cartCount})</h2>
            </div>
            <button onClick={() => { setCartOpen(false); setIsCheckout(false); setOrderSuccess(false); }} aria-label="Đóng">
              <Icon name="close" />
            </button>
          </div>
          {cartCount === 0 ? (
            <div className="empty-cart">
              <Icon name="bag" size={42} />
              <h3>Giỏ hàng còn trống</h3>
              <p>Một dấu tích đang chờ bạn tự tay dựng nên.</p>
              <button onClick={() => { setCartOpen(false); setIsCheckout(false); setOrderSuccess(false); }}>
                Khám phá sản phẩm
              </button>
            </div>
          ) : (
            <>
              <div className="cart-product">
                <img src={onePillarPagoda} alt="Chùa Một Cột" />
                <div>
                  <small>Bộ sưu tập Thăng Long</small>
                  <h3>Chùa Một Cột</h3>
                  <span>Số lượng: {cartCount}</span>
                </div>
                <strong>890.000₫</strong>
              </div>
              <div className="cart-summary">
                <span>Tạm tính</span>
                <strong>{(890000 * cartCount).toLocaleString("vi-VN")}₫</strong>
              </div>
              <button className="checkout-button">
                Tiến hành đặt hàng <Icon name="arrow" />
              </button>
            </>
          )}
        </aside>`

const newCartDrawer = `<aside className="cart-drawer" style={{ display: 'flex', flexDirection: 'column' }}>
          <div className="cart-head">
            <div>
              <p>{orderSuccess ? "Hoàn tất" : isCheckout ? "Thông tin giao hàng" : "Đơn hàng của bạn"}</p>
              <h2>{orderSuccess ? "Thành công" : isCheckout ? "Thanh toán" : \`Giỏ hàng (\${cartCount})\`}</h2>
            </div>
            <button onClick={() => { setCartOpen(false); setIsCheckout(false); setOrderSuccess(false); }} aria-label="Đóng">
              <Icon name="close" />
            </button>
          </div>
          
          <div style={{ flex: 1, overflowY: 'auto', paddingRight: '10px' }}>
            {orderSuccess ? (
              <div className="empty-cart">
                <Icon name="sparkle" size={50} />
                <h3>Đặt hàng thành công!</h3>
                <p>Cảm ơn bạn đã đồng hành cùng Kiến Tích Việt. Chúng tôi sẽ sớm liên hệ để xác nhận đơn hàng.</p>
                <button onClick={() => { setCartOpen(false); setIsCheckout(false); setOrderSuccess(false); setCartCount(0); }}>
                  Tiếp tục khám phá
                </button>
              </div>
            ) : cartCount === 0 ? (
              <div className="empty-cart">
                <Icon name="bag" size={42} />
                <h3>Giỏ hàng còn trống</h3>
                <p>Một dấu tích đang chờ bạn tự tay dựng nên.</p>
                <button onClick={() => { setCartOpen(false); setIsCheckout(false); setOrderSuccess(false); }}>
                  Khám phá sản phẩm
                </button>
              </div>
            ) : isCheckout ? (
              <form onSubmit={(e) => { e.preventDefault(); setOrderSuccess(true); }} style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '20px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '14px', fontWeight: 'bold' }}>Họ và tên</label>
                  <input required type="text" placeholder="Nhập họ và tên" style={{ padding: '12px', border: '1px solid #ccc', outline: 'none' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '14px', fontWeight: 'bold' }}>Số điện thoại</label>
                  <input required type="tel" placeholder="Nhập số điện thoại" style={{ padding: '12px', border: '1px solid #ccc', outline: 'none' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '14px', fontWeight: 'bold' }}>Địa chỉ giao hàng</label>
                  <textarea required placeholder="Nhập địa chỉ nhận hàng" style={{ padding: '12px', border: '1px solid #ccc', outline: 'none', minHeight: '80px', resize: 'none' }} />
                </div>
                
                <div className="cart-summary" style={{ marginTop: 'auto' }}>
                  <span>Tổng thanh toán (COD)</span>
                  <strong>{(890000 * cartCount).toLocaleString("vi-VN")}₫</strong>
                </div>
                <button type="submit" className="checkout-button">
                  Xác nhận đặt hàng <Icon name="arrow" />
                </button>
                <button type="button" onClick={() => setIsCheckout(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', marginTop: '10px', textDecoration: 'underline' }}>
                  Quay lại giỏ hàng
                </button>
              </form>
            ) : (
              <>
                <div className="cart-product">
                  <img src={onePillarPagoda} alt="Chùa Một Cột" />
                  <div>
                    <small>Bộ sưu tập Thăng Long</small>
                    <h3>Chùa Một Cột</h3>
                    <span>Số lượng: {cartCount}</span>
                  </div>
                  <strong>890.000₫</strong>
                </div>
                <div className="cart-summary" style={{ marginTop: 'auto' }}>
                  <span>Tạm tính</span>
                  <strong>{(890000 * cartCount).toLocaleString("vi-VN")}₫</strong>
                </div>
                <button className="checkout-button" onClick={() => setIsCheckout(true)}>
                  Tiến hành đặt hàng <Icon name="arrow" />
                </button>
              </>
            )}
          </div>
        </aside>`

newContent = newContent.replace(oldCartDrawer, newCartDrawer)

// Also let's update some <a href> to <Link> for React Router if needed, but not strictly necessary in App.tsx right now.

fs.writeFileSync("src/App.tsx", newContent, "utf8")

console.log("App.tsx modified")
