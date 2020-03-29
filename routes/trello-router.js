const express = require("express");

const TrelloCtrl = require("../controllers/trello-ctrl");

const router = express.Router();
const auth = require("../middleware/auth");

router.post("/signup", TrelloCtrl.signup);
router.post("/login", TrelloCtrl.login);
router.post("/getUser", auth, TrelloCtrl.getUser);
router.post("/boardCreate", auth, TrelloCtrl.boardCreate);
router.post("/boardEdit", auth, TrelloCtrl.boardEdit);
router.post("/boardDelete", auth, TrelloCtrl.boardDelete);
router.post("/containerCreate", auth, TrelloCtrl.containerCreate);
router.post("/containerEdit", auth, TrelloCtrl.containerEdit);
router.post("/containerDelete", auth, TrelloCtrl.containerDelete);
router.post("/cardCreate", auth, TrelloCtrl.cardCreate);
router.post("/cardEdit", auth, TrelloCtrl.cardEdit);
router.post("/cardDelete", auth, TrelloCtrl.cardDelete);
router.post("/editUserInfo", auth, TrelloCtrl.editUserInfo);
router.post("/deleteAccount", auth, TrelloCtrl.deleteAccount);
router.get("/getCards", auth, TrelloCtrl.getCards);
router.get("/getContainers", auth, TrelloCtrl.getContainers);
router.post("/changeCardPosition", TrelloCtrl.changeCardPosition);

module.exports = router;
