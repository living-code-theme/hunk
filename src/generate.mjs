// This port owns its application mappings. Inputs come only from the pinned local palette.


const toml = (v) => JSON.stringify(v);

const atLeast = (a, b) => {
  for (let k = 0; k < a.length; k++) if (a[k] !== b[k]) return a[k] > b[k];
  return true;
};

const prefixOf = (sel, scope) => scope === sel || scope.startsWith(`${sel}.`);

function matchSelector(selector, stack) {
  const parts = selector.trim().split(/\s+/);
  let at = stack.length - 1;
  const last = parts.at(-1);
  while (at >= 0 && !prefixOf(last, stack[at])) at--;
  if (at < 0) return null;
  let i = at - 1;
  for (const part of parts.slice(0, -1).reverse()) {
    while (i >= 0 && !prefixOf(part, stack[i])) i--;
    if (i < 0) return null;
    i--;
  }
  return [at, last.split(".").length, parts.length];
}

function resolveScopes(rules, stack) {
  let best = null, bestScore = null;
  for (const rule of rules) {
    const selectors = Array.isArray(rule.scope) ? rule.scope : String(rule.scope ?? "").split(",");
    for (const sel of selectors) {
      const score = sel.trim() && matchSelector(sel, stack);
      if (score && (!bestScore || atLeast(score, bestScore))) [best, bestScore] = [rule, score];
    }
  }
  return best?.settings ?? {};
}

const HUNK_BASE_SELECTORS = ["brackethighlighter.angle", "brackethighlighter.curly", "brackethighlighter.quote",
  "brackethighlighter.round", "brackethighlighter.square", "brackethighlighter.tag", "brackethighlighter.unmatched",
  "carriage-return", "comment", "constant", "constant.character", "constant.other.placeholder",
  "constant.other.reference.link", "entity", "entity.name", "entity.name.constant", "entity.name.function",
  "entity.name.tag", "invalid.broken", "invalid.deprecated", "invalid.illegal", "invalid.unimplemented", "keyword",
  "markup.bold", "markup.changed", "markup.deleted", "markup.heading", "markup.heading entity.name", "markup.ignored",
  "markup.inline.raw", "markup.inserted", "markup.italic", "markup.quote", "markup.strikethrough", "markup.underline",
  "markup.untracked", "message.error", "meta.block", "meta.definition.variable", "meta.diff.header",
  "meta.diff.header.from-file", "meta.diff.header.to-file", "meta.diff.range", "meta.embedded.expression",
  "meta.export.default", "meta.jsx.children", "meta.module-reference", "meta.object.member", "meta.output",
  "meta.property-name", "meta.separator", "meta.tag.attributes", "punctuation.definition.changed",
  "punctuation.definition.comment", "punctuation.definition.deleted", "punctuation.definition.inserted",
  "punctuation.definition.list.begin.markdown", "punctuation.section.embedded", "source.regexp", "storage",
  "storage.modifier.import", "storage.modifier.package", "storage.type", "storage.type.java", "string",
  "string punctuation.section.embedded source", "string variable", "string.comment", "string.other.link",
  "string.regexp", "string.regexp constant.character.escape", "string.regexp source.ruby.embedded",
  "string.regexp string.regexp.arbitrary-repitition", "string.regexp.character-class", "support",
  "support.class.component", "support.constant", "support.type.property-name.json", "support.variable", "variable",
  "variable.language", "variable.other", "variable.other.constant", "variable.other.enummember",
  "variable.parameter.function"];

