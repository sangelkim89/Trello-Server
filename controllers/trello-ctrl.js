// const User = require("../db/models/user");
// const Card = require("../db/models/user");
const jwt = require("jsonwebtoken");

const { User } = require("../db/models/user");
const { Card } = require("../db/models/user");
const { Container } = require("../db/models/user");
signup = async (req, res) => {
  const body = req.body;
  console.log("body:=================================================", body);
  await User.findOne({ email: body.email }, (err, user) => {
    if (user) {
      console.log("already exists");
      return res.status(400).end("email already exists!");
    } else {
      const user = new User(body);
      console.log("does not exists");
      user
        .save()
        .then(() => {
          return res.status(200).json({
            success: true,
            message: "user created!"
          });
        })
        .catch(error => {
          console.log("error: ", error);
          return res.status(400).json({
            error,
            message: "user not created!"
          });
        });
    }
  });
};
login = async (req, res) => {
  // console.log("req:=================================================", req);
  const { email, password } = req.body;
  await User.findOne({ email: email, password: password }, (err, user) => {
    // console.log("user: ", user);
    if (err) {
      return res.status(400).end("error...");
    }
    if (!user) {
      console.log("couldnt find");
      return res.status(404).end("User not found");
    }
    let userID = { userID: user._id };
    let token = jwt.sign(userID, "secret", { expiresIn: "1h" });
    return res.status(200).json({ userID: user._id, token: token });
  }).catch(err => console.log(err));
};
getUser = async (req, res) => {
  // console.log("getUser req: ", req);
  const { id } = req.body;
  // console.log("req: ", req);
  // console.log("req.id", id);
  await User.findOne({ _id: id }, (err, user) => {
    if (err) {
      return res.status(400).end("error...");
    }

    console.log("found user: ", user);
    return res.status(200).json({ user });
  });
};

