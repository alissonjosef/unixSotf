const router = require("express").Router();
const { userRegister } = require("../controllers/userController");
const Company = require("../../models/Company");

router.use((req, res, next) => {
  console.log('Called: ', req.auth.profile);
  if (req.auth.profile != "ADMIN") {
    return res.status(401).json({ msg: 'Não autorizado'});
  }
  next();
});

router.post("/company", async (req, res) => {
  const { email, name, cnpj, phone } = req.body;

  try {
    if (!email | !name | !cnpj | !phone) {
      return res.status(400).json({ msg: "Campo invalido" });
    }
  
    const companyWithCnpj = await Company.findOne({cnpj});
    if(companyWithCnpj){
      return res.status(400).json({msg : 'CNPJ já cadastrado'});
    }

    const companyWithEmail = await Company.findOne({email});
    if(companyWithEmail){
      return res.status(400).json({msg : 'E-mail já cadastrado'});
    }

    const passwordUnique = "@unix";
  
    const user = await userRegister(
      {
        name: name,
        cpf: cnpj,
        email: email,
        registry: cnpj,
        phone: phone,
        password: passwordUnique,
      },
      "SUPERVISOR",
      res
    );
  
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
  
    await user.save();
  
    res.status(200).json(company);
    
  } catch (error) {
    res.status(500).json({ msg : 'Erro interno'})
  }
});

router.put("/company/:id", async (req, res) => {
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

  return res.status(200).json({msg: 'Registro Atualizado'});
});

router.get("/company", async (req, res) => {
  try {
    const company = await Company.find();
    
    res.status(200).json(company);
  } catch (error) {
    res.status(200).json({ error: error });
  }
});

module.exports = router;
