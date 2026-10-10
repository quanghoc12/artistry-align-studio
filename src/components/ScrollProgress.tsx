import { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"

export default function ScrollProgress() {
  const { pathname } = useLocation()
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let ticking = false

    const updateScrollProgress = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop
      const scrollHeight =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight
      const percentage =
        scrollHeight > 0
          ? Math.min(Math.max(scrollTop / scrollHeight, 0), 1)
          : 0
      setProgress(percentage)
      ticking = false
    }

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScrollProgress)
        ticking = true
      }
    }

    // Initial update when mounted or route changes
    updateScrollProgress()

    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll, { passive: true })

    // Observe body resizing (e.g. images loading, dynamic height changes)
    const resizeObserver = new ResizeObserver(() => {
      onScroll()
    })
    resizeObserver.observe(document.body)

    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
      resizeObserver.disconnect()
    }
  }, [pathname])

  return (
    <div
      className="scroll-progress-bar"
      role="progressbar"
      aria-valuenow={Math.round(progress * 100)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Tiến trình cuộn trang"
      style={{
        transform: `scaleX(${progress})`,
      }}
    />
  )
}
