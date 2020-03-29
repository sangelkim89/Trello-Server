const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  //   console.log("token: ", req.headers.authorization.split(" ")[1]);
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, "secret");
    const tokenUserID = decodedToken.userID;
    if (req.body.userID && req.body.userID !== tokenUserID) {
      console.log("blocked!");
      throw "Invalid user ID";
    } else {
      //   console.log("passed auth check!");
      next();
    }
  } catch {
    console.log("blocked!!!");
    res.status(401).json({ error: new Error("Invalid request!") });
  }
};
