# Figma Integration Guide for SentinelApp

This guide will walk you through the complete process of exporting code from Figma and developing a high-end full-stack website with your app.

## 🎨 Step 1: Figma Design Export

### Option A: Using Figma Dev Mode (Recommended)

1. **Enable Dev Mode** in Figma
   - Open your Figma design
   - Click on the "Dev Mode" toggle in the top-right corner
   - This gives you access to CSS properties and code snippets

2. **Extract Design Tokens**
   - **Colors**: Copy hex values from the design
   - **Typography**: Note font families, sizes, and weights
   - **Spacing**: Extract padding, margin, and gap values
   - **Border Radius**: Note corner radius values
   - **Shadows**: Copy box-shadow properties

3. **Export Assets**
   - Select icons and images
   - Right-click → "Export"
   - Choose appropriate format (SVG for icons, PNG/JPG for images)
   - Download to `public/assets/` folder

### Option B: Using Figma Plugins

1. **Install Recommended Plugins**:
   - "Figma to HTML/CSS/React"
   - "Anima" (for React/Vue code)
   - "Figma to Code"
   - "Design Tokens"

2. **Export Process**:
   - Select your design frames
   - Run the plugin
   - Copy generated code
   - Paste into your components

### Option C: Manual Export

1. **Screenshot Method**:
   - Take screenshots of each section
   - Use as reference while coding
   - Implement pixel-perfect designs

2. **CSS Extraction**:
   - Use browser dev tools to inspect Figma elements
   - Copy CSS properties
   - Adapt to your component structure

## 🏗️ Step 2: Project Structure Setup

### Directory Structure
```
src/
├── components/
│   ├── ui/           # Base UI components
│   ├── layout/       # Layout components
│   ├── forms/        # Form components
│   ├── navigation/   # Navigation components
│   └── sections/     # Page sections
├── lib/
│   ├── utils.ts      # Utility functions
│   ├── supabase-client.ts
│   └── supabase-server.ts
├── hooks/            # Custom React hooks
├── types/            # TypeScript types
├── styles/           # Global styles
├── constants/        # App constants
└── app/              # Next.js app router
```

## 🎯 Step 3: Component Development Process

### 1. Create Base Components
Start with fundamental UI components:

```bash
# Create component files
touch src/components/ui/button.tsx
touch src/components/ui/input.tsx
touch src/components/ui/card.tsx
touch src/components/ui/modal.tsx
touch src/components/ui/dropdown.tsx
```

### 2. Implement Design System
Update `tailwind.config.js` with your Figma design tokens:

```javascript
// Example: Extract colors from Figma
colors: {
  primary: {
    50: '#eff6ff',   // From Figma
    100: '#dbeafe',  // From Figma
    // ... continue with your design colors
  }
}
```

### 3. Create Layout Components
Build reusable layout components:

```typescript
// src/components/layout/Header.tsx
export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* Your header content */}
    </header>
  )
}
```

## 🚀 Step 4: Page Development

### 1. Landing Page
Create a modern, responsive landing page:

```typescript
// src/app/page.tsx
import { Hero } from '@/components/sections/Hero'
import { Features } from '@/components/sections/Features'
import { Pricing } from '@/components/sections/Pricing'
import { Testimonials } from '@/components/sections/Testimonials'
import { CTA } from '@/components/sections/CTA'

export default function HomePage() {
  return (
    <main>
      <Hero />
      <Features />
      <Pricing />
      <Testimonials />
      <CTA />
    </main>
  )
}
```

### 2. Dashboard Page
Enhance your existing dashboard:

```typescript
// src/app/dashboard/page.tsx
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { TrialOverview } from '@/components/dashboard/TrialOverview'
import { RecentActivity } from '@/components/dashboard/RecentActivity'
import { QuickActions } from '@/components/dashboard/QuickActions'

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <TrialOverview />
        <RecentActivity />
        <QuickActions />
      </div>
    </DashboardLayout>
  )
}
```

## 🎨 Step 5: Styling Implementation

### 1. Global Styles
Update `src/app/globals.css`:

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    /* Add your Figma color variables */
  }
}

