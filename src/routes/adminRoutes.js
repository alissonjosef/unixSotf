/* module.exports = (express) => {
    const router = express.Router();
    console.log("OIIIII")

    const PROFILE = "ADMIN"

    router.post("/company", async (req, res) => {
        console.log("REQ")
        console.log(req)
        res.status(200)
    })

    return router
} */

const router = require("express").Router();

const PROFILE = "ADMIN";

router.post("/company", async (req, res) => {
    res.status(200)
  });
  

module.exports = router;
