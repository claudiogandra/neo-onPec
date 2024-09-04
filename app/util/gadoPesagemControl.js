
// CRIA OU ATUALIZA UM REGISTRO DE PESAGEM
const upsertBrincoData = async () => {
  const fieldsChecked = await validField();

  if (fieldsChecked !== true) {
    console.log('AQUI', brincoChecked, fieldsChecked);

    await disableGadoDesc();
    await toogleActionBtn(formBtns, false);

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

// CAPTURA O BRINCO DIGITADO, VALIDA, E LISTA CASO ATENDER OS REQS
const getBrincoData = async () => {
  const brincoValue = brinco.value;

  if (MANIPULATE.brinco === brincoValue) {
    return null;
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

    await scanFields();
    return false;
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
    
    await toogleActionBtn([btnAdd, btnRemove], false);
    await toogleActionBtn([btnClean], true);

    raca.focus();
    MANIPULATE.acao = 'create';
    FOCUS = raca;

    await scanFields()
    return true;
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

    return true;
  }

  // SE EXISTIREM EVENTOS, ENTRA NO MODO DE INSERT
  MANIPULATE.acao = 'insert';

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
    // SE EXISTIR EVENTO IGUAL A DATA ATUAL, ENTRA NO MODO DE UPSERT
    MANIPULATE.acao = 'upsert';
    
    const firstRow = tbody.querySelector('tr:first-child');
    firstRow.style.backgroundColor = 'var(--marker-line)';
    
    if (btnRemove.className.includes('hide')) btnRemove.classList.remove('hide');
    btnAdd.textContent = 'Alterar Peso';
  }

  // SE A FASE DO GADO FOR 'A', O CICLO DO GADO FOI ENCERRADO
  // NENHUM DADO NOVO PODERA SER INSERIDO
  if (gadoEventos[0].dataValues.fase === 'A') {
    // DESABILITA O MODO DE ACOES
    MANIPULATE.acao = null;
    await toogleActionBtn([btnAdd, btnClean], false);
    
    await disableFields();

    brinco.focus();
    MANIPULATE.acao = null;

    await modalShow(
      `O ciclo do brinco "${gadoEventos[0].dataValues.brinco}" está completo!`,
      'BRINCO EMBARCADO',
      true
    )

    await scanFields()

    return 'A';
  }

  await scanFields()
  lote.focus();
  return true;
}
