const express = require('express');

const router = express.Router();

const authRoutes = require("./authRoutes");
const adminRoutes = require("./adminRoutes");
const companyRoutes = require("./companyRoutes");
const operadorRoutes = require("./operadorRoutes");

router.use("/auth", authRoutes);
router.use("/admin", adminRoutes);
router.use("/company", companyRoutes);
router.use("/operador", operadorRoutes);

// router.get('*', function(req, res){
//     res.status(404).json({msg : 'what?'})
//   });
// router.put('*', function(req, res){
//     res.status(404).json({msg : 'what?'})
//   });
// router.post('*', function(req, res){
//     res.status(404).json({msg : 'what?'})
// });

module.exports = router