const form = document.querySelector('#form-gado-pesagem');
const brinco = form.querySelector('#brinco');
const lote = form.querySelector('#lote');
const pasto = form.querySelector('#pasto');
const fase = form.querySelector('#fase');
const novoPeso = form.querySelector('#novo-peso');
const btnPesagem = form.querySelector('btn-pesagem');
const btnRemove = form.querySelector('#btn-remove');
const btnCancel = form.querySelector('#btn-cancel');
let MANIPULATE;

const checkBrinco = async () => {
  const value = brinco.value;
  if (!value) {
    return false;
  }

  if (value.length < 4 || value.length > 20) {
    return false;
  }

  if (!/[a-zA-Z0-9]+$/.test(value)) {
    return false;
  }

  return true;
}

const updateFastInfo = async () => {
  // Dados necessários
  const infoItems = await window.data.fastInfo(); // Resumo de dados

  const fastInfo = document.getElementById('fast-info');
  fastInfo.innerHTML = '';
  
  for (const info of infoItems) {
    const el = document.createElement('h2');
    el.innerHTML = `${info.title}: <strong>${info.description}</strong>`;

    fastInfo.appendChild(el);
  };
}

const listLotes = async () => {
  const list = await window.data.list({ table: 'GadoLote' });
  const select = document.getElementById('lote');
  
  for (const listItem of list) {
    const opt = document.createElement('option');
    opt.value = listItem.dataValues.lote;
    opt.textContent = listItem.dataValues.lote;

    select.appendChild(opt);
  }
}

const listPastos = async () => {
  const list = await window.data.list({ table: 'GadoPasto' });
  const select = document.getElementById('pasto');

  for (const listItem of list) {
    const opt = document.createElement('option');
    opt.value = listItem.dataValues.pasto;
    opt.textContent = listItem.dataValues.pasto;

    select.appendChild(opt);
  }
}

const listFases = async () => {
  const list = await window.data.list({ table: 'GadoFase' });
  const select = document.getElementById('fase');

  for (const listItem of list) {
    const opt = document.createElement('option');
    opt.value = listItem.dataValues.codigo;
    opt.textContent = listItem.dataValues.fase;

    select.appendChild(opt);
  }
}

const listGadoEventos = async () => {

  const gadoEventos = (await checkBrinco() === true)
    ? await window.data.list({
      table: 'GadoEventos',
      filters: {
        brinco: brinco.value,
        peso: true
      }
    })
    : [];

  const thead = document.querySelector('#gado-eventos table thead');
  const tbody = document.querySelector('#gado-eventos table tbody');

  thead.replaceChildren('');
  tbody.replaceChildren('');

  if (gadoEventos.length > 0) {
    let check = true;

    for (const listItem of gadoEventos) {
      const row = document.createElement('tr');

      if (check === true) {
        const th = document.createElement('tr');

        for (const props in listItem.dataValues) {
          if (props !== 'id' && props !== 'createdAt' && props !== 'updatedAt') {
            const thBrinco = document.createElement('th');
            thBrinco.textContent = props;
            th.appendChild(thBrinco);
          }
        }
        
        thead.appendChild(th);

        if (listItem.dataValues.data === new Date().toISOString().split('T')[0]) {
          row.style.backgroundColor = 'var(--marker-line)';
        }

        check = false;
        MANIPULATE = listItem.dataValues;
      }

      for (const props in listItem.dataValues) {
        if (props !== 'id' && props !== 'createdAt' && props !== 'updatedAt') {
          const td = document.createElement('td');
          
          if (props === 'data') {
            const dataParts = listItem.dataValues[props].split('-');
            td.textContent = `${dataParts[2]}/${dataParts[1]}/${dataParts[0]}`;
            
          } else if (props === 'fase' && !listItem.dataValues[props]) {
            td.textContent = '-';
          } else {
            td.textContent = listItem.dataValues[props];
          }
          
          row.appendChild(td);
        }
      }

      tbody.appendChild(row);
    }

    lote.removeAttribute('disabled');
    pasto.removeAttribute('disabled');
    fase.removeAttribute('disabled');
    novoPeso.removeAttribute('disabled');
    lote.focus();

  } else {
    lote.setAttribute('disabled', '');
    pasto.setAttribute('disabled', '');
    fase.setAttribute('disabled', '');
    novoPeso.setAttribute('disabled', '');
    thead.replaceChildren('');
    tbody.replaceChildren('');
    brinco.focus();
  }
  return;
}

brinco.focus();

brinco.addEventListener('blur', async () => {
  await listGadoEventos();
});

brinco.addEventListener('input', async (event) => {
  const regex = /^[a-zA-Z0-9]+$/; // Expressão regular para letras e números

  if (brinco.value.length > 20) {
    brinco.value = brinco.value.slice(0, 20);
  }

  if (!regex.test(brinco.value)) {
    brinco.value = brinco.value.slice(0, -1);

  } else {
    brinco.value = brinco.value.toUpperCase(); // Converte o valor para maiúsculas
  }
});

brinco.addEventListener('keydown', async (event) => {
  if (event.keyCode === 13 || event.keyCode === 9) {
    event.preventDefault();
    brinco.blur();
  }
});

document.addEventListener('DOMContentLoaded', async () => {
  const topbarTitle = document.querySelector('#topbar-title');
  topbarTitle.textContent = document.title.split(' | ')[0];

  await updateFastInfo();
  await listLotes();
  await listPastos();
  await listFases();
});
