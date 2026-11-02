# IIM Sirmaur LMS Dashboard Design System (Eduplex-Inspired)

An understated, modern academic dashboard design system replicating the overall design philosophy, layout language, spacing, proportions and simplicity of the reference dashboard while maintaining IIM Sirmaur's institutional identity.

## 1. Palette
- **Sidebar:** `#202033` (deep charcoal navy)
- **Main Background:** `#F7F7F4` (soft off-white warm neutral)
- **Cards & Surfaces:** `#FFFFFF`
- **Borders & Dividers:** `#EEEEEB`
- **Primary Text:** `#20202B`
- **Secondary Text:** `#85858D`
- **Accent Highlight:** `#D7F36A` (soft lime for active navigation, indicators and peak metric highlights)
- **Success:** `#268A50` / `#EAF6EE` (active and submitted statuses)
- **Warning:** `#C27803` / `#FEF7EA` (SLA and pending notices)
- **Danger:** `#D32F2F` / `#FDE8E8` (critical P1 escalations)

## 2. Layout Structure
- **Left Sidebar:** Fixed `#202033` charcoal navy navigation with IIM Sirmaur branding at the top, monochromatic icons, lime `#D7F36A` active pill highlight with `#20202B` text, and user profile switcher at the bottom.
- **Top Header:** Minimal header with personalized greeting ("Welcome back, {User}"), search bar, alerts notification popover, admin mode switch, and user avatar.
- **Main Dashboard (3-Column Composition):**
  - **Column 1 (Primary):** Academic overview status banner, weekly learning activity chart (`#202033` bars with `#D7F36A` peak indicator), and enrolled courses cards.
  - **Column 2 (Middle):** Academic performance breakdown (Lecture Participation 92%, Continuous Assessment 86%, Term Projects 84%, Faculty remark quote), and weekly timetable room schedule.
  - **Column 3 (Right):** Compact interactive academic calendar, upcoming assignments with status & submit action, and campus resilience bulletin.

## 3. Component Styling
- **Radii:** `12px - 16px` (`rounded-xl` and `rounded-2xl`).
- **Shadows:** Minimal to none (`shadow-none` or subtle `shadow-xs`).
- **Typography:** Inter, tabular numbers for statistics, clean sentence-case headings.
- **Decorations:** Clean whitespace, no gradients, no glowing blobs, no oversized circular gauges.
- **Physical ID Card Quick-Access Component:**
  - Designed after the authentic physical matte badge reference.
  - Hanging & swinging pendulum physics (`animate-id-swing`, anchored at top lanyard clip).
  - Front-facing quick access academic telemetry: CGPA (3.82 / 4.00), Attendance (92.4%), Active Course Units, Pending Assignments Due.
  - Authentic hardware details: punched lanyard slot, silver metallic rivet, scannable QR code matrix, and reference ID copy utility.
