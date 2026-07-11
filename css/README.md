# CSS Structure

This directory contains all stylesheets for the Niyati Birthday website, organized following best practices.

## Files

### `styles.css` (101KB)
Main stylesheet containing:
- **Tailwind CSS Framework**: Complete Tailwind CSS utility classes
- **Custom CSS Variables**: Theme colors and design tokens
- **Custom Components**: Birthday-specific styles including:
  - `.font-heading` - Heading font family
  - `.font-body` - Body text font family
  - `.font-mono-nb` - Monospace font family
  - `.nb-border` - Custom border styles
  - `.nb-shadow` - Custom shadow effects
  - `.paper-grain` - Paper texture background
  - `.hover-tilt` - Hover animation effects
  - Marquee animations

### `app.css` (67B)
App-level styles:
- `.App` class with minimum height and background color

### `sonner.css` (15KB)
Toast notification library styles (Sonner):
- Complete toast notification component styles
- Animations for toast appearances
- Theme variants (light/dark)
- Responsive styles
- Toast positioning and stacking

## Usage

The CSS files are loaded in `index.html` in this order:

```html
<link rel="stylesheet" href="css/styles.css">
<link rel="stylesheet" href="css/app.css">
<link rel="stylesheet" href="css/sonner.css">
