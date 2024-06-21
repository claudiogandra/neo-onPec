let inProgress = false;
let closeClicked = false;

const modalHide = async () => {
  const overlay = document.getElementById('modal-overlay');
  const modal = document.getElementById('modal-progress');

  overlay.classList.add('hide');
  modal.classList.add('hide');

  modal.querySelector('section > label').innerHTML = '';
  modal.querySelector('section > p').innerHTML = '';

  inProgress = false;
  return;
}

const modalMsg = async (text, title = false, closeClick = false, icon = false) => {
  const modal = document.getElementById('modal-progress');

  closeClicked = (closeClick) ? true : false;
  
  inProgress = true;

  if (icon !== false) text = `
    <svg class="status-sync spin360" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="30" height="30">
      <path d="M142.9 142.9c62.2-62.2 162.7-62.5 225.3-1L327 183c-6.9 6.9-8.9 17.2-5.2 26.2s12.5 14.8 22.2 14.8H463.5c0 0 0 0 0 0H472c13.3 0 24-10.7 24-24V72c0-9.7-5.8-18.5-14.8-22.2s-19.3-1.7-26.2 5.2L413.4 96.6c-87.6-86.5-228.7-86.2-315.8 1C73.2 122 55.6 150.7 44.8 181.4c-5.9 16.7 2.9 34.9 19.5 40.8s34.9-2.9 40.8-19.5c7.7-21.8 20.2-42.3 37.8-59.8zM16 312v7.6 .7V440c0 9.7 5.8 18.5 14.8 22.2s19.3 1.7 26.2-5.2l41.6-41.6c87.6 86.5 228.7 86.2 315.8-1c24.4-24.4 42.1-53.1 52.9-83.7c5.9-16.7-2.9-34.9-19.5-40.8s-34.9 2.9-40.8 19.5c-7.7 21.8-20.2 42.3-37.8 59.8c-62.2 62.2-162.7 62.5-225.3 1L185 329c6.9-6.9 8.9-17.2 5.2-26.2s-12.5-14.8-22.2-14.8H48.4h-.7H40c-13.3 0-24 10.7-24 24z"/>
    </svg>
    ${text}
  `
  
  modal.querySelector('section > p').innerHTML = text;
  if (title !== false) modal.querySelector('section > label').innerHTML = title;

  await new Promise(resolve => setTimeout(resolve, 3000));

  return;
}

const modalShow = async (text, title, closeClick = false) => {
  const overlay = document.getElementById('modal-overlay');
  const modal = document.getElementById('modal-progress');

  closeClicked = (closeClick) ? true : false;
  
  inProgress = true;
  
  modal.querySelector('section > p').innerHTML = text;
  modal.querySelector('section > label').innerHTML = title;

  overlay.classList.remove('hide');
  modal.classList.remove('hide');

  await new Promise(resolve => setTimeout(resolve, 3000));

  return;
}

window.modal.update(async (event, obj) => {  
  if ('msg' in obj) await modalMsg(
    obj.msg,
    ('step' in obj) ? `${obj.step}` : false,
    false,
    true
  )
});

// Seleciona todos os elementos com a classe 'nav-btn'
const navBtns = document.querySelectorAll('.nav-btn');

// Itera sobre cada elemento
navBtns.forEach(async (btn) => {
    // Adiciona um listener de clique a cada elemento
    btn.addEventListener('click', async () => {
        // Obtém o valor do atributo 'url' do elemento clicado
        const url = btn.getAttribute('url');
        
        const href = ((window.location.href).split('/')).reverse();
        const page = href[0].split('.')[0];
        
        // Redireciona para a URL correspondente
        if (url !== page) await window.nav.location(url); // Adaptado a estrutura dos arquivos
    });
});

