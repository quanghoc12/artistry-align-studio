import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react"

import { Product } from "../data/products"

import { toast } from "../components/Motion"

export interface CartItem {
  product: Product

  quantity: number
}

interface CartContextType {
  cartOpen: boolean

  setCartOpen: (open: boolean) => void

  cartItems: CartItem[]

  cartCount: number

  addToCart: (product: Product, quantity?: number) => void

  removeFromCart: (productId: string) => void

  updateQuantity: (productId: string, quantity: number) => void

  clearCart: () => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartOpen, setCartOpen] = useState(false)

  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem("ktv_cart")

      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem("ktv_cart", JSON.stringify(cartItems))
  }, [cartItems])

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0)

  const addToCart = (product: Product, quantity = 1) => {
    toast(`Đã thêm "${product.name}" vào giỏ hàng`)

    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id)

      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item,
        )
      }

      return [...prev, { product, quantity }]
    })
  }

  const removeFromCart = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId))
  }

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) return

    setCartItems((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item,
      ),
    )
  }

  const clearCart = () => {
    setCartItems([])
  }

  return (
    <CartContext.Provider
      value={{
        cartOpen,

        setCartOpen,

        cartItems,

        cartCount,

        addToCart,

        removeFromCart,

        updateQuantity,

        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)

  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }

  return context
}
