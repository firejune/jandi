# 🌱 Jandi

**Jandi** (잔디, Korean for *grass/lawn*) lets you embed a responsive GitHub contribution calendar into **Notion**, **personal portfolios**, or any web document via a simple URL.

![glory](https://i.imgur.com/aU95o4N.png)

---

## Quick Start (Notion Embed)

1. Type `/embed` in your Notion document to create an **Embed** block.
2. Enter the URL below, replacing `%USERNAME%` with your GitHub username:
   ```text
   https://jandi.firejune.io/%USERNAME%
   ```
3. Resize the embed block to fit your layout.

---

## Parameters Reference

All query parameters are optional and can be combined freely.

| Parameter | Default        | Description                                                                                                  |
| :-------- | :------------- | :----------------------------------------------------------------------------------------------------------- |
| `scheme`    | `auto`         | Force color mode: `light` or `dark`. When omitted, follows system `prefers-color-scheme`.                    |
| `dark`      | `#191919`      | Dark mode background color, or `bg,text` (comma-separated) to also customize the text color.                 |
| `white`     | `#fff`         | Light mode background color, or `bg,text` (comma-separated) to also customize the text color.                |
| `halloween` | `auto (10/31)` | Enable GitHub's Halloween color palette (`true` or `false`). Automatically enabled on October 31st.          |
| `tz`        | `Asia/Seoul`   | IANA Time Zone identifier (e.g. `UTC`, `America/New_York`, `Europe/London`).                                 |
| `radius`    | `2`            | Border radius (`rx`/`ry`) of each contribution day cell in pixels.                                           |
| `margin`    | `3`            | Gap between contribution day cells in pixels.                                                                |
| `weeks`     | `true`         | Show weekday labels (`Mon`, `Wed`, `Fri`) on the left. Pass `false`, `0`, `hide`, or `none` to hide.         |
| `footer`    | `true`         | Show total contribution count and `Less / More` legend at the bottom. Pass `false`, `0`, or `hide` to hide. |

---

## Examples

### 1. Color Mode & Custom Palette (`scheme`, `dark`, `white`)

Force dark or light mode explicitly:

```text
https://jandi.firejune.io/%USERNAME%?scheme=dark
https://jandi.firejune.io/%USERNAME%?scheme=light
```

Customize the background colors for dark and light modes (hex codes can be passed without `#`):

```text
https://jandi.firejune.io/%USERNAME%?dark=2f3437&white=f7f6f3
```

Customize both **background color** and **text color** by separating two colors with a comma (`bg,text`):

```text
https://jandi.firejune.io/%USERNAME%?dark=000000,ffffff&white=ffffff,000000
https://jandi.firejune.io/%USERNAME%?dark=transparent,9ca3af&white=transparent,4b5563
```

Enable or disable the seasonal **Halloween** theme (`halloween=true` or `halloween=false`, automatically active on October 31st):

```text
https://jandi.firejune.io/%USERNAME%?halloween=true
```

### 2. Time Zone (`tz`)

Set a specific IANA time zone (defaults to `Asia/Seoul`):

```text
https://jandi.firejune.io/%USERNAME%?tz=America/New_York
```

### 3. Graph Layout (`radius`, `margin`, `weeks`, `footer`)

Adjust cell rounding, spacing, or hide the weekday labels and footer:

```text
https://jandi.firejune.io/%USERNAME%?radius=3&margin=2&footer=false&weeks=false
```

### 4. Canvas / PNG Mode (`/canvas`)

Render the contribution calendar onto an HTML `<canvas>` converted to a transparent PNG with clickable `<map>` areas:

```text
https://jandi.firejune.io/%USERNAME%/canvas
```

---

## Credits

- Inspired by [@bizarre](https://github.com/bizarre)'s [notion-github-embed](https://github.com/bizarre/notion-github-embed)
- Powered by patterns from [@sallar](https://github.com/sallar)'s [github-contributions-chart](https://github.com/sallar/github-contributions-chart) and [github-contributions-canvas](https://github.com/sallar/github-contributions-canvas)
