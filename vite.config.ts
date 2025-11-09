import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.ico", "icons/apple-touch-icon.png"],
      manifest: {
        name: "Scheduler",
        short_name: "Scheduler",
        description:
          "A powerful task scheduler application for managing your daily tasks",
        theme_color: "#4F46E5", // Change to your brand color (example: indigo-600)
        background_color: "#ffffff",
        display: "standalone",
        orientation: "portrait-primary",
        scope: "/",
        start_url: "/",
        icons: [
          {
            src: "/icons/pwa-icon-72x72.png",
            sizes: "72x72",
            type: "image/png",
          },
          {
            src: "/icons/pwa-icon-96x96.png",
            sizes: "96x96",
            type: "image/png",
          },
          {
            src: "/icons/pwa-icon-128x128.png",
            sizes: "128x128",
            type: "image/png",
          },
          {
            src: "/icons/pwa-icon-144x144.png",
            sizes: "144x144",
            type: "image/png",
          },
          {
            src: "/icons/pwa-icon-152x152.png",
            sizes: "152x152",
            type: "image/png",
          },
          {
            src: "/icons/pwa-icon-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/icons/pwa-icon-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
        categories: ["productivity", "utilities"],
        screenshots: [
          // Add these later for enhanced PWA experience
          // {
          //   src: "/screenshots/desktop-1.png",
          //   sizes: "1280x720",
          //   type: "image/png",
          //   form_factor: "wide"
          // },
          // {
          //   src: "/screenshots/mobile-1.png",
          //   sizes: "750x1334",
          //   type: "image/png"
          // }
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg,woff,woff2,ttf,eot}"],

        // Clean old caches
        cleanupOutdatedCaches: true,

        runtimeCaching: [
          // API Requests - Network First strategy
          {
            urlPattern: ({ url }) => {
              return (
                url.pathname.startsWith("/api/") ||
                url.hostname.includes("api.") ||
                url.hostname.includes("backend.")
              );
            },
            handler: "NetworkFirst",
            options: {
              cacheName: "api-cache",
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24, // 24 hours
              },
              networkTimeoutSeconds: 6,
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },

          // Images - Cache First strategy
          {
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|avif)$/i,
            handler: "CacheFirst",
            options: {
              cacheName: "images-cache",
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
              },
            },
          },

          // Fonts - Cache First strategy
          {
            urlPattern: /\.(?:woff|woff2|ttf|eot|otf)$/i,
            handler: "CacheFirst",
            options: {
              cacheName: "fonts-cache",
              expiration: {
                maxEntries: 30,
                maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
              },
            },
          },

          // Static Assets - Stale While Revalidate
          {
            urlPattern: /\.(?:js|css)$/i,
            handler: "StaleWhileRevalidate",
            options: {
              cacheName: "static-resources",
              expiration: {
                maxEntries: 60,
                maxAgeSeconds: 60 * 60 * 24 * 7, // 7 days
              },
            },
          },
        ],

        // Offline fallback
        navigateFallback: "/index.html",
        navigateFallbackDenylist: [/^\/api\//],
      },

      // Development options
      devOptions: {
        enabled: false, // Set to true to test PWA in dev mode
        type: "module",
      },
    }),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  define: {
    "crypto.hash": "crypto.createHash",
  },
});
