const validField = async (field = false) => {
  const elements = form.querySelectorAll('input:not([disabled]), select:not([disabled])');
  let result = true;

  const validateBrinco = async (element) => {
    const resultBrinco = await getBrincoData();

    if (resultBrinco === null && field.id === 'brinco') {
      return false;

    } else if (resultBrinco === 'A') {
      elements.forEach(el => {
        if (el.id !== 'brinco') setBorder(el, true);
      });

      return false;
      
    } else {
      setBorder(element, resultBrinco !== false);
      return resultBrinco !== false;
    }
  };

  const validateNovoPeso = async (element) => {
    const isValid = await inputRules(element);
    setBorder(element, isValid);

    return isValid;
  };

  const validateDefault = (element) => {
    const isValid = !(
      element.value === null || 
      element.value === undefined || 
      element.value === '' || 
      element.value === 'ERROR' ||
      element.value === '0' ||
      (MANIPULATE.acao === 'create' && element.value === '00')
    );
    
    setBorder(element, isValid);
    return isValid;
  };

  for (const element of elements) {
    switch (element.id) {
      case 'brinco':
        result = await validateBrinco(element);
        break;
      case 'novo-peso':
        result = await validateNovoPeso(element);
        break;
      default:
        result = validateDefault(element);
        break;
    }
    if (!result) break;
  }

  await toogleActionBtn([btnAdd], result && elements.length > 1);

  if (field === false) return true;
  
  await selectRules(field);
};


const checkFields = async (event, field = false) => {
  if ((event.keyCode === 13 || event.keyCode === 9) && !event.shiftKey) {
    event.preventDefault();
    if (field !== false) field.blur();
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

const scanFields = async () => {
  const elements = form.querySelectorAll('input:not([disabled]), select:not([disabled]), button:not([disabled])');
  for (const element of elements) {
    switch (element.id) {
      case 'brinco':
        element.addEventListener('blur', async () => await validField(element));
        element.addEventListener('input', async () => await inputRules(element));
        element.addEventListener('keydown', async (event) => await checkFields(event, element));
        break;

      case 'novo-peso':
        element.addEventListener('blur', async () => await validField(element));
        element.addEventListener('input', async () => await inputRules(element));
        element.addEventListener('keydown', async (event) => await checkFields(event, element));
        break;

      default:
        if (element.tagName === 'SELECT') {
          element.addEventListener('blur', async () => await validField(element));
          element.addEventListener('keydown', async (event) => await checkFields(event, element));
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

  await scanFields();

  brinco.focus();
})
