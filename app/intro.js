const information = document.getElementById('msg');
information.innerText = `
  ONPEC Mode: ${window.versions.onPec()}
  Chrome (v${window.versions.chrome()})
  Node.js (v${window.versions.node()})
  Electron (v${window.versions.electron()})
`;

window.api.introLog((event, obj) => {
  const textField = document.querySelector('#progress');
  textField.innerText = obj;
});