const SCOPES = [
  { role: "comment", scope: ["comment", "punctuation.definition.comment", "string.quoted.docstring"] },
  { role: "keyword", scope: ["keyword", "storage.type", "storage.modifier", "keyword.control", "keyword.operator.new", "keyword.operator.expression", "keyword.operator.logical.python", "keyword.operator.logical.lua", "keyword.operator.wordlike", "keyword.operator.word", "keyword.other", "punctuation.definition.template-expression", "punctuation.section.embedded", "punctuation.definition.keyword", "punctuation.section.interpolation"] },
  { role: "operator", scope: ["keyword.operator", "storage.type.function.arrow"] },
  { role: "punctuation", scope: ["punctuation", "meta.brace", "punctuation.definition.tag", "punctuation.separator", "punctuation.terminator", "punctuation.accessor"] },
  { role: "string", scope: ["string", "punctuation.definition.string", "string.template"] },
  { role: "escape", scope: ["constant.character.escape", "constant.other.placeholder", "constant.character.format", "constant.character.entity"] },
  { role: "regex", scope: ["string.regexp"] },
  { role: "number", scope: ["constant.numeric", "keyword.other.unit"] },
  // Constant values only (true, null, built-in constants, colors). The names that hold constants are names: RADIUS
  // (variable.other.constant, constant.other.caps, Sublime's entity.name.constant) takes the variable color and enum
  // members the property color, as JetBrains draws them; see the variable and property entries below.
  { role: "constant", scope: ["constant.language", "constant.other", "support.constant", "constant.other.color"] },
  { role: "function", scope: ["entity.name.function", "support.function", "meta.function-call.generic", "variable.function", "entity.name.function.member"] },
  { role: "type", scope: ["entity.name.type", "entity.name.class", "support.type", "support.class", "entity.other.inherited-class", "storage.type.primitive", "storage.type.built-in", "storage.type.numeric.go", "storage.type.boolean.go", "storage.type.string.go", "storage.type.byte.go", "storage.type.rune.go", "storage.type.error.go", "storage.type.uintptr.go", "support.class.component", "entity.other.attribute-name.class.css", "entity.other.attribute-name.id.css", "entity.name.struct", "entity.name.enum", "entity.name.union", "entity.name.trait", "entity.name.interface", "entity.name.impl"] },
  { role: "namespace", scope: ["entity.name.namespace", "entity.name.type.module", "entity.name.scope-resolution", "support.module"] },
  { role: "decorator", scope: ["meta.decorator", "entity.name.function.decorator", "punctuation.decorator", "punctuation.definition.decorator", "meta.decorator variable", "meta.decorator variable.other", "meta.decorator variable.other.readwrite", "meta.decorator entity.name.function", "storage.type.annotation", "meta.attribute.rust", "entity.name.function.macro", "entity.name.function.preprocessor", "meta.preprocessor", "keyword.control.directive", "entity.name.type.lifetime", "punctuation.definition.lifetime", "meta.annotation", "variable.annotation", "punctuation.definition.annotation", "entity.name.label", "entity.other.attribute-name.pseudo-class", "entity.other.attribute-name.pseudo-element"] },
  // Includes are imports (Neovim's @keyword.import), unlike the other preprocessor directives.
  { role: "keyword", scope: ["keyword.control.directive.include", "keyword.control.directive.import", "keyword.control.import"] },
  { role: "tag", scope: ["entity.name.tag"] },
  { role: "attribute", scope: ["entity.other.attribute-name"] },
  { role: "property", scope: ["variable.other.enummember", "variable.other.constant.property", "variable.other.property", "variable.other.object.property", "variable.object.property", "support.variable.property", "meta.object-literal.key", "support.type.property-name", "punctuation.support.type.property-name", "entity.name.tag.yaml", "entity.name.tag.toml", "variable.other.key.toml", "support.type.property-name.json", "meta.attribute.python"] },
  { role: "parameter", scope: ["variable.parameter", "meta.parameter variable"] },
  { role: "builtin", scope: ["variable.language", "support.variable", "variable.language.this", "variable.language.self", "variable.language.super", "variable.parameter.function.language.special"] },
  { role: "variable", scope: ["variable", "meta.definition.variable", "variable.other.readwrite", "variable.other.constant", "constant.other.caps", "entity.name.constant"] },
  { role: "heading", scope: ["markup.heading", "entity.name.section", "markup.heading punctuation.definition.heading"] },
  { role: null, scope: ["markup.bold"], fontStyle: "bold" },
  { role: null, scope: ["markup.italic"], fontStyle: "italic" },
  { role: null, scope: ["markup.strikethrough"], fontStyle: "strikethrough" },
  { role: null, scope: ["markup.underline"], fontStyle: "underline" },
  { role: "link", scope: ["markup.underline.link", "string.other.link", "markup.link"] },
  { role: "code", scope: ["markup.inline.raw", "markup.fenced_code", "markup.raw"] },
  { role: "quote", scope: ["markup.quote"] },
  { role: "accent", scope: ["punctuation.definition.list", "markup.list punctuation.definition"] },
  { role: "added", scope: ["markup.inserted", "meta.diff.header.to-file", "punctuation.definition.inserted"] },
  { role: "removed", scope: ["markup.deleted", "meta.diff.header.from-file", "punctuation.definition.deleted"] },
  { role: "modified", scope: ["markup.changed", "punctuation.definition.changed"] },
  { role: "fgSubtle", scope: ["meta.diff.range", "meta.diff.index", "meta.separator"] },
  { role: "error", scope: ["invalid", "invalid.illegal"] },
  { role: "warning", scope: ["invalid.deprecated"] },
];

