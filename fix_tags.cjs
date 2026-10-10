const fs = require("fs")

let content = fs.readFileSync("src/App.tsx", "utf8")

// Replace mismatched </a>

content = content.replace(
  '<Link to="/our-story" onClick={() => setMenuOpen(false)}>\n            Câu chuyện\n          </a>',

  '<Link to="/our-story" onClick={() => setMenuOpen(false)}>\n            Câu chuyện\n          </Link>',
)

content = content.replace(
  '<Link className="text-link" to="/our-story">\n                Về Kiến Tích Việt <Icon name="arrow" />\n              </a>',

  '<Link className="text-link" to="/our-story">\n                Về Kiến Tích Việt <Icon name="arrow" />\n              </Link>',
)

fs.writeFileSync("src/App.tsx", content, "utf8")

console.log("Fixed App.tsx mismatched tags")
