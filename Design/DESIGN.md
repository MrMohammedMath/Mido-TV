---
name: Cinematic Precision
colors:
  surface: '#0b1326'
  surface-dim: '#0b1326'
  surface-bright: '#31394d'
  surface-container-lowest: '#060e20'
  surface-container-low: '#131b2e'
  surface-container: '#171f33'
  surface-container-high: '#222a3d'
  surface-container-highest: '#2d3449'
  on-surface: '#dae2fd'
  on-surface-variant: '#bbc9cd'
  inverse-surface: '#dae2fd'
  inverse-on-surface: '#283044'
  outline: '#859397'
  outline-variant: '#3c494c'
  surface-tint: '#2fd9f4'
  primary: '#8aebff'
  on-primary: '#00363e'
  primary-container: '#22d3ee'
  on-primary-container: '#005763'
  inverse-primary: '#006877'
  secondary: '#ffe083'
  on-secondary: '#3c2f00'
  secondary-container: '#eec200'
  on-secondary-container: '#645000'
  tertiary: '#ffd6a3'
  on-tertiary: '#462b00'
  tertiary-container: '#ffb13b'
  on-tertiary-container: '#6e4600'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#a2eeff'
  primary-fixed-dim: '#2fd9f4'
  on-primary-fixed: '#001f25'
  on-primary-fixed-variant: '#004e5a'
  secondary-fixed: '#ffe083'
  secondary-fixed-dim: '#eec200'
  on-secondary-fixed: '#231b00'
  on-secondary-fixed-variant: '#574500'
  tertiary-fixed: '#ffddb5'
  tertiary-fixed-dim: '#ffb957'
  on-tertiary-fixed: '#2a1800'
  on-tertiary-fixed-variant: '#643f00'
  background: '#0b1326'
  on-background: '#dae2fd'
  surface-variant: '#2d3449'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 72px
    fontWeight: '800'
    lineHeight: 80px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
  headline-md:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
  body-lg:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '400'
    lineHeight: 36px
  body-md:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '400'
    lineHeight: 30px
  label-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: 0.05em
  label-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.1em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  margin-edge: 5rem
  gutter-x: 2rem
  gutter-y: 3rem
  focus-outline: 4px
  stack-sm: 1rem
  stack-md: 2rem
---

## Brand & Style

The design system is engineered for the "10-foot UI" experience, prioritizing legibility, focus-state clarity, and cinematic immersion. The brand personality is professional, sleek, and high-performance, catering to media enthusiasts who value a clutter-free environment. 

The aesthetic blends **Modern Minimalism** with **Glassmorphism**. High-contrast navigational elements guide the eye from a distance, while subtle translucent layers provide depth without distracting from the content. The interface feels expansive, utilizing generous white space (negative space) to prevent visual fatigue during long viewing sessions. All interactions are designed to feel snappy and authoritative, mirroring the precision of high-end hardware.

## Colors

The palette is centered on a deep **Dark Slate (#0F172A)** base to maximize OLED black levels and reduce eye strain in dimmed rooms. 

- **Primary (Bright Cyan):** Reserved for active focus states, progress bars, and primary calls to action. It provides a cool, technical feel.
- **Secondary (Bold Yellow):** Used exclusively for navigational badges, alerts, or "New" content markers to provide high-chroma contrast against the cool background.
- **Surface Tones:** Medium slate tones are used for container backgrounds to create a subtle hierarchy of information.
- **Text:** Pure white or off-white is used for all metadata to ensure maximum readability against dark backdrops.

## Typography

This design system utilizes **Inter** for its exceptional legibility and modern, systematic feel. Because the UI is viewed from a distance, the scale starts much higher than mobile or desktop standards.

- **Headlines:** Use Bold or Extra Bold weights to create a strong visual anchor for content sections.
- **Body:** Regular weights are used for descriptions; line height is increased to 1.5x to ensure characters don't blur together at low resolutions.
- **Labels:** All-caps styling is applied to navigational labels and helper bars to distinguish them from content metadata.
- **Mobile Scaling:** As this is a TV-first system, these sizes remain static. For "companion apps," reduce all sizes by 40% and shift to a standard 4px baseline.

## Layout & Spacing

The layout follows a **Fixed Grid** model optimized for 16:9 aspect ratios. 

- **Safe Zones:** A strict 80px (5rem) margin is maintained on all sides to account for overscan on older television panels.
- **Horizontal Strips:** Content is organized in horizontal scrolling rows. Each row has a 48px vertical gap.
- **Focus Growth:** Elements in focus should scale by 1.1x. The spacing system must account for this "growth" to prevent overlapping with neighboring elements.
- **Helper Bar:** A persistent 64px bar sits at the bottom of the viewport, containing remote control legends (e.g., [A] Select, [B] Back).

## Elevation & Depth

Hierarchy is established through **Tonal Layers** and **Backdrop Blurs**:

- **Level 0 (Base):** The #0F172A canvas.
- **Level 1 (Surfaces):** Cards and sidebars use #1E293B with a subtle 1px border (#334155).
- **Level 2 (Overlays):** Modals and context menus use a semi-transparent slate with a 20px background blur to maintain context of the underlying media.
- **Focus State:** Instead of traditional drop shadows, focused elements utilize a 4px "Glow" border of the Primary Cyan color and a slight increase in brightness.

## Shapes

The shape language is **Rounded**, balancing a friendly consumer feel with professional structural integrity.

- **Media Cards:** Use `rounded-lg` (1rem) to soften the large 16:9 blocks.
- **Remote Indices/Badges:** Use `rounded` (0.5rem) to create a "keycap" look, making them feel tactile.
- **Selection Glow:** The focus ring follows the corner radius of the parent element exactly, maintained at a 4px offset.

## Components

### Media Cards
16:9 aspect ratio containers. They feature a bottom-up linear gradient (Transparent to Black @ 70% opacity) to ensure title legibility. In focus, the card scales up and the border changes to Primary Cyan.

### Remote Indices (Badges)
Small, rounded square boxes with a secondary yellow background and dark slate text. Used to indicate numeric shortcuts or remote button prompts.

### Horizontal Helper Bar
A full-width, low-profile bar at the screen's bottom. Icons represent physical remote buttons, paired with `label-sm` text. It uses a slight glassmorphic blur to sit above the content.

### Input Fields
TV-optimized inputs are large, full-width bars. When active, they trigger a grid-based on-screen keyboard. The cursor/focus within the keyboard must be the Primary Cyan color.

### Progress Bars
Thin 8px tracks. The "unfilled" portion is #334155, and the "filled" portion is Primary Cyan. For live TV, the secondary yellow color is used to indicate the "live" head.