const scopeRules = (f) =>
  SCOPES.map(({ role, scope, fontStyle }) => {
    const settings = {};
    if (role) settings.foreground = f.r(role);
    const style = fontStyle ?? (role && f.styles[role]);
    if (style) settings.fontStyle = style;
    return { scope, settings };
  });

const EMPH = 0.26;

const ROW = 0.12;

function hunkTheme(f) {
  const r = f.r, c = f.c;
  const tint = (role, t) => f.mix("bg", role, t);
  const colors = {
    label: f.name,
    base: f.light ? "github-light-default" : "github-dark-default",
    background: r("bg"),
    panel: r("bgAlt"),
    panelAlt: r("lineHighlight"),
    border: r("border"),
    accent: r("accent"),
    accentMuted: tint("accent", f.light ? 0.2 : 0.3),
    text: r("fg"),
    muted: r("fgMuted"),
    contextBg: r("bg"),
    contextContentBg: r("bg"),
    addedBg: tint("added", ROW),
    removedBg: tint("removed", ROW),
    addedContentBg: tint("added", EMPH),
    removedContentBg: tint("removed", EMPH),
    movedAddedBg: tint("info", ROW),
    movedRemovedBg: tint("warning", ROW),
    addedSignColor: r("added"),
    removedSignColor: r("removed"),
    lineNumberBg: r("bg"),
    lineNumberFg: r("lineNumber"),
    selectedHunk: r("lineHighlight"),
    badgeAdded: r("added"),
    badgeRemoved: r("removed"),
    badgeNeutral: r("fgMuted"),
    fileNew: r("added"),
    fileDeleted: r("removed"),
    fileRenamed: r("info"),
    fileModified: r("modified"),
    fileUntracked: r("fgSubtle"),
    noteBorder: c("orchid"),
    noteBackground: r("bgAlt"),
    noteTitleBackground: r("border"),
    noteTitleText: r("fg"),
  };
  // Hunk layers these over its base theme, and "a more-specific base-theme selector beats a broader override". So
  // every selector the base theme colors is overridden too, with the color our own rules give it, and source/text
  // replace the base theme's default foreground: nothing of the base theme's palette can show through.
  const ours = scopeRules(f).filter((rule) => rule.settings.foreground);
  const syntaxScopes = {
    source: r("fg"),
    text: r("fg"),
    ...Object.fromEntries(HUNK_BASE_SELECTORS.map((sel) => [sel, resolveScopes(ours, sel.split(/\s+/)).foreground ?? r("fg")])),
    ...Object.fromEntries(SCOPES.filter((s) => s.role).flatMap(({ role, scope }) => scope.map((sc) => [sc, r(role)]))),
  };
  return { id: f.slug, ...colors, syntaxScopes };
}

const hunk = {
files: (f) => {
    const { id, syntaxScopes, ...colors } = hunkTheme(f);
    return [{
      path: `${f.slug}.toml`,
      content: `[themes.${id}]
${Object.entries(colors).map(([k, v]) => `${k} = ${toml(v)}`).join("\n")}

[themes.${id}.syntax_scopes]
${Object.entries(syntaxScopes).map(([k, v]) => `${toml(k)} = ${toml(v)}`).join("\n")}
`,
    }];
  },
all: (fs) => [{
    path: "living-code.mjs",
    content: `// Living Code for Hunk. Maintained in this repository.
// Registers every flavor as a selectable theme.
const themes = ${JSON.stringify(fs.map(hunkTheme), null, 2)};

export default function livingCode(hunk) {
  for (const theme of themes) hunk.registerTheme(theme);
}
`,
  }]
};

export function generate(flavors) {
  return [...flavors.flatMap(f => hunk.files(f)), ...(hunk.all?.(flavors) ?? [])].filter(f => !["LICENSE", "README.md", "package.json", "extension.toml"].includes(f.path.split("/").at(-1)));
}
