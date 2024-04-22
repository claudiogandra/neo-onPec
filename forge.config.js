require('dotenv').config();
const path = require('node:path');
const WixInstaller = require('electron-wix-msi');
const { FusesPlugin } = require('@electron-forge/plugin-fuses');
const { FuseV1Options, FuseVersion } = require('@electron/fuses');

module.exports = {
  packagerConfig: {
    asar: true,
    icon: path.join(__dirname, 'Wlogo.ico'),
    ignore: [
      ".gitignore",
      ".yarn",
      ".yarnrc-yml",
      ".editorconfig",
      "test/",
      "bin/data/",
    ]
  },

  rebuildConfig: {},

  makers: [
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
    {
      name: WixInstaller,
      config: {
        setupExe: 'ON PEC.exe',
        setupIcon: path.join(__dirname, 'Wlogo.ico'),
        noMsi: true
      }
    },
    /* {
      name: '@electron-forge/maker-squirrel',
      description: 'App Ciclo do Gado - Offline First',
      config: {
        bin: 'onPec',
      }
    }, */
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
