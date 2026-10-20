<!-- living-code-readme:1 -->
# 🪵 Living Code for Hunk

**Calm slate. Living color.** Living Code for Hunk. Repository-owned theme files, installation instructions and four color flavors.

[Installation](#installation) · [Flavors](#flavors) · [Configuration](#configuration) · [All ports](https://github.com/living-code-theme)

## Previews

<table data-lc-flavors>
<tr>
<td width="50%" valign="top">
<strong>Night</strong><br><sub>Dark · full palette</sub><br><br>
<a href="images/night.png"><img src="images/night.png" alt="Hunk running Living Code Night" width="640"></a>
</td>
<td width="50%" valign="top">
<strong>Frost</strong><br><sub>Dark · softer chroma</sub><br><br>
<a href="images/frost.png"><img src="images/frost.png" alt="Hunk running Living Code Frost" width="640"></a>
</td>
</tr>
<tr>
<td width="50%" valign="top">
<strong>Paper</strong><br><sub>Light · near-white slate</sub><br><br>
<a href="images/paper.png"><img src="images/paper.png" alt="Hunk running Living Code Paper" width="640"></a>
</td>
<td width="50%" valign="top">
<strong>Signal</strong><br><sub>Dark · teal accent</sub><br><br>
<a href="images/signal.png"><img src="images/signal.png" alt="Hunk running Living Code Signal" width="640"></a>
</td>
</tr>
</table>

Select any preview to view the image at full size.

## Installation

**Extension (all flavors):** download the generated extension:

```sh
curl -fsSL --create-dirs -o "$HOME/.config/hunk/extensions/living-code.mjs" "https://raw.githubusercontent.com/living-code-theme/hunk/main/living-code.mjs"
```

Set the top-level `theme` in `~/.config/hunk/config.toml` (before any TOML tables):

```toml
theme = "living-code-night"
```

To try it first, run `hunk diff --extension ~/.config/hunk/extensions/living-code.mjs --theme living-code-night`.

**Config only:** instead of the extension, merge a flavor's `.toml` file into `~/.config/hunk/config.toml` (or a repo's `.hunk/config.toml`) and set the top-level `theme` as above. Do not add duplicate theme tables. Config themes take precedence over extension themes with the same name.

Available themes: `living-code-night`, `living-code-signal`, `living-code-frost`, `living-code-paper`. Syntax colors share the editor ports' scope map.

## Flavors

Expand a flavor for its full-size preview and activation instructions.

<details data-lc-flavor="night">
<summary><strong>Night</strong> · Dark · full palette</summary>

<p><a href="images/night.png"><img src="images/night.png" alt="Hunk running Living Code Night" width="1280"></a></p>

Set the top-level theme before any TOML tables:

```toml
theme = "living-code-night"
```

</details>

<details data-lc-flavor="frost">
<summary><strong>Frost</strong> · Dark · softer chroma</summary>

<p><a href="images/frost.png"><img src="images/frost.png" alt="Hunk running Living Code Frost" width="1280"></a></p>

Set the top-level theme before any TOML tables:

```toml
theme = "living-code-frost"
```

</details>

<details data-lc-flavor="paper">
<summary><strong>Paper</strong> · Light · near-white slate</summary>

<p><a href="images/paper.png"><img src="images/paper.png" alt="Hunk running Living Code Paper" width="1280"></a></p>

Set the top-level theme before any TOML tables:

```toml
theme = "living-code-paper"
```

</details>

<details data-lc-flavor="signal">
<summary><strong>Signal</strong> · Dark · teal accent</summary>

<p><a href="images/signal.png"><img src="images/signal.png" alt="Hunk running Living Code Signal" width="1280"></a></p>

Set the top-level theme before any TOML tables:

```toml
theme = "living-code-signal"
```

</details>

## Configuration

See [Hunk's documentation](https://github.com/modem-dev/hunk) for application settings and reload behavior. The activation instructions above identify each supported flavor; keep your other application configuration.

## Compatibility

This port supplies theme files for Hunk, not the application itself. Install the application separately and follow the installation instructions for its supported configuration format.

## Contributing

Found a problem? [Open an issue](https://github.com/living-code-theme/hunk/issues/new/choose) with the app version, the flavor and a screenshot. Want Living Code somewhere else? [Request a port](https://github.com/living-code-theme/core/issues/new?template=port-request.yml).

Pull requests are welcome. Keep this README, `port.json` and `images/` in sync, and use real screenshots of the app, never mockups.

🦎 **One chameleon, many habitats.** Part of [Living Code](https://github.com/living-code-theme).

## License

[MIT](LICENSE) © Elliot Luque
