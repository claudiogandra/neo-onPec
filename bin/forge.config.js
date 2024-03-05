module.exports = {
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {
        exe: 'ON PEC.exe',
        noMsi: false,
        iconUrl: 'https://roncador.net/images/2022-Logo-Assinatura-White.png',
        loadingGif: './Wedges-3s-200px.gif',
        certificateFile: './cert.pfx',
        certificatePassword: process.env.CERTIFICATE_PASSWORD
      }
    }
  ],
  
  publishers: [
    {
      name: '@electron-forge/publisher-github',
      config: {
        repository: {
          owner: 'claudio.gandra',
          name: 'neo-onPec'
        },
        prerelease: false,
        draft: true
      }
    }
  ]
};