document.getElementById('sync').addEventListener('click', async () => {

  document.querySelector('#sync > svg').classList.add('spin360');
  document.querySelector('#sync > label').innerHTML = 'Sincronizando';
  
  await modalShow(
    `
      <svg class="status-sync spin360" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="30" height="30">
        <path d="M142.9 142.9c62.2-62.2 162.7-62.5 225.3-1L327 183c-6.9 6.9-8.9 17.2-5.2 26.2s12.5 14.8 22.2 14.8H463.5c0 0 0 0 0 0H472c13.3 0 24-10.7 24-24V72c0-9.7-5.8-18.5-14.8-22.2s-19.3-1.7-26.2 5.2L413.4 96.6c-87.6-86.5-228.7-86.2-315.8 1C73.2 122 55.6 150.7 44.8 181.4c-5.9 16.7 2.9 34.9 19.5 40.8s34.9-2.9 40.8-19.5c7.7-21.8 20.2-42.3 37.8-59.8zM16 312v7.6 .7V440c0 9.7 5.8 18.5 14.8 22.2s19.3 1.7 26.2-5.2l41.6-41.6c87.6 86.5 228.7 86.2 315.8-1c24.4-24.4 42.1-53.1 52.9-83.7c5.9-16.7-2.9-34.9-19.5-40.8s-34.9 2.9-40.8 19.5c-7.7 21.8-20.2 42.3-37.8 59.8c-62.2 62.2-162.7 62.5-225.3 1L185 329c6.9-6.9 8.9-17.2 5.2-26.2s-12.5-14.8-22.2-14.8H48.4h-.7H40c-13.3 0-24 10.7-24 24z"/>
      </svg>
      Sincronizando dados locais com a nuvem . . .
    `,
    `
      Sincronizar com a Nuvem
    `
  );
  
  const Sync = await window.data.sync();
  
  if (Sync) await modalMsg(
    'Sincronização Concluída'
  );
  
  await modalHide();
  document.querySelector('#sync > svg').classList.remove('spin360');
  document.querySelector('#sync > label').innerHTML = 'Sincronizar';
});
    
document.getElementById('toggle-dark-mode').addEventListener('click', async () => {
  const isDarkMode = await window.darkMode.toggle();

  await modalShow(isDarkMode ? 'Configurando Modo Dark' : 'Configurando Modo Light', 'Alterar Tema');
  
  document.querySelector('#toggle-dark-mode h4').innerHTML = isDarkMode ? 'Modo Escuro' : 'Modo Claro';

  const toogleButton = document.querySelector('#toggle-dark-mode > i');
  toogleButton.classList.remove('fa-toggle-on', 'fa-toggle-off');
  toogleButton.classList.add(isDarkMode ? 'fa-toggle-on' : 'fa-toggle-off');
  
  await modalHide();
});

document.getElementById('ajuda').addEventListener('click', async () => {
  await modalShow(
    `
    <strong>Email: <a href="mailto:dev@gruporoncador.com.br">dev@gruporoncador.com.br</a></strong>
    ONPEC Mode: ${window.versions.onPec()}<br>
    Chrome (v${window.versions.chrome()})<br>
    Node.js (v${window.versions.node()})<br>
    Electron (v${window.versions.electron()})
    `,
    'Sobre o ON PEC',
    true
  )
});

document.getElementById('menu-button').addEventListener('click', async () => {
  document.querySelector('header').classList.toggle('hide');
});

document.getElementById('close-button').addEventListener('click', async () => {
  document.querySelector('header').classList.toggle('hide');
});

document.getElementById('modal-overlay').addEventListener('click', async () => {
  if (closeClicked) await modalHide();
});

document.addEventListener('click', function(event) {
  const header = document.querySelector('header');
  const btnMenu = document.querySelector('#menu-button');
  
  if (!header.contains(event.target) &&
  !btnMenu.contains(event.target) && 
    !header.classList.contains('hide')
  ) {
    header.classList.add('hide');
  }
});

window.addEventListener('beforeunload', function(event) {
  if (inProgress) {
    event.preventDefault();
    //event.returnValue = ''; // Para navegadores antigos
  }

  return;
});
