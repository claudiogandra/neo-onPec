const information = document.getElementById('info');
information.innerText = `
  ONPEC Mode: ${window.versions.onPec()}
  Chrome (v${window.versions.chrome()})
  Node.js (v${window.versions.node()})
  Electron (v${window.versions.electron()})
`;

document.getElementById('toggle-dark-mode').addEventListener('click', async () => {
  const isDarkMode = await window.darkMode.toggle();
  document.getElementById('theme-source').innerHTML = isDarkMode ? 'Dark' : 'Light';
});

document.getElementById('reset-to-system').addEventListener('click', async () => {
  await window.darkMode.system();
  document.getElementById('theme-source').innerHTML = 'System';
});
