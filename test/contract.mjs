// This port owns its application mappings. Inputs come only from the pinned local palette.


const SAMPLES = [
  {
    lang: "ts",
    code: `import { clamp } from "./types";
// Ease every glyph toward the pointer
const RADIUS = 0.35;
export class FieldRenderer extends Base implements Renderer {
  static readonly MAX = 4_096;
  #frame = 0;
  constructor(private readonly field: GlyphField) { super(); }
  async render(paused = false): Promise<number> {
    if (!this.field.gpu || paused) return this.fallback();
    const id = \`glyph-\${RADIUS}\`;
    console.warn("WebGPU unavailable\\n", /gl(yph)?/g, null, undefined);
    return ++this.#frame;
  }
}
enum Mode { Fast = 1 }
@sealed
class K {}
type Opt = string | undefined;
`,
    expect: [
      ["import", "keyword"], ["from", "keyword"], ["./types", "string"], ["Ease every glyph", "comment"],
      ["const", "keyword"], ["RADIUS", "variable"], ["0.35", "number"], ["=", "operator"], [";", "punctuation"],
      ["export", "keyword"], ["class", "keyword"], ["FieldRenderer", "type"], ["extends", "keyword"], ["Base", "type"],
      ["implements", "keyword"], ["Renderer", "type"], ["static", "keyword"], ["readonly", "keyword"],
      ["4_096", "number"], ["#frame", "property"], ["private", "keyword"], ["field", "parameter"],
      ["GlyphField", "type"], ["super", "builtin"], ["async", "keyword"], ["render", "function"],
      ["paused", "parameter"], ["false", "constant"], ["Promise", "type"], ["number", "type"], ["if", "keyword"],
      ["this", "builtin"], ["field#2", "property"], ["gpu", "property"], ["||", "operator"], ["return", "keyword"],
      ["fallback", "function"], ["glyph-", "string"], ["${", "keyword"], ["RADIUS#2", "variable"], ["warn", "function"],
      ["WebGPU", "string"], ["\\n", "escape"], ["gl(yph", "regex"], ["null", "constant"], ["undefined", "constant"],
      ["++", "operator"], ["#frame#2", "property"], ["enum", "keyword"], ["Mode", "type"], ["Fast", "property"],
      ["1 }", "number"], ["@", "decorator"], ["sealed", "decorator"], ["type Opt", "keyword"], ["Opt", "type"],
      ["string", "type"],
    ],
  },
  {
    lang: "tsx",
    code: `export const App = () => <Panel title="Living Code" open>{items.map((i) => <li key={i}>{i}</li>)}</Panel>;\n`,
    expect: [["Panel", "type"], ["title", "attribute"], ["Living Code", "string"], ["li", "tag"], ["key", "attribute"], ["=>", "operator"]],
  },
  {
    lang: "python",
    code: `import math
from dataclasses import dataclass

MAX_GLYPHS = 4096  # cap the field

@dataclass
class Field:
    """A field of glyphs."""
    radius: float = 0.35

    def render(self, paused: bool = False) -> int:
        if paused or not self.gpu:
            return len(self.cells)
        print(f"glyph-{self.radius}\\n", None, True)
        return math.floor(MAX_GLYPHS / 2)
`,
    expect: [
      ["import", "keyword"], ["from", "keyword"], ["MAX_GLYPHS", "variable"], ["4096", "number"], ["cap the field", "comment"],
      ["@", "decorator"], ["dataclass#3", "decorator"], ["class Field", "keyword"], ["Field", "type"], ["A field of glyphs", "comment"],
      ["float", "type"], ["0.35", "number"], ["def", "keyword"], ["render", "function"], ["self", "builtin"],
      ["paused", "parameter"], ["bool", "type"], ["False", "constant"], ["int", "type"], ["if", "keyword"], ["or", "keyword"],
      ["not", "keyword"], ["self#2", "builtin"], ["gpu", "property"], ["return", "keyword"], ["len", "function"],
      ["print", "function"], ["glyph-", "string"], ["\\n", "escape"], ["None", "constant"], ["True", "constant"],
      ["floor", "function"], ["MAX_GLYPHS#2", "variable"],
    ],
  },
  {
    lang: "rust",
    code: `use std::fmt;
const MAX_GLYPHS: usize = 4_096;
/// A field of glyphs.
#[derive(Debug, Clone)]
pub struct Field<'a> { radius: f32, name: &'a str }
impl Field<'_> {
    pub fn render(&mut self, paused: bool) -> Option<u32> {
        if paused { return None; }
        let count = self.radius as u32 + 1;
        println!("glyph-{}\\n", count);
        Some(MAX_GLYPHS as u32)
    }
}
`,
    expect: [
      ["use", "keyword"], ["std", "namespace"], ["const", "keyword"], ["MAX_GLYPHS", "variable"], ["usize", "type"],
      ["4_096", "number"], ["A field of glyphs", "comment"], ["derive", "decorator"], ["pub", "keyword"], ["struct", "keyword"],
      ["Field", "type"], ["'a", "decorator"], ["f32", "type"], ["str }", "type"], ["impl", "keyword"], ["fn", "keyword"],
      ["render", "function"], ["mut", "keyword"], ["self", "builtin"], ["bool", "type"], ["Option", "type"],
      ["if", "keyword"], ["return", "keyword"], ["let", "keyword"], ["as", "keyword"], ["println!", "decorator"],
      ["glyph-", "string"], ["\\n", "escape"], ["MAX_GLYPHS#2", "variable"],
    ],
  },
  {
    lang: "go",
    code: `package glyph

import "fmt"

const MaxGlyphs = 4096

type Field struct {
	Radius float64
}

// Render draws the field.
func (f *Field) Render(paused bool) error {
	if paused {
		return nil
	}
	fmt.Println("glyph", f.Radius, true)
	return nil
}
`,
    expect: [
      ["package", "keyword"], ["import", "keyword"], ['"fmt"', "string"], ["const", "keyword"], ["MaxGlyphs", "variable"],
      ["4096", "number"],
      ["type", "keyword"], ["Field", "type"], ["struct", "keyword"], ["float64", "type"], ["Render draws", "comment"],
      ["func", "keyword"], ["Render#2", "function"], ["bool", "type"], ["error", "type"], ["if", "keyword"],
      ["return", "keyword"], ["nil", "constant"], ["Println", "function"], ["true", "constant"],
    ],
  },
  {
    lang: "lua",
    code: `local M = {}
-- Ease every glyph toward the pointer
M.radius = 0.35
function M.render(field, paused)
  if not field.gpu or paused then return nil end
  for i = 1, #field.cells do print(("glyph-%d\\n"):format(i), true) end
  return self
end
return M
`,
    expect: [
      ["local", "keyword"], ["Ease every glyph", "comment"], ["0.35", "number"], ["function", "keyword"],
      ["render", "function"], ["field", "parameter"], ["paused", "parameter"], ["if", "keyword"], ["not", "keyword"],
      ["or", "keyword"], ["then", "keyword"], ["return", "keyword"], ["nil", "constant"], ["end#2", "keyword"],
      ["for", "keyword"], ["1,", "number"], ["print", "function"], ["glyph-", "string"], ["\\n", "escape"],
      ["true", "constant"], ["self", "builtin"],
    ],
  },
  {
    lang: "css",
    code: `.field > #glyph:hover::before { color: #00a692; margin: 0 4px !important; }
body { font-family: "JetBrains Mono", monospace; }
`,
    expect: [
      ["field >", "type"], ["glyph:", "type"], ["hover", "decorator"], ["before", "decorator"], ["color", "property"],
      ["0 ", "number"], ["!important", "keyword"], ["body", "tag"], ["font-family", "property"], ["JetBrains Mono", "string"],
    ],
  },
  {
    lang: "html",
    code: `<a href="https://living-code.dev" class="cta">Ports &amp; install</a>\n`,
    expect: [["a ", "tag"], ["href", "attribute"], ["https://living-code.dev", "string"], ["amp", "escape"], ["<", "punctuation"]],
  },
  {
    lang: "json",
    code: `{ "name": "living-code", "flavors": 4, "light": false, "accent": null }\n`,
    expect: [['"name"', "property"], ['"living-code"', "string"], ["4", "number"], ["false", "constant"], ["null", "constant"]],
  },
  {
    lang: "yaml",
    code: `name: living-code # the theme\nflavors: 4\nlight: false\ntags: [neovim, "vscode"]\n`,
    expect: [["name", "property"], ["living-code", "string"], ["the theme", "comment"], ["4", "number"], ["false", "constant"], ['"vscode"', "string"]],
  },
  {
    lang: "toml",
    code: `name = "Living Code"\nlight = false\nsize = 14 # points\n`,
    expect: [["name", "property"], ["Living Code", "string"], ["false", "constant"], ["14", "number"], ["points", "comment"]],
  },
  {
    lang: "markdown",
    code: "# Living Code\n\nSome text with `code` and a [link](https://x.dev).\n\n- item\n\n> quote\n",
    expect: [["Living Code", "heading"], ["code", "code"], ["link", "link"], ["https://x.dev", "link"], ["-", "accent"], ["quote", "quote"]],
  },
  {
    lang: "shellscript",
    code: `# pick one\nexport FLAVOR="night"\nfor f in "$HOME"/*.conf; do echo "\${f%.conf}"; done\n`,
    expect: [["pick one", "comment"], ["export", "keyword"], ["night", "string"], ["for", "keyword"], ["in", "keyword"], ["do", "keyword"], ["echo", "function"], ["done", "keyword"]],
  },
  {
    lang: "c",
    code: `#include <stdio.h>
#define MAX_GLYPHS 4096
typedef struct { float radius; } Field;
static int render(const Field *field, int paused) {
  if (paused) return 0;
  printf("glyph-%d\\n", MAX_GLYPHS);
  return 1;
}
`,
    expect: [
      ["<stdio.h>", "string"], ["define", "decorator"], ["typedef", "keyword"], ["struct", "keyword"], ["float", "type"],
      ["static", "keyword"], ["int", "type"], ["render", "function"], ["const", "keyword"], ["field", "parameter"],
      ["if", "keyword"], ["return", "keyword"], ["0;", "number"], ["printf", "function"], ["%d", "escape"], ["\\n", "escape"],
    ],
  },
];

export { SAMPLES };
