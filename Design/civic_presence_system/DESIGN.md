---
name: Civic Presence System
colors:
  surface: '#f9f9ff'
  surface-dim: '#cfdaf2'
  surface-bright: '#f9f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f0f3ff'
  surface-container: '#e7eeff'
  surface-container-high: '#dee8ff'
  surface-container-highest: '#d8e3fb'
  on-surface: '#111c2d'
  on-surface-variant: '#434652'
  inverse-surface: '#263143'
  inverse-on-surface: '#ecf1ff'
  outline: '#747783'
  outline-variant: '#c4c6d3'
  surface-tint: '#345baf'
  primary: '#002869'
  on-primary: '#ffffff'
  primary-container: '#0b3d91'
  on-primary-container: '#8dadff'
  inverse-primary: '#b1c5ff'
  secondary: '#505f76'
  on-secondary: '#ffffff'
  secondary-container: '#d0e1fb'
  on-secondary-container: '#54647a'
  tertiary: '#292d2e'
  on-tertiary: '#ffffff'
  tertiary-container: '#3f4345'
  on-tertiary-container: '#adafb1'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dae2ff'
  primary-fixed-dim: '#b1c5ff'
  on-primary-fixed: '#001947'
  on-primary-fixed-variant: '#144296'
  secondary-fixed: '#d3e4fe'
  secondary-fixed-dim: '#b7c8e1'
  on-secondary-fixed: '#0b1c30'
  on-secondary-fixed-variant: '#38485d'
  tertiary-fixed: '#e0e3e5'
  tertiary-fixed-dim: '#c4c7c9'
  on-tertiary-fixed: '#191c1e'
  on-tertiary-fixed-variant: '#444749'
  background: '#f9f9ff'
  on-background: '#111c2d'
  surface-variant: '#d8e3fb'
typography:
  display:
    fontFamily: Inter
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 34px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 30px
  title-md:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
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
  label-caps:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  container-padding-mobile: 16px
  container-padding-desktop: 32px
  gutter: 16px
  card-gap: 24px
---

## Brand & Style
The design system is engineered for the administrative rigor of village government operations. It balances authoritative professionalism with modern accessibility, ensuring that civil servants feel a sense of official duty and reliability when interacting with the interface.

The aesthetic follows a **Corporate / Modern** direction, utilizing a structured, card-based layout to organize dense information. The visual tone is "Institutional yet Approachable"—avoiding the clutter of legacy government software in favor of high-clarity interfaces that prioritize speed of task completion, such as clocking in or reviewing attendance reports.

## Colors
This design system utilizes a palette rooted in "Indonesian Government Blue" to establish immediate trust and official status. 

- **Primary:** Used for key actions, navigation headers, and active states.
- **Secondary:** A professional slate grey for supporting text and icons.
- **Surface:** A high-contrast white background with ultra-light grey fills for sectioning.
- **Semantic Palette:**
  - **Green (Success):** Reserved for "Hadir" (Present) status and successful submissions.
  - **Amber (Warning):** Dedicated to "Izin/Cuti" (Leave/Permission) workflows.
  - **Blue (Info):** Specifically for "Dinas Luar" (External Duty) tracking.
  - **Red (Error):** Indicates "Alfa" (Absent) or critical system errors.

## Typography
Inter is selected for its exceptional legibility on mobile screens and neutral, systematic character. The hierarchy is designed to handle data-heavy contexts:
- **Headlines:** Use tighter letter spacing and semi-bold weights to command attention on dashboards.
- **Body:** Standardized at 16px for primary reading and 14px for data tables to ensure high information density without sacrificing clarity.
- **Labels:** Uppercase styles are used for table headers and section overviews to differentiate metadata from primary data.

## Layout & Spacing
The system employs a **Fixed Grid** on desktop (1280px max-width) and a **Fluid Grid** on mobile. 

- **Grid:** A 12-column grid for desktop, collapsing to a single column for mobile attendance logging.
- **Rhythm:** An 8px linear scale governs all spacing.
- **Margins:** 16px lateral margins on mobile devices to maximize touch targets for the primary attendance buttons.
- **Information Density:** Large whitespace is used between major functional blocks (e.g., separating the "Clock-in" card from the "Recent Activity" list) to reduce cognitive load for users who may not be tech-savvy.

## Elevation & Depth
This design system uses **Tonal Layers** and subtle **Ambient Shadows** to create a structured hierarchy.

- **Level 0 (Background):** Solid white or `#F8FAFC`.
- **Level 1 (Cards):** White surfaces with a 1px border in `#E2E8F0` and a very soft, diffused shadow (0px 4px 12px rgba(0, 0, 0, 0.05)).
- **Level 2 (Modals/Overlays):** Increased shadow depth (0px 10px 25px rgba(0, 0, 0, 0.1)) to focus attention on form submissions or status confirmations.
- **Interactive States:** Buttons use a slight "lift" effect (increased shadow) on hover to indicate playability.

## Shapes
A **Rounded** shape language is applied (8px default) to soften the bureaucratic nature of the app, making it feel more like a modern service. 

- **Buttons & Inputs:** 8px corner radius.
- **Cards:** 12px corner radius for a distinct container feel.
- **Badges:** Fully pill-shaped (rounded-xl) to distinguish them from interactive buttons.

## Components
- **Attendance Buttons:** Large-format action buttons (minimum 56px height) with "Presensi Masuk" (Primary Blue) and "Presensi Pulang" (Outline Primary). Icons should accompany text for immediate recognition.
- **Status Badges:** Use subtle background tints with high-contrast text (e.g., Light Green background with Deep Green text) for "Hadir," "Izin," and "Dinas Luar."
- **Data Tables:** Clean, borderless rows with subtle dividers. Header cells should use `label-caps` for clear distinction. Include "Quick Filter" chips for filtering by department or status.
- **Form Fields:** Inset labels or floating labels with a clear 1px border. Focus states must use a 2px Primary Blue ring.
- **Summary Cards:** Use for dashboard metrics (e.g., "Total Staff Present Today"). These should feature a large `headline-lg` number and a small icon in the top right.
- **Motifs:** A very subtle, low-opacity (2-3%) Indonesian "Batik" or geometric pattern can be used as a background watermark in the header area to reinforce the government brand without interfering with text legibility.