boardCreate = async (req, res) => {
  // console.log("boardCreate req: ", req);
  const body = req.body;

  if (!body) {
    return res.status(400).json({
      success: false,
      error: "You must provide a body to update"
    });
  }
  // console.log("body.userID: ", body.userID);
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

  // Failed attempt:
  // User.findOne({ _id: body.userID }, (err, user) => {
  //   console.log("board before create: ", user.boards);
  //   // user.boards = user.boards.$push({
  //   //   name: body.newBoardName,
  //   //   container: [{}]
  //   // });
  //   user.update({ boards: { name: body.newBoardName }  });
  //   console.log("board after create: ", user.boards);
  //   user
  //     .save()
  //     .then(() => {
  //       return res.status(200).json({ user });
  //     })
  //     .catch(err => {
  //       console.log(err);
  //       return res.status(400).end("Failed to create Board!");
  //     });
  // });
};
editUserInfo = async (req, res) => {
  const body = req.body;

  User.findOneAndUpdate(
    { _id: body.id },
    { name: body.name, email: body.email, password: body.password },
    function(error, success) {
      if (error) {
        console.log(error);
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
      console.log(error);
      res.status(400).end("could not delete account");
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
  console.log("body.userID: ", body.userID);
  // let newContainer = { name: body.newContainerName };
  // console.log("new container: ", newContainer);

  const newContainer = new Container(body);
  newContainer
    .save()
    .then(() => {
      // console.log("container creation success: ", newContainer);
      Container.find().then(containers => {
        res.status(200).json({ containers });
      });
    })
    .catch(error => {
      console.log("error: ", error);
    });

  // User.findOneAndUpdate(
  //   { _id: body.userID, "boards._id": body.boardID },
  //   { $addToSet: { "boards.$.container": newContainer } },
  //   { new: true },
  //   function(error, user) {
  //     if (error) {
  //       console.log(error);
  //       res.status(400).end("could not create board");
  //     } else {
  //       console.log(
  //         "container creation success, sending status 200~",
  //         user.boards[0].container
  //       );
  //       res.status(200).json({ user });
  //     }
  //   }
  // );

  // User.findOneAndUpdate(
  //   { _id: body.userID },
  //   { $push: { boards: { container: body.newContainerName } } },
  //   function(error, success) {
  //     if (error) {
  //       res.status(400).end("could not create board");
  //     } else {
  //       res.status(200).end("board created!");
  //     }
  //   }
  // );
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
        console.log(error);
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
            console.log(error);
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
  console.log("body: ", body);
  if (!body) {
    return res.status(400).json({
      success: false,
      error: "You must provide a body to update"
    });
  }
  console.log("newcardname: ", body.newCardName);
  let newCard = { name: body.newCardName };
  let searchQuery = "boards.$.container." + body.containerIndex + ".card";

  Card.findOne(
    {
      containerID: body.containerID,
      name: body.newCardName
    },
    { new: true },
    function(error, card) {
      if (error) {
        console.log(error);
        res.status(400).end("could not create card");
      } else {
        const newcard = new Card(body);
        newcard
          .save()
          .then(() => {
            Card.find().then(cards => {
              console.log("card creation success: ", cards);
              res.status(200).json({ cards });
            });
          })
          .catch(error => {
            console.log("error: ", error);
          });
      }
    }
  );

  // User.findOneAndUpdate(
  //   {
  //     _id: body.userID,
  //     "boards._id": body.boardID,
  //     "boards.container._id": body.containerID
  //   },
  //   // {
  //   //   _id: body.userID,
  //   //   "boards._id": body.boardID,
  //   //   "container._id": body.containerID
  //   // },
  //   { $addToSet: { "boards.$[bid].container.$[id].card": newCard } },
  //   {
  //     arrayFilters: [
  //       { id: { _id: body.containerID } },
  //       { bid: { _id: body.boardID } }
  //     ],
  //     // multi: true,
  //     new: true
  //   },
  //   function(error, user) {
  //     if (error) {
  //       console.log(error);
  //       res.status(400).end("could not create card");
  //     } else {
  //       // console.log("card creation success: ", user.boards[0].container);
  //       res.status(200).json({ user });
  //     }
  //   }
  // );
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
        console.log(error);
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
  // function(error, container) {
  //   if (error) {
  //     console.log(error);
  //     res.status(400).end("could not delete board");
  //   } else {
  //     res.status(200).json({ container });
  //   }
  // }
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
  Card.findOneAndRemove(
    { _id: body.cardID, containerID: body.containerID },
    function(error, n) {
      if (error) {
        console.log(error);
        res.status(400).end("could not delete board");
      } else {
        Card.find().then(cards => {
          res.status(200).json({ cards });
        });
      }
    }
  );
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
// updateUser = async (req, res) => {
//   const body = req.body;

//   if (!body) {
//     return res.status(400).json({
//       success: false,
//       error: "You must provide a body to update"
//     });
//   }

//   User.findOne({ _id: req.params.id }, (err, user) => {
//     if (err) {
//       return res.status(404).json({
//         err,
//         message: "User not found!"
//       });
//     }
//     user.name = body.name;
//     user.time = body.time;
//     user.rating = body.rating;
//     user
//       .save()
//       .then(() => {
//         return res.status(200).json({
//           success: true,
//           id: user._id,
//           message: "user updated!"
//         });
//       })
//       .catch(error => {
//         return res.status(404).json({
//           error,
//           message: "user not updated!"
//         });
//       });
//   });
// };

// deleteUser = async (req, res) => {
//   await User.findOneAndDelete({ _id: req.params.id }, (err, user) => {
//     if (err) {
//       return res.status(400).json({ success: false, error: err });
//     }

//     if (!user) {
//       return res.status(404).json({ success: false, error: `User not found` });
//     }

//     return res.status(200).json({ success: true, data: user });
//   }).catch(err => console.log(err));
// };

// getUserById = async (req, res) => {
//   await User.findOne({ _id: req.params.id }, (err, user) => {
//     if (err) {
//       return res.status(400).json({ success: false, error: err });
//     }

//     if (!user) {
//       return res.status(404).json({ success: false, error: `user not found` });
//     }
//     return res.status(200).json({ success: true, data: user });
//   }).catch(err => console.log(err));
// };

// getUsers = async (req, res) => {
//   await User.find({}, (err, user) => {
//     if (err) {
//       return res.status(400).json({ success: false, error: err });
//     }
//     if (!user.length) {
//       return res.status(404).json({ success: false, error: `User not found` });
//     }
//     return res.status(200).json({ success: true, data: user });
//   }).catch(err => console.log(err));
// };

module.exports = {
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
  // updateUser,
  // deleteUser,
  // getUsers,
  // getUserById
};
