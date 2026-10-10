const fs = require("fs")

const content = fs.readFileSync("src/App.tsx", "utf8")

// Find boundaries

// const products = [...]

// const stories = [...]

// function Icon(...)

// function Logo(...)

// function LinkButton(...)

// function App(...)

// function Layout(...)

const iconRegex = /type IconName[\s\S]*?(?=function Logo)/

const iconMatch = content.match(iconRegex)

const logoRegex = /function Logo[\s\S]*?(?=function LinkButton)/

const logoMatch = content.match(logoRegex)

const buttonRegex = /function LinkButton[\s\S]*?(?=function App)/

const buttonMatch = content.match(buttonRegex)

// We will write a SharedComponents.tsx that exports Icon, Logo, LinkButton, products, stories

let sharedContent = `import { ReactNode } from "react";\nimport { Link } from "react-router-dom";\n\n`

// Extract imports

const importsRegex = /import .* from ".*"/g

const imports = content.match(importsRegex) || []

sharedContent += imports.join("\n") + "\n\n"

// Replace a href with Link in Logo and LinkButton

let logoCode = logoMatch ? logoMatch[0] : ""

logoCode = logoCode
  .replace(/<a/g, "<Link")
  .replace(/<\/a>/g, "</Link>")
  .replace(/href="#top"/g, 'to="/"')

let buttonCode = buttonMatch ? buttonMatch[0] : ""

buttonCode = buttonCode
  .replace(/<a/g, "<Link")
  .replace(/<\/a>/g, "</Link>")
  .replace(/href=/g, "to=")
  .replace(/className="text-link"/g, 'className="text-link"')

let iconCode = iconMatch ? iconMatch[0] : ""

// Extract products and stories

const dataRegex = /const products = [\s\S]*?(?=function Icon)/

const dataMatch = content.match(dataRegex)

sharedContent += dataMatch ? dataMatch[0] : ""

sharedContent +=
  "\nexport " +
  iconCode
    .replace("type IconName", "export type IconName")
    .replace("function Icon", "function Icon")

sharedContent += "\nexport " + logoCode

sharedContent += "\nexport " + buttonCode

// Export products and stories

sharedContent = sharedContent
  .replace("const products =", "export const products =")
  .replace("const stories =", "export const stories =")

fs.writeFileSync("src/components/Shared.tsx", sharedContent, "utf8")

console.log("Shared components created")
