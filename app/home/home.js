document.addEventListener('DOMContentLoaded', async () => {
  const topbarTitle = document.querySelector('#topbar-title');
  topbarTitle.textContent = document.title.split(' | ')[0];

  // Dados necessários
  const infoItems = await window.data.fastInfo(); // Resumo de dados
  const blockItems = await window.data.blockItems(); // Lista de blocos

  // Resumo de dados - Renderizacao
  const headerMain = document.getElementById('main__crossing-container');

  headerMain.innerHTML = `
    <div class="main__crossing-image">
    </div>
    <div class="main__crossing-current">
      <p class="main__crossing-upper">
        Gerenciamento de Gado
      </p>
      <h3 class="main__crossing-heading">
        Fazenda Mantiqueira
      </h3>
    </div>
  `;

  const fastInfo = document.getElementById('fast-info');
  
  for (const info of infoItems) {
    const el = document.createElement('h2');
    el.classList.add('main__discover-heading');
    el.classList.add('ss-heading');

    el.innerHTML = `${info.title}: <strong>${info.description}</strong>`;

    fastInfo.appendChild(el);
  };

  // Lista de blocos - Renderizacao
  const blockList = document.getElementById('main__block-list');

  blockItems.forEach((item, index) => {
    const el = document.createElement('li');
    el.classList.add('main__discover-place');

    el.innerHTML = `
      <div class="main__discover__more">
        <div class="main__discover__more-svg svg-block-icon ${item.blocksColorClass}">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 23 22">
            <defs>
              <linearGradient id="myGradient${index + 1}" gradientTransform="rotate(20)">
                <stop offset="0%" stop-color="${item.svgColor}" />
                <stop offset="50%" stop-color="${item.svgColor}" />
              </linearGradient>
            </defs>
            <path fill="url(#myGradient${index + 1})" d="M11 17a1 1 0 001.447.894l4-2A1 1 0 0017 15V9.236a1 1 0 00-1.447-.894l-4 2a1 1 0 00-.553.894V17zM15.211 6.276a1 1 0 000-1.788l-4.764-2.382a1 1 0 00-.894 0L4.789 4.488a1 1 0 000 1.788l4.764 2.382a1 1 0 00.894 0l4.764-2.382zM4.447 8.342A1 1 0 003 9.236V15a1 1 0 00.553.894l4 2A1 1 0 009 17v-5.764a1 1 0 00-.553-.894l-4-2z" />
          </svg>
        </div>
        <a href="${item.href}">
          <div class="main__discover__more-svg ${item.moreIconClass}">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
              <defs>
                <linearGradient id="svg-bg-${index + 1}">
                  <stop offset="0%" stop-color="hsl(0, 0%, 100%)" />
                </linearGradient>
              </defs>
              <path fill="url(#svg-bg-${index + 1})" d="M438.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L338.8 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l306.7 0L233.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z" />
            </svg>
          </div>
        </a>
      </div>
      <h4 class="main__discover-place-heading">${item.heading}</h4>
      <p class="main__discover-place-sub">${item.subheading}</p>
    `;

    blockList.appendChild(el);
  });
});
