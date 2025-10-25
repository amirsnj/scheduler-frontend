# PWA Setup Guide

This application has been configured as a Progressive Web App (PWA).

## Features Enabled

✅ Service Worker for offline functionality
✅ Web App Manifest for installability
✅ Caching strategies for assets and API calls
✅ Auto-update on new versions

## Icons Required

For a complete PWA experience, you should create the following icon files in the `public` directory:

- `favicon.ico` - Traditional favicon (16x16 or 32x32)
- `apple-touch-icon.png` - Apple touch icon (180x180)
- `mask-icon.svg` - Safari pinned tab icon

### Recommended Icon Sizes

- 192x192 (required for manifest)
- 512x512 (required for manifest)
- 180x180 (for Apple devices)

You can use the current `vite.svg` as a temporary icon, but it's recommended to create proper icon files that match your app's branding.

## Testing

1. Build the application: `npm run build`
2. Preview the build: `npm run preview`
3. Open Chrome DevTools > Application > Manifest to verify the manifest
4. Use Lighthouse to test PWA compliance

## Installation

Users can install the app by:

- Clicking the install prompt in supported browsers (Chrome, Edge, Safari)
- Using the browser menu: "Install [App Name]"

## Customization

Edit `vite.config.ts` to customize:

- App name and description
- Theme colors
- Icon paths
- Caching strategies
- Service worker behavior
