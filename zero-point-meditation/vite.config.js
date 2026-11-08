import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'preload-homepage-hero-image',
      apply: 'build',
      generateBundle(_, bundle) {
        const heroAsset = Object.values(bundle).find(
          (asset) =>
            asset.type === 'asset' &&
            asset.fileName.includes('buddha-lotus') &&
            /\\.webp$/i.test(asset.fileName)
        );

        const htmlAsset = bundle['index.html'];
        if (!heroAsset || !htmlAsset || htmlAsset.type !== 'asset') return;

        const href = `/${heroAsset.fileName}`;
        const preloadTag = `<link rel="preload" as="image" href="${href}" fetchpriority="high" type="image/webp">`;
        htmlAsset.source = String(htmlAsset.source).replace('</head>', `  ${preloadTag}\\n</head>`);
      },
    },
  ],
})