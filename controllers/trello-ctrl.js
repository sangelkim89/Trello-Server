const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { User } = require("../db/models/user");
const { Card } = require("../db/models/user");
const { Container } = require("../db/models/user");
signup = async (req, res) => {
  const body = req.body;

  //CRYPTING PASSWORD
  let cipher = crypto.createCipher("aes-256-cbc", "cat");
  let crypted = cipher.update(body.password, "utf8", "hex");
  crypted += cipher.final("hex");
  body.password = crypted;

  await User.findOne({ email: body.email }, (err, user) => {
    if (user) {
      return res.status(400).end("email already exists!");
    } else {
      const user = new User(body);
      user
        .save()
        .then(() => {
          return res.status(200).json({
            success: true,
            message: "user created!"
          });
        })
        .catch(error => {
          return res.status(400).json({
            error,
            message: "user not created!"
          });
        });
    }
  });
};
login = async (req, res) => {
  const body = req.body;

  //CRYPTING PASSWORD
  let cipher = crypto.createCipher("aes-256-cbc", "cat");
  let crypted = cipher.update(body.password, "utf8", "hex");
  crypted += cipher.final("hex");
  body.password = crypted;

  const { email, password } = req.body;
  await User.findOne({ email: email, password: password }, (err, user) => {
    if (err) {
      return res.status(400).end("error...");
    }
    if (!user) {
      return res.status(404).end("User not found");
    }
    let userID = { userID: user._id };
    //SENDING AUTH TOKEN
    let token = jwt.sign(userID, "secret", { expiresIn: "1h" });

    return res.status(200).json({ userID: user._id, token: token });
  }).catch(err => res.status(400).end("error..."));
};
getUser = async (req, res) => {
  const body = req.body;
  const { id } = req.body;
  await User.findOne({ _id: id }, (err, user) => {
    if (err) {
      return res.status(400).end("error...");
    }

    //DECRYPTING CRYPTO
    let decipher = crypto.createDecipher("aes-256-cbc", "cat");
    let dec = decipher.update(user.password, "hex", "utf8");
    dec += decipher.final("utf8");

    user.password = dec;
    return res.status(200).json({ user });
  });
};

