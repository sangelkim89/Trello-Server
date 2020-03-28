const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const CardSchema = new Schema({
  name: { type: String },
  containerID: { type: String }
});
const ContainerSchema = new Schema({
  name: { type: String },
  boardID: { type: String },
  card: [CardSchema]
});
const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    boards: [
      {
        name: { type: String },
        container: [ContainerSchema]
      }
    ]
  },
  { timestamps: true }
);
const User = mongoose.model("Users", UserSchema);
const Card = mongoose.model("Card", CardSchema);
const Container = mongoose.model("Container", ContainerSchema);
module.exports = {
  User: User,
  Card: Card,
  Container: Container
};
