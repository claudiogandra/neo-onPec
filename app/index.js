const information = document.getElementById('info');
information.innerText = `
  ONPEC Mode: ${window.versions.onPec()}
  Chrome (v${window.versions.chrome()})
  Node.js (v${window.versions.node()})
  Electron (v${window.versions.electron()})
`;

document.getElementById('reset-to-system').addEventListener('click', async () => {
  await window.darkMode.system();
  document.getElementById('theme-source').innerHTML = 'System';
  document.querySelector('#toggle-dark-mode h4').innerHTML = 'Modo Sistema';

  const toogleButton = document.querySelector('#toggle-dark-mode > i');
  toogleButton.classList.remove('fa-toggle-on', 'fa-toggle-off');
  toogleButton.classList.add('fa-toggle-on');
});
    
document.getElementById('toggle-dark-mode').addEventListener('click', async () => {
  const isDarkMode = await window.darkMode.toggle();
  document.getElementById('theme-source').innerHTML = isDarkMode ? 'Dark' : 'Light';
  document.querySelector('#toggle-dark-mode h4').innerHTML = isDarkMode ? 'Modo Escuro' : 'Modo Claro';

  const toogleButton = document.querySelector('#toggle-dark-mode > i');
  toogleButton.classList.remove('fa-toggle-on', 'fa-toggle-off');
  toogleButton.classList.add(isDarkMode ? 'fa-toggle-on' : 'fa-toggle-off');
});

document.getElementById('menu-button').addEventListener('click', async () => {
  document.querySelector('header').classList.toggle('hide');
});

window.menu.get().then(headerContent => {
  if (headerContent) {
    const nav = document.querySelector('header nav');
    nav.innerHTML = `${headerContent}`;
    
  } else {
    console.error('Header não definido', headerContent);
  }
});
