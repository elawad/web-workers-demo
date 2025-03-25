import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';

export default defineConfig({
  plugins: [pluginReact()],
  server: { open: true },
  output: { assetPrefix: './', legalComments: 'none' },
  html: {
    title: 'Web Workers Demo',
    tags: [
      {
        tag: 'link',
        attrs: {
          href: 'https://fonts.googleapis.com',
          rel: 'preconnect',
        },
      },
      {
        tag: 'link',
        attrs: {
          href: 'https://fonts.gstatic.com',
          rel: 'preconnect',
          crossorigin: true,
        },
      },
      {
        tag: 'link',
        attrs: {
          href: 'https://fonts.googleapis.com/css2?family=Fira+Code&display=swap',
          rel: 'stylesheet',
        },
      },
    ],
  },
});
