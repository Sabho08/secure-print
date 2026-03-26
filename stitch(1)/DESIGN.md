# Design System Document

## 1. Overview & Creative North Star: "The Secure Sanctuary"

This design system is engineered to redefine the utility of a secure printing terminal. Rather than the cold, mechanical aesthetic typical of hardware interfaces, we are building **"The Secure Sanctuary."** This North Star guides us toward a UI that feels safe, lightweight, and editorially precise.

We break the standard "industrial" template by using **intentional asymmetry** and **tonal layering**. Large, high-contrast typography commands the screen, while interface elements float within a series of nested, monochromatic containers. The goal is a digital experience that feels as premium and tactile as high-end stationery, punctuated by the vibrant authority of deep blue accents.

---

## 2. Colors

The palette is rooted in a monochromatic scale that emphasizes clarity and security, with purposeful color injections for action and state.

### Core Palette
- **Primary (`#0b55cf`)**: Used for the most critical actions—printing, signing in, and confirming. It represents the "vibrant blue" of the secure terminal.
- **Surface (`#f8f9fa`)**: Our canvas. A soft, off-white that prevents screen fatigue.
- **On-Surface (`#191c1d`)**: Deep black for high-contrast typography and the monochromatic logo identity.

### The "No-Line" Rule
To achieve a high-end editorial feel, **1px solid borders are strictly prohibited** for sectioning. We define space through background color shifts.
- To separate a header from a body, transition from `surface` to `surface-container-low`.
- For sidebars, use `surface-container` against a `surface` background.

### Surface Hierarchy & Nesting
Treat the UI as a physical stack of paper. Use the following hierarchy to define importance:
1. **Base Layer:** `surface` (#f8f9fa)
2. **Section Layer:** `surface-container-low` (#f3f4f5)
3. **Interactive Layer (Cards/Inputs):** `surface-container-lowest` (#ffffff)
4. **Elevated Elements:** `surface-bright` (#f8f9fa)

### The "Glass & Gradient" Rule
For floating modals or status indicators, utilize **Glassmorphism**. Apply a backdrop-blur (12px-20px) to `surface-container-lowest` at 80% opacity. For primary CTAs, use a subtle linear gradient from `primary` (#0b55cf) to `primary_container` (#3870ea) to add depth and "soul" to the button.

---

## 3. Typography

We utilize **Inter** to bridge the gap between technical precision and modern readability. The scale is extreme—ranging from massive display type to micro-labels—to create an editorial rhythm.

*   **Display (Large/Medium):** Used for welcome screens and "Action Success" states. Bold weights with tight letter-spacing.
*   **Headline (Small/Medium):** Used for section titles. These should feel authoritative and provide immediate context.
*   **Body (Medium):** The workhorse for instructions. Set with generous line-height (1.5) to ensure readability at terminal distances.
*   **Label (Medium/Small):** Monochromatic and uppercase where necessary to denote metadata or secure status.

The hierarchy communicates trust: Large headlines say "You are in control," while refined labels say "The details are handled."

---

## 4. Elevation & Depth

In this system, depth is a function of light and layering, not lines.

- **Tonal Layering:** Avoid shadows for static content. Place a `surface-container-lowest` card on a `surface-container-low` background to create a "lift" that feels organic to the material.
- **Ambient Shadows:** For floating elements like the main login shield or action sheets, use extra-diffused shadows.
    *   *Spec:* `0px 10px 40px rgba(25, 28, 29, 0.06)`
    *   The shadow must be a tinted version of the `on-surface` color to mimic natural light.
- **The "Ghost Border" Fallback:** If a boundary is required for accessibility in input fields, use `outline-variant` (#c1c6d6) at **15% opacity**. Never use 100% opaque outlines.
- **Glassmorphism:** Use semi-transparent layers for elements that sit "above" the workflow, allowing the brand colors to bleed through and soften the interface.

---

## 5. Components

### Buttons
- **Primary:** Gradient fill (`primary` to `primary_container`), `on_primary` text. `xl` (1.5rem) roundedness for a modern, friendly touch.
- **Secondary:** `secondary_container` fill with `on_secondary_container` text.
- **Tertiary:** No fill. `primary` text. Use for low-priority actions like "Cancel" or "View Details."

### Input Fields
- **Container:** `surface_container_lowest` (#ffffff) with a soft `md` (0.75rem) corner radius.
- **State:** On focus, the "Ghost Border" increases to 40% opacity in `primary` blue.
- **Icons:** Always use the monochromatic black for icons to maintain the "Secure Sanctuary" aesthetic.

### Cards & Lists
- **Strict Rule:** **No divider lines.** 
- Separate list items using `8` (2rem) of vertical white space or by alternating background tones between `surface` and `surface-container-low`.
- **Card Styling:** High-radius corners (`lg` or `xl`) with ambient shadows only when they represent a primary user task.

### Secure Status Chips
- Use `tertiary_container` (#008946) for "Ready" or "Secure" states. These should be pills (`full` roundedness) with `label-md` typography.

---

## 6. Do's and Don'ts

### Do:
*   **Do** use extreme white space. If a layout feels "full," add more padding from the Spacing Scale (e.g., jump from `8` to `12`).
*   **Do** use the sleek black shield icon as a recurring anchor point for security-related messaging.
*   **Do** use `primary` blue sparingly. It should be a beacon, not a background color.

### Don't:
*   **Don't** use 1px solid black borders. It breaks the "premium paper" metaphor and feels dated.
*   **Don't** use standard drop shadows with high opacity. They create "dirty" layouts. 
*   **Don't** center-align everything. Use the asymmetrical grid—place primary text on the left and secondary "stats" or "actions" on the right to create a sophisticated visual flow.
*   **Don't** use generic system fonts if Inter is available; the specific geometry of Inter is vital for the professional tone of the terminal.