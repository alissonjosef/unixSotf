const router = require("express").Router();
const { userRegister } = require("../controllers/userController");
const Company = require("../../models/Company");
router.use((req, res, next) => {
  //console.log('Called: ', req.user.user.perfil);
  if (req.auth.profile != "ADMIN") {
    return res.status(401);
  }
  next();
});

router.post("/company", async (req, res) => {
  const { email, name, cnpj, phone } = req.body;

  if (!email | !name | !cnpj | !phone) {
    return res.status(400).json({ msg: "Campo invalido" });
  }

  const passwordUnique = "@unix";

  const user = await userRegister({
    name: name,
    cpf: cnpj,
    email: email,
    registry: cnpj,
    phone: phone,
    password: passwordUnique,
  },"SUPERVISOR", res);

  const company = new Company({
    name,
    cnpj,
    email,
    phone,
    master: user._id,
  });

  await company.save();
  
  
    console.log(company);
    user.company = company._id;

    await user.save()
  

  res.status(200).json(company);
});

module.exports = router;