@layer components {
  .gradient-text {
    @apply bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent;
  }
  
  .glass-effect {
    @apply bg-white/10 backdrop-blur-md border border-white/20;
  }
}
```

### 2. Component Styling
Use Tailwind classes that match your Figma design:

```typescript
// Example: Hero section matching Figma
export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-accent-50 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-mesh opacity-10"></div>
      <div className="relative z-10 container mx-auto px-4 text-center">
        <h1 className="text-5xl md:text-7xl font-bold gradient-text mb-6">
          Manage Your Free Trials
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Never miss a trial expiration again. Track, manage, and optimize your subscriptions.
        </p>
        <Button size="lg" className="text-lg px-8 py-4">
          Get Started Free
        </Button>
      </div>
    </section>
  )
}
```

## 🔧 Step 6: Advanced Features

### 1. Animations
Add Framer Motion animations:

```typescript
import { motion } from 'framer-motion'

export function AnimatedCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.05 }}
      className="card"
    >
      {/* Card content */}
    </motion.div>
  )
}
```

### 2. Interactive Elements
Add hover effects and micro-interactions:

```typescript
export function InteractiveButton() {
  return (
    <button className="group relative overflow-hidden rounded-lg bg-gradient-to-r from-primary to-accent p-0.5 transition-all duration-300 hover:shadow-lg">
      <span className="relative block rounded-md bg-background px-6 py-3 transition-all duration-300 group-hover:bg-transparent group-hover:text-white">
        Click me
      </span>
    </button>
  )
}
```

## 📱 Step 7: Responsive Design

### 1. Mobile-First Approach
Ensure all components work on mobile:

```typescript
export function ResponsiveGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
      {/* Grid items */}
    </div>
  )
}
```

### 2. Breakpoint Testing
Test on various screen sizes:
- Mobile: 320px - 768px
- Tablet: 768px - 1024px
- Desktop: 1024px+

## 🎯 Step 8: Performance Optimization

### 1. Image Optimization
Use Next.js Image component:

```typescript
import Image from 'next/image'

export function OptimizedImage() {
  return (
    <Image
      src="/assets/hero-image.jpg"
      alt="Hero"
      width={800}
      height={600}
      priority
      className="rounded-lg"
    />
  )
}
```

### 2. Code Splitting
Use dynamic imports for heavy components:

```typescript
import dynamic from 'next/dynamic'

const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <div>Loading...</div>
})
```

## 🧪 Step 9: Testing & Quality Assurance

### 1. Visual Testing
- Compare screenshots with Figma designs
- Test on different browsers
- Check accessibility (WCAG compliance)

### 2. Performance Testing
- Use Lighthouse for performance scores
- Optimize Core Web Vitals
- Test loading times

## 🚀 Step 10: Deployment

### 1. Build Optimization
```bash
npm run build
npm run start
```

### 2. Deploy to Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

## 📋 Checklist for Figma Integration

- [ ] Extract all design tokens (colors, typography, spacing)
- [ ] Export and optimize all assets (icons, images)
- [ ] Create base UI components
- [ ] Implement responsive layouts
- [ ] Add animations and interactions
- [ ] Test on multiple devices
- [ ] Optimize performance
- [ ] Deploy and test in production

## 🛠️ Useful Tools & Resources

### Figma Plugins
- Figma to Code
- Anima
- Design Tokens
- CSS Export

### Development Tools
- Chrome DevTools
- React Developer Tools
- Tailwind CSS IntelliSense
- Framer Motion

### Testing Tools
- Lighthouse
- WebPageTest
- BrowserStack
- axe DevTools

## 🎨 Design System Best Practices

1. **Consistency**: Use the same spacing, colors, and typography throughout
2. **Accessibility**: Ensure sufficient color contrast and keyboard navigation
3. **Performance**: Optimize images and minimize bundle size
4. **Maintainability**: Use CSS variables and component composition
5. **Scalability**: Design components to be reusable and flexible

## 📞 Next Steps

1. **Start with the landing page** - Implement the hero section first
2. **Build component by component** - Don't try to do everything at once
3. **Test frequently** - Check your work against the Figma design
4. **Iterate and improve** - Refine based on user feedback

Remember: The goal is to create a pixel-perfect implementation of your Figma design while maintaining excellent performance and user experience. 