require('dotenv').config();
const path = require('node:path');
const { FusesPlugin } = require('@electron-forge/plugin-fuses');
const { FuseV1Options, FuseVersion } = require('@electron/fuses');

module.exports = {
  packagerConfig: {
    asar: true,
    icon: path.join(__dirname, 'Wlogo.ico'),
    ignore: [
      ".env",
      ".gitignore",
      ".yarn",
      ".yarnrc-yml",
      ".editorconfig",
      "test/",
    ]
  },

  rebuildConfig: {},

  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      description: 'App Ciclo do Gado - Offline First',
      config: {
        bin: 'onPec',
        /* iconUrl: 'https://roncador.net/images/2022-Logo-Assinatura-White.png',
        loadingGif: path.join(__dirname, './bin/Wedges-3s-200px.gif' ) */
      }
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin'],
    },
    {
      name: '@electron-forge/maker-deb',
      config: {},
    },
    {
      name: '@electron-forge/maker-rpm',
      config: {},
    },
  ],
  
  publishers: [
    {
      name: '@electron-forge/publisher-github',
      config: {
        repository: {
          owner: `${process.env.GITHUB_USER}`,
          name: `${process.env.GITHUB_REPO}`,
        },
        authToken: `${process.env.GITHUB_TOKEN}`,
        prerelease: true,
      }
    }
  ],

  plugins: [
    {
      name: '@electron-forge/plugin-auto-unpack-natives',
      config: {},
    },
    // Fuses are used to enable/disable various Electron functionality
    // at package time, before code signing the application
    new FusesPlugin({
      version: FuseVersion.V1,
      [FuseV1Options.RunAsNode]: false,
      [FuseV1Options.EnableCookieEncryption]: true,
      [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: true,
      [FuseV1Options.EnableNodeCliInspectArguments]: false,
      [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
      [FuseV1Options.OnlyLoadAppFromAsar]: true,
    }),
  ],
};
