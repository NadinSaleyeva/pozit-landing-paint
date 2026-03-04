# Mobile-First Responsive Rules

## Core Principles
- Always use mobile-first approach: base styles for mobile, then @media for larger screens
- Never use fixed pixel widths on containers — use %, vw, max-width
- All images must have max-width: 100% and height: auto
- Use rem/em for font-sizes, never px for responsive text
- Test all layouts at 320px, 375px, 414px, 768px, 1024px, 1440px

## Common Mobile Issues to Check
- Horizontal overflow causing horizontal scroll (check for elements wider than viewport)
- Fixed-width elements not scaling down
- Padding/margin causing content overflow (use box-sizing: border-box everywhere)
- Buttons too small for touch targets (minimum 44x44px)
- Hidden or clipped elements due to overflow: hidden on parents
- Z-index conflicts on mobile
- Position: absolute/fixed elements breaking on small screens

## When Fixing CSS
- Always add viewport meta tag: <meta name="viewport" content="width=device-width, initial-scale=1.0">
- Use flexbox/grid with wrapping instead of fixed layouts  
- Add overflow-x: hidden to body ONLY as last resort, find the actual overflow source first
- Document every change with a comment explaining WHY