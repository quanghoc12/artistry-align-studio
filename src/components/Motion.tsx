import { useEffect, useState } from "react"

import { useLocation } from "react-router-dom"

/** Fade-up reveal (once) with 0.1s stagger between sibling .reveal items. */

export function ScrollReveal() {
  const { pathname } = useLocation()

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-in")

            io.unobserve(e.target)
          }
        })
      },

      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    )

    const seen = new WeakSet<Element>()

    const prepare = () => {
      document
        .querySelectorAll<HTMLElement>(".reveal:not(.is-in)")
        .forEach((el) => {
          if (seen.has(el)) return

          seen.add(el)

          if (reduce) return el.classList.add("is-in")

          const sibs = el.parentElement
            ? Array.from(el.parentElement.children).filter((c) =>
                c.classList.contains("reveal"),
              )
            : []

          const i = Math.max(0, sibs.indexOf(el))

          el.style.setProperty("--rv-delay", `${Math.min(i, 6) * 0.1}s`)

          io.observe(el)
        })
    }

    prepare()

    const mo = new MutationObserver(prepare)

    mo.observe(document.body, { childList: true, subtree: true })

    return () => {
      io.disconnect()

      mo.disconnect()
    }
  }, [pathname])

  return null
}

type ToastItem = { id: number text: string leaving?: boolean }

export function toast(text: string) {
  window.dispatchEvent(new CustomEvent("ktv-toast", { detail: text }))
}

export function Toaster() {
  const [items, setItems] = useState<ToastItem[]>([])

  useEffect(() => {
    const on = (e: Event) => {
      const id = Date.now() + Math.random()

      setItems((l) => [...l, { id, text: (e as CustomEvent).detail }])

      setTimeout(
        () =>
          setItems((l) =>
            l.map((t) => (t.id === id ? { ...t, leaving: true } : t)),
          ),
        4000,
      )

      setTimeout(() => setItems((l) => l.filter((t) => t.id !== id)), 4400)
    }

    window.addEventListener("ktv-toast", on)

    return () => window.removeEventListener("ktv-toast", on)
  }, [])

  return (
    <div className="toast-stack" role="status" aria-live="polite">
      {items.map((t) => (
        <div key={t.id} className={`toast ${t.leaving ? "is-leaving" : ""}`}>
          <span className="toast-dot" aria-hidden="true">
            ✓
          </span>
          {t.text}
        </div>
      ))}
    </div>
  )
}

export function Spinner() {
  return <span className="spinner" aria-hidden="true" />
}

export function Skeleton({
  className = "",
  style,
}: {
  className?: string
  style?: React.CSSProperties
}) {
  return (
    <span
      className={`skeleton ${className}`}
      style={style}
      aria-hidden="true"
    />
  )
}
