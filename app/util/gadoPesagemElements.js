// FORM FIELDS
const fastInfo = document.getElementById('fast-info');
const form = document.getElementById('form-gado-pesagem');
const formElements = form.querySelectorAll('input, select');
const formBtns = form.querySelectorAll('button');

const brinco = form.querySelector('#brinco');
const gadoDesc = form.querySelector('#gado-descricao');
const raca = form.querySelector('#raca');
const sexo = form.querySelector('#sexo');
const lote = form.querySelector('#lote');
const pasto = form.querySelector('#pasto');
const fase = form.querySelector('#fase');
const novoPeso = form.querySelector('#novo-peso');
const btnAdd = form.querySelector('#btn-add');
const btnRemove = form.querySelector('#btn-remove');
const btnClean = form.querySelector('#btn-clean');

// TABLE ELEMENTS
const eventos = document.getElementById('gado-eventos');
const table = eventos.querySelector('table');

const MANIPULATE = {
  acao: null,
  brinco: null,
};
let lastPesagem;
let FOCUS = null;

// ATUALIZA OS ITENS DO BANNER
const updateFastInfo = async () => {
  // Dados necessários
  const infoItems = await window.data.fastInfo();

  fastInfo.replaceChildren = '';
  
  for (const info of infoItems) {
    fastInfo.insertAdjacentHTML('beforeend', 
      `<h2>${info.title}: <strong>${info.description}</strong></h2>`);
  };

  return;
}

const setBorder = (element, isValid) => {
  element.style.border = isValid ? '' : '1px solid var(--alert)';
};

// HABILITA AS OPCOES DE CADASTRO DO GADO INDIVIDUAL
const enableGadoDesc = async (gado = false) => {
  if (gado === false) {
    raca.selectedIndex = '0';
    raca.removeAttribute('disabled');
    sexo.selectedIndex = '0';
    sexo.removeAttribute('disabled');

  } else {
    raca.value = `${gado['raca']}`
    raca.setAttribute('disabled', '');
    sexo.value = `${gado['sexo']}`
    sexo.setAttribute('disabled', '');
  }

  return;
}

// DESABILITA AS OPCOES DE CADASTRO DO GADO INDIVIDUAL
const disableGadoDesc = async () => {
  raca.selectedIndex = '0';
  raca.setAttribute('disabled', '');
  sexo.selectedIndex = '0';
  sexo.setAttribute('disabled', '');

  return;
}

// HABILITA CAMPOS DE PESAGEM DO FORMULARIO
const enableFields = async (brincoData) => {
  
  const list = [
    [lote, brincoData.lote || 0],
    [pasto, brincoData.pasto || 0],
    [fase, brincoData.fase || 0],
    novoPeso
  ];

  for (const item of list) {
    if (Array.isArray(item)) {
      const field = item[0];
      const value = item[1];

      field.removeAttribute('disabled');
      field.value = value;

    } else {
      item.removeAttribute('disabled');
      item.value = '';
    }
  }

  return;
}

// DESABILITA CAMPOS DE PESAGEM DO FORMULARIO
const disableFields = async () => {
  const fields = [ lote, pasto, fase, novoPeso ];

  for (const field of fields) {
    field.setAttribute('disabled', '');
    (field !== novoPeso) ? field.selectedIndex = 0 : field.value = '';
  }

  return;
}

// LIMPA OS VALORES PREENCHIDOS DOS CAMPOS DO FORMULARIO
const cleanFields = async () => {
  MANIPULATE.brinco = null;
  await disableGadoDesc();
  await disableFields();

  brinco.focus();
  brinco.select();

  await toogleActionBtn([btnAdd, btnClean], false);

  return;
}

// TOOGLE DOS BOTOES DO FORMULARIO
const toogleActionBtn = async (btns, enable) => {
  for (const btn of btns) {
    if (enable) {
      btn.classList.remove('hide');
      btn.removeAttribute('disabled');
    } else {
      btn.classList.add('hide');
      btn.setAttribute('disabled', '');
    }
  }

  return;
}

