const fs = require("fs")

let content = fs.readFileSync("src/App.tsx", "utf8")

// Replace export default App with Root component

const routerWrapper = `

import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom"
import OurStory from "./pages/OurStory"
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
          <Route path="heritage/:id" element={<Heritage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
`

content = content.replace("export default App", routerWrapper)

fs.writeFileSync("src/App.tsx", content, "utf8")

console.log("App.tsx wrapped with router")
