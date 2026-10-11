import { useEffect } from "react"

import { useLocation } from "react-router-dom"

export default function ScrollToTop() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0)
    } else {
      const id = hash.replace("#", "")
      const scrollToElement = () => {
        const element = document.getElementById(id)
        if (element) {
          element.scrollIntoView({ behavior: "smooth" })
          return true
        }
        return false
      }

      if (!scrollToElement()) {
        const timer = setTimeout(scrollToElement, 150)
        return () => clearTimeout(timer)
      }
    }
  }, [pathname, hash])

  return null
}
