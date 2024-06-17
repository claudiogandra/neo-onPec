const router = require('express').Router();

// Rota para a página inicial (index.ejs)
router.get('/', (req, res) => {
  res.render('../app/index.ejs');
});

// Rota para outra página (outraPagina.ejs)
router.get('/gado-pesagem/gado-pesagem', (req, res) => {
  res.render('../app/gado-pesagem/gado-pesagem.ejs');
});

// Rota para outra página (outraPagina.ejs)
router.get('/gado/gado-manejo', (req, res) => {
  res.render('../app/gado-manejo/gado-manejo.ejs');
});

module.exports = router;
