# Cosmo Mind Design System
*Version 1.0 - "Cinematic Sci-Fi"*

## 1. Core Philosophy
The **Cosmo Mind** aesthetic is built on the concept of a futuristic, deep-space HUD (Heads-Up Display). It prioritizes immersion, data density without clutter, and a "premium" technological feel.

*   **Keywords**: Cinematic, Ethereal, Precision, Glass, Neon.
*   **Vibe**: "Cockpit of a starship", "Advanced AI Interface".
*   **Interaction**: Fluid, responsive, with subtle glows indicating activity.

---

## 2. Design Tokens

### 2.1 Colors
The palette is strictly **Dark Mode**. We do not use pure black `#000000` for surfaces, but rather deep, translucent layers.

*   **Backgrounds**:
    *   `bg-black` (Base canvas)
    *   `bg-black/20`, `bg-black/40`, `bg-black/60` (Layered opacity for Glass panels)
*   **Accents (Neon)**:
    *   **Primary (Intelligence)**: Blue `blue-500` / `#3b82f6` (Glows, active states)
    *   **Secondary (Mystery)**: Purple `purple-500` / `#a855f7` (Headers, branding)
    *   **Success (Systems)**: Green `green-500` / `#22c55e` (Status, health)
    *   **Warning/Danger**: Red `red-500` / `#ef4444` (Delete, errors)
*   **Text**:
    *   `text-white` (Headings, 100% opacity)
    *   `text-white/80` (Body text)
    *   `text-white/40` (Labels, metadata - *crucial for hierarchy*)

### 2.2 Typography
We use **Inter** for its clean, technical readability.

*   **Headings**:
    *   Weight: `font-light` (300) or `font-extralight` (200) for large text.
    *   Tracking: `tracking-tight` (-0.025em).
*   **Body**:
    *   Weight: `font-light` (300) or `font-normal` (400).
    *   Leading: `leading-relaxed`.
*   **Micro-Labels (HUD Style)**:
    *   Size: `text-[10px]` or `text-xs`.
    *   Weight: `font-bold` (700).
    *   Case: `uppercase`.
    *   Tracking: `tracking-widest` (0.1em).
    *   *Usage*: Section headers, badges, button subtext.

### 2.3 Glassmorphism (The "Glass" Effect)
The UI relies heavily on the `GlassPanel` component.

*   **Blur**: `backdrop-blur-md` (12px) to `backdrop-blur-xl` (24px).
*   **Border**: `border border-white/5` or `border-white/10`. *Extremely subtle.*
*   **Corner Radius**: `rounded-xl` (Reduced from 2xl for a sharper, more technical look).
*   **Shadows**: Deep, soft shadows `shadow-2xl` to detach panels from the void.

---

## 3. UI Components

### 3.1 Cosmic Button
Buttons are not solid blocks but interactive elements of the HUD.

*   **Ghost (Default)**:
    *   `border border-white/20`.
    *   Hover: Glows `bg-white/10`, text brightens.
*   **Glow (Primary)**:
    *   `bg-blue-500/10`, `text-blue-400`.
    *   Border: `border-blue-500/50`.
    *   Shadow: `shadow-[0_0_15px_rgba(59,130,246,0.3)]`.
*   **Shape**: `rounded-md` (Standard) or `rounded-full` (Icons).

### 3.2 Navigation (Sidebar)
*   **Structure**: Fixed, thin left bar (`w-16`).
*   **Style**: Pure glass column.
*   **Icons**: `lucide-react` icons.
*   **Active State**: `bg-white/10 text-white shadow-glow`.

### 3.3 Cards (Content Registry)
*   **Aspect**: 16:9 Video-like thumbnails.
*   **Hover**:
    *   Thumbnail scales (`scale-105`).
    *   Overlay appears with `Play` button.
    *   Border glows `border-blue-500/30`.
*   **Text**: Clamped titles (2 lines), muted tags (`text-[10px]`).

---

## 4. Animation & Transitions
Animations are essential to make the interface feel "alive".

*   **Fade In**: All panels enter with a smooth `animate-fade-in` (opacity 0 -> 1, translate-y).
*   **Hover**: `transition-all duration-300`. Never instant.
*   **Focus**: Inputs glow `ring-1 ring-blue-500/50` gently.

## 5. Layout Patterns
*   **Grid System**: Responsive grids (`grid-cols-1` to `grid-cols-4`) for cards.
*   **Spacing**: Generous padding (`p-6`, `p-8`) inside glass panels to let content breathe.
*   **Z-Index**:
    *   Background Ambience: `z-0`.
    *   Main Content: `z-10`.
    *   Sidebar/Search: `z-50` / `z-[100]`.
    *   Overlays/Modals: `z-[150+]`.

---

*This document serves as the single source of truth for the Cosmo Mind visual identity.*
