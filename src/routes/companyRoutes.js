const router = require("express").Router();
const { userRegister } = require("../controllers/userController");
const Headset = require("../../models/Headset");

router.use((req, res, next) => {
  console.log("Called: ", req.auth.profile);
  if (req.auth.profile != "SUPERVISOR") {
    return res.status(401);
  }
  next();
});

router.get("/relatorio/:id", async (req, res) => {
  console.log("oiii");
  return res.status(200);
});

router.post("/headset", async (req, res) => {
  const { model, serial_number, locale } = req.body;
  console.log("Oiiii");

  if (!model | !serial_number | !locale) {
    return res.status(400).json({ msg: "Campo invalido" });
  }

  const headset = new Headset({
    model,
    serial_number,
    locale,
  });

  await headset.save();

  res.status(200).json(headset);
});

/* router.put("/company/:id", async (req, res) => {
  const id = req.params.id;

  const { email, name, cnpj, phone, enabled } = req.body;

  const company = {
    email,
    name,
    cnpj,
    phone,
    enabled,
  };

  const updatedCompany = await Company.updateOne({ _id: id }, company);

  return res.status(200).json({ msg: "Registro Atualizado", company });
});

router.get("/company", async (req, res) => {
  try {
    const company = await Company.find();

    res.status(200).json(company);
  } catch (error) {
    res.status(200).json({ error: error });
  }
});
 */
module.exports = router;
