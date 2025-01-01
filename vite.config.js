import { defineConfig } from 'vite';
import svgo from 'vite-plugin-svgo';

export default defineConfig({
  plugins: [
    svgo({
      plugins: [
        // { name: 'removeDimensions', active: true },
        // { name: 'removeAttrs', params: { attrs: '(fill|stroke)' } },
      ],
    }),
  ],
});
