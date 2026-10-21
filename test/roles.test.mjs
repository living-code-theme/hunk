// Port-owned role-contract tests, exercising generated files and real grammars.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import test from 'node:test';
import {resolveAll} from '../scripts/palette.mjs';
import {generate} from '../src/generate.mjs';
import {bundledThemes,createHighlighter} from 'shiki';
import {SAMPLES} from './contract.mjs';

const flavors = resolveAll();

const hunkTheme = f => JSON.parse(generate([f]).find(x=>x.path==="living-code.mjs").content.split("const themes = ")[1].split(";\n\nexport")[0])[0];

const TEXTMATE_PORTS = {hunk: async (f) => {
    const t = hunkTheme(f);
    const base = (await bundledThemes[t.base]()).default;
    return {
      colors: { ...base.colors, "editor.background": t.background },
      tokenColors: [...base.tokenColors, ...Object.entries(t.syntaxScopes).map(([scope, foreground]) => ({ scope, settings: { foreground } }))],
    };
  }};

const at = (code, needle) => {
  const [text, nth = "1"] = needle.split(/#(?=\d+$)/);
  let i = -1;
  for (let n = 0; n < Number(nth); n++) {
    i = code.indexOf(text, i + 1);
    if (i < 0) throw new Error(`"${text}" occurs fewer than ${nth} times in the sample`);
  }
  return i;
};

const norm = (hex) => hex?.toLowerCase().slice(0, 7);

const EDITOR_UI = {hunk: (f) => { const t = hunkTheme(f); return { bg: t.background, fg: t.text, lineNumber: t.lineNumberFg }; }};

test("TextMate ports give every sample token its role (VS Code, Expressive Code, tmTheme, Sublime Text, Hunk)", async () => {
  const themes = [];
  for (const f of flavors) for (const [port, load] of Object.entries(TEXTMATE_PORTS)) {
    themes.push({ ...(await load(f)), name: `${port}:${f.id}`, type: f.light ? "light" : "dark", port, f });
  }
  const hl = await createHighlighter({ themes, langs: [...new Set(SAMPLES.map((s) => s.lang))] });
  const failures = [];
  for (const { lang, code, expect } of SAMPLES) {
    for (const theme of themes) {
      const tokens = hl.codeToTokensBase(code, { lang, theme: theme.name }).flat();
      for (const [needle, role] of expect) {
        const offset = at(code, needle);
        const token = tokens.find((t) => t.offset <= offset && offset < t.offset + t.content.length);
        const got = norm(token?.color), want = norm(theme.f.r(role));
        if (got !== want) failures.push(`${theme.name} ${lang} ${JSON.stringify(needle)}: ${role} is ${want}, got ${got}`);
      }
    }
  }
  assert.deepEqual(failures, []);
});

test("Hunk overrides every selector its base themes color", async () => {
  const HUNK_BASE_SELECTORS = Object.keys(hunkTheme(flavors[0]).syntaxScopes);
  const listed = new Set(HUNK_BASE_SELECTORS);
  for (const name of ["github-dark-default", "github-light-default"]) {
    const { tokenColors } = (await bundledThemes[name]()).default;
    const selectors = tokenColors.flatMap((r) => [].concat(r.scope ?? []).flatMap((s) => s.split(","))).map((s) => s.trim()).filter(Boolean);
    assert.deepEqual(selectors.filter((s) => !listed.has(s)), [], `${name} colors selectors HUNK_BASE_SELECTORS lacks`);
  }
});

test("every editor draws its editing surface with the same roles", async () => {
  const failures = [];
  for (const f of flavors) {
    for (const [port, load] of Object.entries(EDITOR_UI)) {
      const got = await load(f);
      for (const [role, color] of Object.entries(got)) {
        if (norm(color) !== norm(f.r(role))) failures.push(`${port} ${f.id} ${role}: ${f.r(role)}, got ${color}`);
      }
    }
  }
  assert.deepEqual(failures, []);
});
