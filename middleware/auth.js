const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, "secret");
    const tokenUserID = decodedToken.userID;
    if (req.body.userID && req.body.userID !== tokenUserID) {
      throw "Invalid user ID";
    } else {
      next();
    }
  } catch {
    console.log("blocked!!!");
    res.status(401).json({ error: new Error("Invalid request!") });
  }
};
