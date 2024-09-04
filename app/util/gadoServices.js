const listGado = async (brinco) => {
  const listGado = await window.data.list({
    table: 'Gado',
    filters: (brinco) ? { brinco: brinco } : {}
  });

  return (listGado.length > 0) ? listGado[0].dataValues : false;
}

const listGadoEventos = async (brinco) => {
  const listEventos = await window.data.list({
    table: 'GadoEventos',
    filters: (brinco) ? { brinco: brinco, peso: true } : {}
  });

  return (listEventos.length > 0) ? listEventos : false;
}

const listRaca = async () => {
  const listRaca = await window.data.list({ table: 'GadoRaca' });

  return (listRaca.length > 0) ? listRaca : false;
}

const listSexo = async () => {
  return [
    { dataValues: { sigla: 'M', sexo: 'Macho' } },
    { dataValues: { sigla: 'F', sexo: 'Fêmea' } }
  ];
}

const listLote = async () => {
  const listLotes = await window.data.list({ table: 'GadoLote' });

  return (listLotes.length > 0) ? listLotes : false;
}

const listPasto = async () => {
  const listPastos = await window.data.list({ table: 'GadoPasto' });

  return (listPastos.length > 0) ? listPastos : false;
}

const listFase = async () => {
  const listFases = await window.data.list({ table: 'GadoFase' });

  return (listFases.length > 0) ? listFases : false;
}

const loadSelectOptions = async (list, element, value, content) => {
  for (const item of list) {
    const opt = new Option(item.dataValues[content], item.dataValues[value]);
    
    if (
      item.dataValues[content] === 'CORRIGIR' ||
      item.dataValues[content] === 'ERROR'
    ) opt.setAttribute('disabled', '');

    element.appendChild(opt);
  }
  
  return;
}

const checkBrinco = async (param) => param && /[A-Z0-9]+$/.test(param) && param.length >= 4 && param.length <= 20;

const checkPeso = async (param) => /^[0-9]{1,3}([.,][0-9]{0,2})?$/.test(param) && param > 25 && param < 1000;

const gmd = async ({ p1, p2, d1, d2 }) => ((p1 - p2) / ((d1 - d2) / (1000 * 60 * 60 * 24))).toFixed(4);