boardCreate = async (req, res) => {
  const body = req.body;

  if (!body) {
    return res.status(400).json({
      success: false,
      error: "You must provide a body to update"
    });
  }
  let newBoard = { name: body.newBoardName };
  User.findOne({ _id: body.userID, "boards.name": body.newBoardName }, function(
    error,
    user
  ) {
    if (user) {
      res.status(201).end("board name already exists!");
    } else {
      User.findOneAndUpdate(
        { _id: body.userID },
        { $push: { boards: newBoard } },
        { new: true },
        function(error, user) {
          if (error) {
            res.status(400).end("could not create board");
          } else {
            res.status(200).json({ user });
          }
        }
      );
    }
  });
};
editUserInfo = async (req, res) => {
  const body = req.body;

  let cipher = crypto.createCipher("aes-256-cbc", "cat");
  let crypted = cipher.update(body.password, "utf8", "hex");
  crypted += cipher.final("hex");
  body.password = crypted;

  User.findOneAndUpdate(
    { _id: body.id },
    { name: body.name, email: body.email, password: body.password },
    function(error, success) {
      if (error) {
        res.status(400).end("could not create board");
      } else {
        res.status(200).end("board created!");
      }
    }
  );
};
deleteAccount = async (req, res) => {
  const body = req.body;
  User.findOneAndDelete({ _id: body.id }, function(error, success) {
    if (error) {
      res.status(400).end("could not delete account");
    }
  });
  Container.deleteMany({ userID: body.id }, function(err) {
    if (err) {
      res.status(400).end("failed");
    }
  });
  Card.deleteMany({ userID: body.id }, function(err) {
    if (err) {
      res.status(400).end("failed");
    } else {
      res.status(200).end("account successfully deleted!");
    }
  });
};
containerCreate = async (req, res) => {
  const body = req.body;

  if (!body) {
    return res.status(400).json({
      success: false,
      error: "You must provide a body to update"
    });
  }

  const newContainer = new Container(body);
  newContainer
    .save()
    .then(() => {
      Container.find().then(containers => {
        res.status(200).json({ containers });
      });
    })
    .catch(error => {
      res.status(400).json({ error: error });
    });
};
boardDelete = async (req, res) => {
  const body = req.body;
  if (!body) {
    return res.status(400).json({
      success: false,
      error: "You must provide a body to update"
    });
  }

  User.findOneAndUpdate(
    { _id: body.userID, "boards._id": body.boardID },
    { $pull: { boards: { _id: body.boardID } } },
    { new: true },
    function(error, user) {
      if (error) {
        res.status(400).end("could not delete board");
      } else {
        res.status(200).json({ user });
      }
    }
  );
};
boardEdit = async (req, res) => {
  const body = req.body;
  if (!body) {
    return res.status(400).json({
      success: false,
      error: "You must provide a body to update"
    });
  }

  User.findOne({ _id: body.userID, "boards.name": body.newBoardName }, function(
    error,
    user
  ) {
    if (user) {
      res.status(201).end("board name already exists!");
    } else {
      User.findOneAndUpdate(
        { _id: body.userID, "boards._id": body.boardID },
        { $set: { "boards.$.name": body.newBoardName } },
        { new: true },
        function(error, user) {
          if (error) {
            res.status(400).end("could not delete board");
          } else {
            res.status(200).json({ user });
          }
        }
      );
    }
  });
};
cardCreate = async (req, res) => {
  const body = req.body;
  if (!body) {
    return res.status(400).json({
      success: false,
      error: "You must provide a body to update"
    });
  }

  Card.findOne(
    {
      containerID: body.containerID,
      name: body.newCardName
    },
    { new: true },
    function(error, card) {
      if (error) {
        res.status(400).end("could not create card");
      } else {
        const newcard = new Card(body);
        newcard
          .save()
          .then(() => {
            Card.find().then(cards => {
              res.status(200).json({ cards });
            });
          })
          .catch(error => {
            res.status(400).json({ error: error });
          });
      }
    }
  );
};
getCards = async (req, res) => {
  Card.find().then(cards => {
    res.status(200).json({ cards });
  });
};
containerDelete = async (req, res) => {
  const body = req.body;
  if (!body) {
    return res.status(400).json({
      success: false,
      error: "You must provide a body to update"
    });
  }
  Container.findOneAndRemove(
    { _id: body.containerID, boardID: body.boardID },
    function(error, n) {
      if (error) {
        res.status(400).end("could not delete board");
      } else {
        Container.find().then(containers => {
          res.status(200).json({ containers });
        });
      }
    }
  );
};
containerEdit = async (req, res) => {
  const body = req.body;
  if (!body) {
    return res.status(400).json({
      success: false,
      error: "You must provide a body to update"
    });
  }
  Container.findOneAndUpdate(
    {
      _id: body.containerID,
      boardID: body.boardID
    },
    { $set: { name: body.newContainerName } },
    { new: true },
    function(err, n) {
      Container.find().then(containers => {
        res.status(200).json({ containers });
      });
    }
  );
};
getContainers = async (req, res) => {
  Container.find().then(containers => {
    res.status(200).json({ containers });
  });
};
cardDelete = async (req, res) => {
  const body = req.body;
  if (!body) {
    return res.status(400).json({
      success: false,
      error: "You must provide a body to update"
    });
  }
  Card.findOneAndRemove({ _id: body.cardID }, function(error, n) {
    if (error) {
      res.status(400).end("could not delete board");
    } else {
      Card.find().then(cards => {
        res.status(200).json({ cards });
      });
    }
  });
};
cardEdit = async (req, res) => {
  const body = req.body;
  if (!body) {
    return res.status(400).json({
      success: false,
      error: "You must provide a body to update"
    });
  }
  Card.findOneAndUpdate(
    {
      _id: body.cardID,
      containerID: body.containerID
    },
    { $set: { name: body.newCardName } },
    { new: true },
    function(err, n) {
      Card.find().then(cards => {
        res.status(200).json({ cards });
      });
    }
  );
};
changeCardPosition = async (req, res) => {
  const body = req.body;
  if (!body) {
    return res.status(400).json({
      success: false,
      error: "You must provide a body to update"
    });
  }
  Card.findOneAndUpdate(
    {
      _id: body.cardID
    },
    {
      $set: { containerID: body.containerID }
    },
    { new: true },
    function(err, n) {
      Card.find().then(cards => {
        res.status(200).json({ cards });
      });
    }
  );
};

module.exports = {
  changeCardPosition,
  cardEdit,
  cardDelete,
  getContainers,
  containerEdit,
  containerDelete,
  getCards,
  cardCreate,
  boardEdit,
  boardDelete,
  containerCreate,
  deleteAccount,
  editUserInfo,
  signup,
  login,
  getUser,
  boardCreate
};
