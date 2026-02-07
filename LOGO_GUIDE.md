# BODI Logo Usage Guide

## Logo Assets

We have created multiple logo variations for different use cases:

### 1. **Icon Only** (`/bodi-icon.png`)
- Pure geometric house symbol
- No text
- Perfect for: favicons, app icons, compact spaces, social media avatars
- Transparent background

### 2. **Full Logo with Text** (Component-based)
- Icon + "BODI" text + "Real Estate Platform" tagline
- Available in light and dark themes
- Perfect for: headers, footers, main branding

## Using the Logo Component

Import the Logo component:
```tsx
import Logo from '@/app/components/Logo';
```

### Basic Usage

```tsx
// Default: Full logo, light theme, medium size, links to home
<Logo />

// Icon only
<Logo variant="icon" />

// Dark theme (for dark backgrounds)
<Logo theme="dark" />

// Different sizes
<Logo size="sm" />  // Small
<Logo size="md" />  // Medium (default)
<Logo size="lg" />  // Large

// Custom link
<Logo href="/custom-page" />

// No link (just display)
<Logo href="" />

// Combine props
<Logo variant="full" theme="dark" size="lg" />
```

### Examples for Different Contexts

#### Header (Light Background)
```tsx
<Logo variant="full" theme="light" size="md" />
```

#### Footer (Dark Background)
```tsx
<Logo variant="full" theme="dark" size="sm" />
```

#### Mobile Menu
```tsx
<Logo variant="icon" size="sm" />
```

#### Landing Page Hero
```tsx
<Logo variant="full" theme="light" size="lg" />
```

## Color Scheme

- **Primary Blue**: `#1e40af` (Deep blue for trust and professionalism)
- **Accent Orange**: `#f97316` (Vibrant orange for energy and warmth)
- **Text (Light theme)**: `#1e40af` (Dark blue)
- **Text (Dark theme)**: `#FFFFFF` (White)

## File Locations

- Icon: `/public/bodi-icon.png`
- Component: `/app/components/Logo.tsx`
- Styles: `/app/globals.css` (search for "LOGO COMPONENT")

## Migration from Old Logo

The old text-based logo has been replaced across all pages:
- ✅ Homepage (`app/page.tsx`)
- ✅ Properties page (`app/properties/page.tsx`)
- ✅ Property detail page (`app/property/[id]/page.tsx`)
- ✅ Landlord dashboard (`app/landlord/page.tsx`)
- ✅ List property page (`app/landlord/list-property/page.tsx`)
- ✅ Profile page (`app/profile/page.tsx`)
- ✅ Community page (`app/community/page.tsx`)

All pages now use the professional logo image with proper Next.js Image optimization.
