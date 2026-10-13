# DevProcess Project Icon Generator Prompt

Use this document to instruct any AI coding agent or design tool to generate a standardized app icon for your project.

All projects registered in **DevProcess Manager** display their icon in Grid View when placed in the root directory.

---

## 📋 File & Format Requirements

- **File Name**: `icon.png` or `icon.svg` *(also supports `icon.webp`, `icon.jpg`, `icon.ico`)*
- **Location**: Put directly in the project's root folder *(alongside `package.json` or `requirements.txt`)*
- **Canvas Size**: 512 × 512 pixels
- **Aspect Ratio**: 1:1 Square canvas
- **Design Aesthetic**: Stock Android / Google Material You adaptive app icon style

---

## 🎨 Style Guidelines (Android / Material You)

1. **Squircle Silhouette**:
   - The icon body must be an Android-standard squircle with continuous curvature (approx. 22.5% corner radius or `rx="115" ry="115"` on a 512×512 canvas).
   - Centered with balanced padding around the glyph.

2. **Color Palette**:
   - Clean, vibrant, yet refined colors inspired by Google Material You / Android 14+ default apps (Gmail, Chrome, Files, Keep, Calendar).
   - Gentle two-stop linear gradient from top-left to bottom-right (e.g. from `#3B82F6` to `#1D4ED8`, or `#10B981` to `#047857`).
   - Inner highlight or soft ambient depth, but **no** extreme photorealism, heavy skeuomorphic reflections, or harsh drop shadows.

3. **Center Symbol / Glyph**:
   - Minimalist, bold, instantly recognizable vector symbol summarizing the application domain (e.g., shopping cart for e-commerce, brain/nodes for AI, bar chart for analytics, shield for auth/security).
   - Pure white (`#FFFFFF`) or off-white (`#F8FAFC`) with subtle opacity styling or tonal contrast.
   - High legibility even at tiny thumbnail sizes (16×16, 24×24, 48×48).
   - **No text, words, or cluttered fine details**.

---

## 🤖 Prompt for the Project Agent

Copy and paste the prompt below to the agent responsible for the target project:

```markdown
You are responsible for generating an official app icon for this project to be displayed in DevProcess Manager.

### Task:
Create an icon file named `icon.svg` (or `icon.png`) in the root directory of this project.

### Project Context:
- Project Name: [INSERT PROJECT NAME HERE]
- Project Purpose / Domain: [INSERT BRIEF DESCRIPTION, e.g., "FastAPI authentication service", "Next.js e-commerce storefront", "Real-time analytics dashboard"]

### Visual Style Rules (Stock Android / Material You App Style):
1. **Format**: Valid SVG file (or 512x512 PNG) saved as `icon.svg` (or `icon.png`) in the root directory.
2. **Shape**: Modern Android squircle container (512x512 canvas, squircle rectangle with width="440" height="440" x="36" y="36" rx="100" ry="100").
3. **Background**: Smooth two-tone Material gradient (top-left to bottom-right) using colors fitting the project's domain (e.g., Deep Blue for enterprise/tools, Emerald Green for finance/growth, Indigo/Violet for AI/creative, Amber/Orange for data/media).
4. **Center Glyph**: A clean, single, bold vector symbol in crisp white (#FFFFFF) representing the core functionality of the project.
5. **Simplicity**: No words, no small illegible lines, no noisy textures. It must look identical to a premium pre-installed Android system app icon.

Generate and write the icon file to the project root now.
```

---

## 💡 Quick SVG Starter Template

If generating an SVG directly, here is a battle-tested template that agents can adapt:

```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <!-- Background Gradient -->
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#3B82F6" />
      <stop offset="100%" stop-color="#1D4ED8" />
    </linearGradient>
    <!-- Soft Ambient Shadow -->
    <filter id="softShadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="12" stdDeviation="16" flood-color="#0F172A" flood-opacity="0.18" />
    </filter>
  </defs>

  <!-- Android Squircle Base -->
  <rect 
    x="36" 
    y="36" 
    width="440" 
    height="440" 
    rx="105" 
    ry="105" 
    fill="url(#bgGrad)" 
    filter="url(#softShadow)" 
  />

  <!-- Subtle Inner Specular Rim -->
  <rect 
    x="38" 
    y="38" 
    width="436" 
    height="436" 
    rx="103" 
    ry="103" 
    fill="none" 
    stroke="#FFFFFF" 
    stroke-opacity="0.18" 
    stroke-width="2" 
  />

  <!-- Center Minimalist Symbol (Replace Path with Project Glyph) -->
  <g fill="#FFFFFF" transform="translate(136, 136)">
    <!-- Example: Terminal / Code Bracket (240x240 view box) -->
    <path d="M40 70 L110 120 L40 170" fill="none" stroke="#FFFFFF" stroke-width="24" stroke-linecap="round" stroke-linejoin="round"/>
    <line x1="130" y1="170" x2="200" y2="170" stroke="#FFFFFF" stroke-width="24" stroke-linecap="round"/>
  </g>
</svg>
```
