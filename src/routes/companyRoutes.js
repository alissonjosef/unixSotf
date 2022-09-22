const router = require("express").Router();

const Headset = require("../../models/Headset");

router.use((req, res, next) => {
  console.log("Called: ", req.auth.profile);
  if (req.auth.profile != "SUPERVISOR") {
    return res.status(401).json({ msg: 'Não autorizado' });
  }
  next();
});

router.get("/relatorio/:id", async (req, res) => {
  return res.status(200).json({ msg: `Relatório da data ${req.query.data}` });
});

router.post("/headset", async (req, res) => {
  const { model, serial_number, locale } = req.body;

  if (!model | !serial_number | !locale) {
    return res.status(400).json({ msg: "Campo invalido" });
  }
  try {

    const headset = new Headset({
      model,
      serial_number,
      locale,
      company: req.auth.company
    });

    await headset.save();
    res.status(200).json(headset);
  } catch (error) {
    await tryError(error, res)
  }

});

router.get("/headset", async (req, res) => {
  return res.status(200)
    .json(await Headset.find({ company: req.auth.company }));
});

router.put("/headset", async (req, res) => {

  const { _id, model, serial_number, locale, status } = req.body;
  
  try {
    let headset = await Headset.findByIdAndUpdate(_id, {
      model, serial_number, locale, status
    });
    if(!headset){
      return res.status(404).json({msg : "Não encontrado"})
    }

    res.status(200).json({msg : "Atualizado com sucesso"})
    
  } catch (error) {
    await tryError(error, res)
  }
});









async function tryError(error, res) {
  
  if (error.name === "ValidationError") {
    let errors = {};

    Object.keys(error.errors).forEach((key) => {
      errors[key] = error.errors[key].message;
    });

    return res.status(400).send(errors);
  }
  console.log(error)
  res.status(500).json({ msg: "Erro interno no servidor" });
}

module.exports = router;
