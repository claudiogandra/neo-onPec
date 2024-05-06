const form = document.querySelector('#form-gado-pesagem');
const brinco = form.querySelector('#brinco');
const btn = form.querySelector('btn-pesagem');

brinco.focus();

brinco.addEventListener('blur', async () => {
  const response = await window.gadoPesagem.list(brinco.value);
  console.log(response);
});

brinco.addEventListener('input', async () => {
  brinco.value = brinco.value.toUpperCase();
});

brinco.addEventListener('keydown', async (event) => {
  if (event.keyCode === 13 || event.keyCode === 9) {
    event.preventDefault();
    brinco.blur();
  }
});
