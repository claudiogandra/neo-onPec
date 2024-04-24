const information = document.getElementById('info');
information.innerText = `
  ONPEC Mode: ${window.versions.onPec()}
  Chrome (v${window.versions.chrome()})
  Node.js (v${window.versions.node()})
  Electron (v${window.versions.electron()})
`;

const modalHide = async () => {
  const modal = document.getElementById('modal-progress');

  modal.classList.add('hide');
  modal.querySelector('div > section > h4').textContent = '';
  modal.querySelector('div > section > p').textContent = '';

  return;
}

const modalShow = async (title, text) => {
  const modal = document.getElementById('modal-progress');
  
  modal.querySelector('div > section > h4').textContent = title;
  modal.querySelector('div > section > p').textContent = text;
  modal.classList.remove('hide');

  await new Promise(resolve => setTimeout(resolve, 3000));

  return;
}

document.getElementById('reset-to-system').addEventListener('click', async () => {

  await modalShow('Alterar Tema', 'Alterando tema para o padrão do sistema');

  await window.darkMode.system();
  document.getElementById('theme-source').innerHTML = 'System';
  document.querySelector('#toggle-dark-mode h4').innerHTML = 'Modo Sistema';

  const toogleButton = document.querySelector('#toggle-dark-mode > i');
  toogleButton.classList.remove('fa-toggle-on', 'fa-toggle-off');
  toogleButton.classList.add('fa-toggle-on');

  await modalHide();
});
    
document.getElementById('toggle-dark-mode').addEventListener('click', async () => {
  const isDarkMode = await window.darkMode.toggle();

  await modalShow('Alterar Tema', isDarkMode ? 'Configurando Modo Dark' : 'Configurando Modo Light');
  
  document.getElementById('theme-source').innerHTML = isDarkMode ? 'Dark' : 'Light';
  document.querySelector('#toggle-dark-mode h4').innerHTML = isDarkMode ? 'Modo Escuro' : 'Modo Claro';

  const toogleButton = document.querySelector('#toggle-dark-mode > i');
  toogleButton.classList.remove('fa-toggle-on', 'fa-toggle-off');
  toogleButton.classList.add(isDarkMode ? 'fa-toggle-on' : 'fa-toggle-off');
  
  await modalHide();
});

document.getElementById('menu-button').addEventListener('click', async () => {
  document.querySelector('header').classList.toggle('hide');
});

document.getElementById('close-button').addEventListener('click', async () => {
  document.querySelector('header').classList.toggle('hide');
});

