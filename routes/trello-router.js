const express = require("express");

const TrelloCtrl = require("../controllers/trello-ctrl");

const router = express.Router();
const auth = require("../middleware/auth");

router.post("/signup", TrelloCtrl.signup);
router.post("/login", TrelloCtrl.login);
router.post("/getUser", auth, TrelloCtrl.getUser);
router.post("/boardCreate", auth, TrelloCtrl.boardCreate);
router.post("/editUserInfo", auth, TrelloCtrl.editUserInfo);
router.post("/deleteAccount", auth, TrelloCtrl.deleteAccount);
router.post("/containerCreate", auth, TrelloCtrl.containerCreate);
router.post("/boardDelete", auth, TrelloCtrl.boardDelete);
router.post("/boardEdit", auth, TrelloCtrl.boardEdit);
router.post("/cardCreate", auth, TrelloCtrl.cardCreate);
router.get("/getCards", auth, TrelloCtrl.getCards);
router.get("/getContainers", auth, TrelloCtrl.getContainers);
router.post("/containerDelete", auth, TrelloCtrl.containerDelete);
router.post("/containerEdit", auth, TrelloCtrl.containerEdit);
router.post("/cardDelete", auth, TrelloCtrl.cardDelete);
router.post("/cardEdit", auth, TrelloCtrl.cardEdit);

// router.post("/logout", TrelloCtrl.logout);
// router.delete("/containerDelete", TrelloCtrl.containerDelete);
// router.put("/editName", TrelloCtrl.editName);
// router.put("/editEmail", TrelloCtrl.editEmail);
// router.put("/editPassword", TrelloCtrl.editPassword);
// router.delete("/deleteAccount", TrelloCtrl.deleteAccount);

// router.put("/trello/:id", TrelloCtrl.updateUser);
// router.delete("/trello/:id", TrelloCtrl.deleteUser);
// router.get("/trello/:id", TrelloCtrl.getUserById);
// router.get("/trellos", TrelloCtrl.getUsers);

module.exports = router;
