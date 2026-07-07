---
name: Corporate Room Management
colors:
  surface: '#f8f9fb'
  surface-dim: '#d9dadc'
  surface-bright: '#f8f9fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f4f6'
  surface-container: '#edeef0'
  surface-container-high: '#e7e8ea'
  surface-container-highest: '#e1e2e4'
  on-surface: '#191c1e'
  on-surface-variant: '#434654'
  inverse-surface: '#2e3132'
  inverse-on-surface: '#f0f1f3'
  outline: '#737685'
  outline-variant: '#c3c6d6'
  surface-tint: '#0c56d0'
  primary: '#003d9b'
  on-primary: '#ffffff'
  primary-container: '#0052cc'
  on-primary-container: '#c4d2ff'
  inverse-primary: '#b2c5ff'
  secondary: '#285ab9'
  on-secondary: '#ffffff'
  secondary-container: '#709bfe'
  on-secondary-container: '#003179'
  tertiary: '#7b2600'
  on-tertiary: '#ffffff'
  tertiary-container: '#a33500'
  on-tertiary-container: '#ffc6b2'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dae2ff'
  primary-fixed-dim: '#b2c5ff'
  on-primary-fixed: '#001848'
  on-primary-fixed-variant: '#0040a2'
  secondary-fixed: '#d9e2ff'
  secondary-fixed-dim: '#b1c6ff'
  on-secondary-fixed: '#001946'
  on-secondary-fixed-variant: '#00419d'
  tertiary-fixed: '#ffdbcf'
  tertiary-fixed-dim: '#ffb59b'
  on-tertiary-fixed: '#380d00'
  on-tertiary-fixed-variant: '#812800'
  background: '#f8f9fb'
  on-background: '#191c1e'
  surface-variant: '#e1e2e4'
typography:
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-bold:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  gutter: 16px
  margin-mobile: 16px
  margin-desktop: 32px
  card-padding: 20px
  stack-gap: 12px
---

## Brand & Style

The design system is built for a high-performance corporate environment where efficiency and clarity are paramount. The brand personality is professional, reliable, and frictionless, aiming to reduce the cognitive load of scheduling and resource management.

The chosen style is **Corporate Modern**, blending a systematic approach with subtle tactile cues. It utilizes a clean, "High-Information Density" layout that remains breathable through generous white space and a structured card-based architecture. The emotional response should be one of calm control and organizational mastery, ensuring users feel the tool is an assistant rather than a hurdle.

## Colors

The palette is anchored by a deep **Professional Blue** (Primary), used for core actions and navigation states to signify trust and stability. A darker shade (Secondary) is reserved for hover states and active indicators to provide clear interactive feedback.

The neutral system uses a range of cool-toned grays. **#F4F5F7** serves as the primary background color, creating a soft contrast against the pure white (**#FFFFFF**) cards. Text follows a strict hierarchy: deep navy for primary readability and a medium gray for metadata and labels. Success, warning, and error states should use industry-standard green, amber, and red, but desaturated to maintain the professional aesthetic.

## Typography

The design system utilizes **Inter** exclusively to leverage its exceptional legibility and systematic weight distribution. The typography strategy prioritizes a clear information hierarchy for data-heavy views like room schedules and availability lists.

- **Headlines:** Bold weights with slight negative letter-spacing to appear modern and grounded.
- **Body:** Standardized at 16px for comfortable reading of descriptions and meeting details.
- **Labels:** Small, uppercase labels are used for metadata (e.g., "CAPACITY", "EQUIPMENT") to differentiate from actionable text.
- **Scaling:** On mobile, large display titles scale down significantly to preserve vertical space for the room cards and calendar views.

## Layout & Spacing

The design system follows a **12-column fluid grid** for desktop and a **single-column vertical stack** for mobile. A 4px baseline grid ensures consistent vertical rhythm across all components.

- **Desktop:** 32px outer margins with 16px gutters between cards. Content containers have a maximum width of 1440px to prevent excessive line lengths.
- **Mobile:** 16px outer margins. Navigation is moved to a bottom-tab bar or a simplified header to maximize the interactive area for room selection.
- **Alignment:** All elements within cards should align to a consistent internal padding of 20px, ensuring that text and icons create a clean vertical line.

## Elevation & Depth

This design system uses **Ambient Shadows** and **Tonal Layering** to define hierarchy without visual clutter. Depth is functional: it distinguishes interactive elements from the background.

- **Level 0 (Background):** The base canvas uses the light gray neutral color.
- **Level 1 (Cards/Surfaces):** White surfaces with a very soft, diffused shadow (Blur: 12px, Y: 4px, Opacity: 5% Black). This is the default state for room cards.
- **Level 2 (Hover/Active):** When a user interacts with a room card, the shadow tightens and slightly darkens (Blur: 8px, Y: 2px, Opacity: 10%), combined with a subtle 1px stroke in the primary color to indicate selection.
- **Level 3 (Modals/Overlays):** Used for booking confirmation dialogs. These feature a high-blur backdrop (8px) and a more pronounced shadow to pull the user's focus entirely.

## Shapes

The shape language is defined as **Rounded**, striking a balance between corporate precision and modern friendliness. 

- **Standard Elements (Buttons, Inputs):** 0.5rem (8px) radius.
- **Containers (Cards, Modals):** 1rem (16px) radius to create a soft, approachable frame for content.
- **Small Elements (Tags, Badges):** 0.25rem (4px) to maintain clarity at small scales.

Avoid pill-shaped buttons to keep the interface feeling structured and professional rather than playful.

## Components

### Buttons
- **Primary:** Solid blue background with white text. High contrast for the "Book Now" actions.
- **Secondary:** Ghost style with a 1px gray border and blue text. Used for "Cancel" or "View Details."

### Cards
Room cards are the primary interface element. They must include:
- A clear title (Room Name).
- Status Indicator (Green dot for Available, Red for Occupied).
- Iconic metadata (Capacity icon, Wi-Fi icon, TV icon).
- A clear primary action button pinned to the bottom or right.

### Input Fields
Forms use a soft gray background with a bottom border that transitions to a solid blue 2px border on focus. Labels should always be visible above the field in the `label-md` style.

### Chips/Tags
Used for room features (e.g., "Projector," "Conference Call"). These should have a light gray background with no border and `body-sm` typography to remain secondary to the main room information.

### Progress/Time Indicators
For current bookings, use a horizontal progress bar within the card to show how much time remains in the current meeting, using a subtle blue-to-light-blue gradient.