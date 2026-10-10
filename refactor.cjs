const fs = require("fs")

const appContent = fs.readFileSync("src/App.tsx", "utf8")

// We just need to replace the export default App with a wrapper that provides Routing

const routerWrapper = `
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom"
import OurStory from "./pages/OurStory"
import ProductDetail from "./pages/ProductDetail"
import Cart from "./pages/Cart"
import Heritage from "./pages/Heritage"

function Layout() {
  return <Outlet />
}

export default function Root() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<App />} />
          <Route path="our-story" element={<OurStory />} />
          <Route path="products/:id" element={<ProductDetail />} />
          <Route path="cart" element={<Cart />} />
          <Route path="heritage/:id" element={<Heritage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
`

let newAppContent = appContent.replace("export default App", routerWrapper)

// For navigation, let's inject Link from react-router-dom and replace <a href="#story"> with <Link to="/our-story"> etc.

newAppContent = newAppContent.replace(
  'import { useEffect, useState, type ReactNode } from "react"',
  'import { useEffect, useState, type ReactNode } from "react"\nimport { Link } from "react-router-dom"',
)

newAppContent = newAppContent
  .replace(
    '<a href="#story" onClick={() => setMenuOpen(false)}>',

    '<Link to="/our-story" onClick={() => setMenuOpen(false)}>',
  )
  .replace(
    "Câu chuyện\n          </a>",

    "Câu chuyện\n          </Link>",
  )

newAppContent = newAppContent
  .replace(
    '<a className="text-link" href="#story">',

    '<Link className="text-link" to="/our-story">',
  )
  .replace(
    'Về Kiến Tích Việt <Icon name="arrow" />\n              </a>',

    'Về Kiến Tích Việt <Icon name="arrow" />\n              </Link>',
  )

fs.writeFileSync("src/App.tsx", newAppContent, "utf8")

console.log("App.tsx modified")