const inputRules = async (element) => {
  if (element.value === '') return false;

  const condition = async (el) => {
    switch (el) {
      case 'brinco':
        return { chars: 20, regex: /[A-Z0-9]+$/, limitValue: false };
      case 'novo-peso':
        return { chars: 7, regex: /^[0-9]{1,4}([.])?([0-9]{1,2})?$/, limitValue: 2000 };
      default:
        return false;
    }
  }

  const { chars, regex, limitValue } = await condition(element.id);
  
  let elementValue = element.value.toUpperCase();

  if (elementValue.length > chars) {
    elementValue = elementValue.slice(0, chars);
  }

  if (limitValue != false && elementValue > limitValue) {
    element.value = '';
    return false;
  }

  if (!regex.test(elementValue) && elementValue.length > 0) {
    element.value = elementValue.slice(0, -1);
    setBorder(element, false);
    return false;

  } else {
    element.value = elementValue;
    setBorder(element, true);
    return true;
  }
};

const selectRules = async (target, next) => {
  switch (target.id) {
    case 'raca':
      if (next) {
        sexo.focus();
      } else {
        brinco.focus();
      }
      break;

    case'sexo':
      if (next) {
        lote.focus();
      } else {
        raca.focus();
      }
      break;

    case 'lote':
      if (next) {
        pasto.focus();
      } else {
        console.log(MANIPULATE.acao);
        if (MANIPULATE.acao === 'create') {
          sexo.focus();
        } else {
          brinco.focus();
        }
      }
      break;

    case 'pasto':
      if (next) {
        fase.focus();
      } else {
        lote.focus();
      }
      break;

    case 'fase':
      if (next) {
        novoPeso.focus();
      } else {
        pasto.focus();
      }
      break;

    case 'novo-peso':
      if (next) {
        btnAdd.focus();
      } else {
        fase.focus();
      }
      break;

    default:
      break;
  }
}

const criarTabelaPesagem = async (eventos = false) => {
  if (eventos === false) return;
  const ultimoEvento = eventos[0].dataValues;
  // CARREGA OS VALORES NA TELA
  const thead = document.querySelector('#gado-eventos table thead');
  const tbody = document.querySelector('#gado-eventos table tbody');

  const trHead = document.createElement('tr');

  for (const props in ultimoEvento) {
    if (props !== 'id' && props !== 'brinco' && props !== 'createdAt' && props !== 'updatedAt') {
      const thHead = document.createElement('th');
      thHead.textContent = props;
      trHead.appendChild(thHead);
    }
  }
    
  const gmdTh = document.createElement('th');
  gmdTh.textContent = 'GMD';
  trHead.appendChild(gmdTh);
  
  thead.appendChild(trHead);

  for (let index = 0; index < eventos.length; index++) {
    const listItem = eventos[index].dataValues;
    const row = document.createElement('tr');
  
    for (const props in listItem) {
      if (props !== 'brinco' && props !== 'id' && props !== 'createdAt' && props !== 'updatedAt') {
        const td = document.createElement('td');
  
        if (props === 'data') {
          const dataParts = listItem[props].split('-');
          td.textContent = `${dataParts[2]}/${dataParts[1]}/${dataParts[0]}`;

        } else if (!listItem[props]) {
          td.textContent = '-';

        } else {
          td.textContent = listItem[props];
        }
  
        row.appendChild(td);
      }
    }

    let gmdValue;
  
    if (index + 1 < gadoEventos.length) {
      gmdValue = await gmd({
        p1: gadoEventos[index + 1].dataValues['peso'],
        p2: listItem['peso'],
        d1: new Date(gadoEventos[index + 1].dataValues['data']),
        d2: new Date(listItem['data'])
      });

    } else {
      gmdValue = '-';
    }

    const gmdTd = document.createElement('td');
    gmdTd.textContent = gmdValue;
    row.appendChild(gmdTd);
  
    tbody.appendChild(row);
  }
}
