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
let FOCUS = null;

const checkFields = async (elements) => {
  for (const element of elements) {
    if (
      element.value.trim() === '' ||
      element.value.trim() === '0' ||
      element.value.trim() === '00' ||
      element.value.trim() === 'ERROR' ||
      element.value.trim() === 'LT' ||
      element.value.trim() === 'undefined' ||
      element.value.trim() === 'null'
    ) {
      element.style.border = '1px solid var(--alert)';
      return false;

    } else {
      element.style.border = '';
      return true;
    }
  }

  return null;
}

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

  gadoDesc.style.display = 'flex';

  return;
}

// DESABILITA AS OPCOES DE CADASTRO DO GADO INDIVIDUAL
const disableGadoDesc = async () => {
  raca.selectedIndex = '0';
  raca.setAttribute('disabled', '');
  sexo.selectedIndex = '0';
  sexo.setAttribute('disabled', '');

  gadoDesc.style.display = '';

  return;
}

// HABILITA CAMPOS DE PESAGEM DO FORMULARIO
const enableFields = async (index) => {
  const fields = [ lote, pasto, fase, novoPeso ];

  for (const field of fields) {
    field.removeAttribute('disabled');
    (field !== novoPeso) ? field.selectedIndex = index : field.value = '';
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

const toogleOptionNoChanges = async (selectId, enable) => {
  const selectElement = document.getElementById(selectId);
  if (selectElement) {
    try {
      const option = Array.from(selectElement.options).find(opt => opt.value === '00');
      if (option) {
        if (enable) {
          option.removeAttribute('disabled');
        } else {
          option.setAttribute('disabled', 'disabled');
        }
      }
      return;

    } catch (err) {
      return;
    }
  }
}

// CRIA OU ATUALIZA UM REGISTRO DE PESAGEM
const upsertBrincoData = async () => {
  const activeElem = form.querySelectorAll('input:not([disabled]), select:not([disabled])');
  
  if (!(await checkBrinco(brinco.value)) || !(await checkFields(activeElem))) {
    console.log('AQUI');

    await disableGadoDesc();
    await toogleActionBtn(formBtns, false);

    novoPeso.style.border = '';
    brinco.focus();
    MANIPULATE.brinco = null;
    FOCUS = brinco;
    return;
  };

  console.log({
    acao: MANIPULATE.acao,
    brinco: brinco.value,
    raca: MANIPULATE.acao === 'upsert' || MANIPULATE.acao === 'insert' ? null : raca.value,
    sexo: MANIPULATE.acao === 'upsert' || MANIPULATE.acao === 'insert' ? null : sexo.value,
    lote: lote.value === '00' ? null : lote.value,
    pasto: pasto.value === '00' ? null : pasto.value,
    fase: fase.value === '00' ? null : fase.value,
    peso: novoPeso.value,
  });
}

// CAPUTRA O BRINCO DIGITADO, VALIDA, E LISTA CASO ATENDER OS REQS
const getBrincoData = async () => {
  const brincoValue = brinco.value;

  if (MANIPULATE.brinco === brincoValue) {
    FOCUS.focus();
    return;
  };

  MANIPULATE.brinco = brincoValue;

  await disableFields();
  await toogleOptionNoChanges('lote', true);
  await toogleOptionNoChanges('pasto', true);
  await toogleOptionNoChanges('fase', true);

  table.querySelector('thead').replaceChildren('');
  table.querySelector('tbody').replaceChildren('');

  if (!(await checkBrinco(brincoValue))) {
    await disableGadoDesc();
    
    await toogleActionBtn([btnAdd, btnClean, btnRemove], false);

    brinco.focus();
    MANIPULATE.acao = null;
    FOCUS = brinco;

    await scanFields()
    return;
  };

  // CHAMA A PONTE DE CONTEXTO QUE COMUNICA COM O BACKEND
  // VERIFICA SE O BRINCO EXISTE
  const gado = await listGado(brincoValue);

  // SE BRINCO NAO EXISTE, HABILITA OS CAMPOS DE CADASTRO DO BRINCO
  if (gado === false) {
    await enableGadoDesc();
    await enableFields(0);
    await toogleOptionNoChanges('lote', false);
    await toogleOptionNoChanges('pasto', false);
    await toogleOptionNoChanges('fase', false);

    btnAdd.textContent = 'Criar Brinco';
    
    await toogleActionBtn([btnAdd, btnClean, btnRemove], false);

    raca.focus();
    MANIPULATE.acao = 'create';
    FOCUS = raca;

    await scanFields()
    return;
  }

  // COM O BRINCO VALIDO E CRIADO, LISTA EVENTOS DE PESAGEM
  const gadoEventos = await listGadoEventos(brincoValue);
  FOCUS = lote;

  // SE NAO EXISTIREM EVENTOS, ENTRA NO MODO DE INSERT
  if (gadoEventos === false) {
    await enableFields(0);
    await toogleOptionNoChanges('lote', false);
    await toogleOptionNoChanges('pasto', false);
    await toogleOptionNoChanges('fase', false);

    lote.focus();
    MANIPULATE.acao = 'insert';

    await scanFields()

    return;
  }

  // SE EXISTIREM EVENTOS, ENTRA NO MODO DE UPSERT
  MANIPULATE.acao = 'upsert';

  await enableFields(1);
  await enableGadoDesc(gado);

  // MAPEIA OS DADOS RETORNADOS DO BACKEND
  const lastPesagem = gadoEventos[0].dataValues;
  
  // CARREGA OS VALORES NA TELA
  const thead = document.querySelector('#gado-eventos table thead');
  const tbody = document.querySelector('#gado-eventos table tbody');

  const trHead = document.createElement('tr');

  for (const props in lastPesagem) {
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

  for (let index = 0; index < gadoEventos.length; index++) {
    const listItem = gadoEventos[index];
    const row = document.createElement('tr');
  
    for (const props in listItem.dataValues) {
      if (props !== 'brinco' && props !== 'id' && props !== 'createdAt' && props !== 'updatedAt') {
        const td = document.createElement('td');
  
        if (props === 'data') {
          const dataParts = listItem.dataValues[props].split('-');
          td.textContent = `${dataParts[2]}/${dataParts[1]}/${dataParts[0]}`;

        } else if (!listItem.dataValues[props]) {
          td.textContent = '-';

        } else {
          td.textContent = listItem.dataValues[props];
        }
  
        row.appendChild(td);
      }
    }

    let gmdValue;
  
    if (index + 1 < gadoEventos.length) {
      gmdValue = await gmd({
        p1: gadoEventos[index + 1].dataValues['peso'],
        p2: listItem.dataValues['peso'],
        d1: new Date(gadoEventos[index + 1].dataValues['data']),
        d2: new Date(listItem.dataValues['data'])
      });

    } else {
      gmdValue = '-';
    }

    const gmdTd = document.createElement('td');
    gmdTd.textContent = gmdValue;
    row.appendChild(gmdTd);
  
    tbody.appendChild(row);
  }   

  // HABILITA BOTAO DE LIMPAR CAMPOS E DESABILITA BOTAO DE REMOVER POR PADRAO
  await toogleActionBtn([btnClean], true);
  await toogleActionBtn([btnRemove], false);

  // TROCA TEXTO DE BOTAO DA PESAGEM PARA O CONTEXTO PADRAO DE INSERT
  btnAdd.textContent = 'Adicionar Peso';

  // VERIFICA SE EVENTO MAIS RECENTE TEM A DATA ATUAL
  // SE TIVER DATA ATUAL O VALOR DO FORMULARIO IRA ALTERAR OS VALORES DO EVENTO
  // NAO PODE EXISTIR MAIS DE UM EVENTO POR DIA POR GADO
  if (gadoEventos[0].dataValues.data === new Date().toISOString().split('T')[0]) {
    const firstRow = tbody.querySelector('tr:first-child');
    firstRow.style.backgroundColor = 'var(--marker-line)';
    
    if (btnRemove.className.includes('hide')) btnRemove.classList.remove('hide');
    btnAdd.textContent = 'Alterar Peso';
  }

  // SE A FASE DO GADO FOR IGUAL A 'A', O CICLO DO GADO FOI ENCERRADO
  // NENHUM DADO NOVO PODERA SER INSERIDO
  if (gadoEventos[0].dataValues.fase === 'A') {
    await toogleActionBtn([btnAdd, btnClean], false);
    
    await disableFields();

    brinco.focus();
    MANIPULATE.acao = null;
    FOCUS = brinco;

    await modalShow(
      `O ciclo do brinco "${gadoEventos[0].dataValues.brinco}" está completo!`,
      'BRINCO EMBARCADO',
      true
    )

    await scanFields()

    return;
  }

  await scanFields()
  lote.focus();
  return;
}

const inputPeso = async () => {
  activeElements = form.querySelectorAll('input:not([disabled]), select:not([disabled]), button:not([disabled])');
  if (!(await checkPeso(parseFloat(novoPeso.value)))) {
    await toogleActionBtn([btnAdd], false);

    novoPeso.style.border = '1px solid var(--alert)';
    novoPeso.value = '';
    novoPeso.focus();
    
  } else {
    if (!(await checkFields(activeElements))) {
      await toogleActionBtn(formBtns, false);

    } else {
      await toogleActionBtn([btnAdd, btnClean], true);
      btnAdd.focus();
    }
  }
}

const inputRules = async (element, chars, regex) => {
  let elementValue = element.value.toUpperCase();

  if (elementValue.length > chars) {
    elementValue = elementValue.slice(0, chars);
  }

  if (!regex.test(elementValue) && elementValue.length > 0) {
    elementValue = elementValue.slice(0, -1);
    element.style.border = '1px solid var(--alert)';

  } else {
    element.style.border = '';
  }
  
  element.value = elementValue;
  return;
};

const selectRules = async (event, target) => {
  if ((event.keyCode === 13 || event.keyCode === 9) && !event.shiftKey) {
    event.preventDefault();
    switch (target.id) {
      case 'raca':
        sexo.focus();
        break;

      case'sexo':
        lote.focus();
        break;

      case 'lote':
        pasto.focus();
        break;

      case 'pasto':
        fase.focus();
        break;

      case 'fase':
        novoPeso.focus();
        break;
    }
  }
}

const submitRules = async (event, target) => {
  if ((event.keyCode === 13 || event.keyCode === 9) && !event.shiftKey) {
    event.preventDefault();
    target.blur();
  }
}

btnAdd.addEventListener('click', async (event) => {
  event.preventDefault();
  await upsertBrincoData();
});

btnClean.addEventListener('click', async (event) => {
  event.preventDefault();
  await cleanFields();
});

const scanFields = async (activeElements = form.querySelectorAll('input:not([disabled]), select:not([disabled]), button:not([disabled])')) => {  
  console.log('scanFields', Date.now());

  for (const element of activeElements) {
    switch (element.id) {
      case 'brinco':
        element.addEventListener('blur', async () => await getBrincoData());
        element.addEventListener('input', async () => await inputRules(brinco, 20, /[A-Z0-9]+$/));
        element.addEventListener('keydown', async (event) => await submitRules(event, brinco));
        break;

      case 'novo-peso':
        element.addEventListener('input', async () => await inputRules(novoPeso, 6, /^[0-9]{1,3}([.])?([0-9]{1,2})?$/));
        element.addEventListener('keydown', async (event) => await submitRules(event, novoPeso));
        break;

      default:
        if (element.tagName === 'SELECT') {
          element.addEventListener('keydown', async (event) => await selectRules(event, element));
        }
        break;
    }
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  const topbarTitle = document.querySelector('#topbar-title');
  topbarTitle.textContent = document.title.split(' | ')[0];
  
  await updateFastInfo();

  await loadSelectOptions(await listRaca(), raca, 'sigla', 'raca');
  await loadSelectOptions(await listSexo(), sexo, 'sigla', 'sexo');
  await loadSelectOptions(await listLote(), lote, 'lote', 'lote');
  await loadSelectOptions(await listPasto(), pasto, 'pasto', 'pasto');
  await loadSelectOptions(await listFase(), fase, 'sigla', 'fase');

  let activeElements = form.querySelectorAll('input:not([disabled]), select:not([disabled]), button:not([disabled])');
  await scanFields(activeElements);

  brinco.focus();
});
