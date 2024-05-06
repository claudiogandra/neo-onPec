const information = document.querySelector('#versions');
information.innerText = `
  ONPEC Mode: ${window.versions.onPec()}
  Chrome (v${window.versions.chrome()})
  Node.js (v${window.versions.node()})
  Electron (v${window.versions.electron()})
`;

window.api.introLog((event, obj) => {
  const slogan = document.querySelector('#slogan');
  const titleIntro = slogan.querySelector('h4');
  const msgIntro = slogan.querySelector('p');
  
  titleIntro.innerText = obj.step;
  msgIntro.innerText = obj.msg;
});
