# Machine Learning Learning Platform - Agent Documentation

## Project Overview

This is a **Vietnamese-language educational platform** for teaching Machine Learning concepts. Built with Next.js 16, React 19, and TypeScript, it provides an interactive learning experience with 12 comprehensive ML topics.

## Tech Stack

- **Framework:** Next.js 16.0.3 (App Router)
- **UI:** React 19.2.0 + TypeScript 5
- **Styling:** Tailwind CSS 4.1.9
- **Components:** Radix UI + shadcn/ui (57 components)
- **Forms:** react-hook-form + zod
- **Charts:** recharts
- **Markdown:** react-markdown + remark-gfm

## Project Structure

```
/app                    # Next.js App Router
  /api/generate        # Content generation API
  layout.tsx           # Root layout
  page.tsx             # Home page (12 ML topics)
  globals.css          # Global styles

/components            # React components
  /ui                  # 57 Radix UI components
  content-display.tsx  # ML content renderer
  header.tsx           # App header
  sidebar.tsx          # Topic navigation
  theme-provider.tsx   # Dark/light mode

/hooks                 # Custom hooks
  use-mobile.ts        # Mobile detection
  use-toast.ts         # Toast notifications

/lib                   # Utilities
  utils.ts             # Helper functions
```

## Key Features

### 12 Machine Learning Topics (Vietnamese)

1. **Machine Learning là gì?** - ML fundamentals
2. **ML vs AI vs Deep Learning** - Concept comparison
3. **ML Pipeline** - End-to-end workflow
4. **Thuật ngữ quan trọng** - Key terminology
5. **Các loại học máy** - Learning types
6. **Supervised Learning** - Classification & regression
7. **Unsupervised Learning** - Clustering & dimensionality
8. **Neural Networks cơ bản** - Basic neural networks
9. **Overfitting & Underfitting** - Model problems
10. **Đánh giá Model** - Evaluation metrics
11. **Feature Engineering** - Feature techniques
12. **Dự án thực hành** - Practical ML project

## Development Commands

```bash
pnpm run dev      # Start dev server (localhost:3000)
pnpm run build    # Production build
pnpm run start    # Start production server
pnpm run lint     # Run ESLint
```

## Configuration

### TypeScript

- Strict mode enabled
- Path alias: `@/*` → `./*`
- React JSX support

### Next.js

- TypeScript build errors ignored (development)
- Image optimization disabled
- App Router architecture

### Tailwind CSS

- Version 4.1.9
- Custom animations via `tailwindcss-animate`
- Dark mode support

## Important Files

- **[package.json](file:///home/anvu/workspaces/projects/stitchchng1tngquanvhcmy/package.json)** - Dependencies and scripts
- **[tsconfig.json](file:///home/anvu/workspaces/projects/stitchchng1tngquanvhcmy/tsconfig.json)** - TypeScript config
- **[next.config.mjs](file:///home/anvu/workspaces/projects/stitchchng1tngquanvhcmy/next.config.mjs)** - Next.js config
- **[components.json](file:///home/anvu/workspaces/projects/stitchchng1tngquanvhcmy/components.json)** - shadcn/ui config

## Component Library

The project includes 57 pre-built UI components from Radix UI/shadcn:

**Forms:** Button, Input, Checkbox, Select, Slider, Switch, Textarea, Radio Group  
**Layout:** Card, Accordion, Tabs, Separator, Scroll Area, Resizable  
**Navigation:** Breadcrumb, Menubar, Navigation Menu, Pagination  
**Overlays:** Dialog, Sheet, Drawer, Popover, Tooltip, Hover Card  
**Feedback:** Alert, Toast, Progress, Spinner, Skeleton  
**Data:** Table, Calendar, Chart, Carousel, Avatar

## Development Notes

- **Hot Reload:** Enabled by default
- **Port:** 3000 (default Next.js)
- **Language:** All content in Vietnamese
- **Theme:** Supports dark/light mode via `next-themes`

## API Endpoints

- **POST /api/generate** - Generates ML content based on topic prompts

## State Management

- React `useState` for local component state
- Topic selection managed in main page component
- Theme state via `next-themes` provider

## Styling Approach

- Tailwind utility classes
- CSS variables for theming
- Responsive design with mobile-first approach
- Custom animations and transitions

## Known Configuration

- TypeScript build errors are ignored in development
- Images are unoptimized (for faster dev builds)
- Strict TypeScript mode enabled
- ESNext module resolution
