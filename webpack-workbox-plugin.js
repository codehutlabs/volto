const { GenerateSW } = require('workbox-webpack-plugin');
const WebpackPwaManifest = require('webpack-pwa-manifest');
const path = require('path');

module.exports = {
  modifyWebpackConfig({
    env: { target, dev },
    webpackConfig: config,
    webpackObject,
    options: { pluginOptions, razzleOptions, webpackOptions },
    paths,
  }) {
    const generateSW = new GenerateSW({
      clientsClaim: true,
      skipWaiting: true,
      maximumFileSizeToCacheInBytes: 5000000,
      runtimeCaching: [
        {
          urlPattern: /images/,
          handler: 'CacheFirst',
        },
        {
          urlPattern: new RegExp(
            '^https://fonts.(?:googleapis|gstatic).com/(.*)',
          ),
          handler: 'CacheFirst',
        },
        {
          urlPattern: /.*/,
          handler: 'NetworkFirst',
        },
      ],
    });

    const manifest = new WebpackPwaManifest({
      name: 'Volto PWA App',
      short_name: 'Volto',
      description: 'A Volto App which Uses Plone As Backend',
      theme_color: '#ffffff',
      background_color: '#062e3b',
      inject: false,
      fingerprints: false,
      icons: [
        {
          src: path.resolve('public/logo.png'),
          sizes: [57, 60, 72, 76, 114, 120, 144, 152, 180, 16, 32, 96, 192], // multiple sizes
        },
      ],
    });

    config.plugins.push(generateSW);
    config.plugins.push(manifest);
    return config;
  },
};
