const Users = require("../models/users");
const asyncHandler = require("express-async-handler");
const {ObjectId} = require('mongoose').Types

exports.usersPost = asyncHandler(async (req, res) => {
  try {
    const id = req.body.id;
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.emailAddress;
    const user = new Users({
      _id: id ,
      firstname: firstName,
      lastname: lastName,
      email: email,
    });

    await user.save();
    res.status(200).send({ message: "Recorded user successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Something went wrong" });
  }
});

exports.usersIdGet = asyncHandler(async (req, res) => {
  try {
    const email = req.params.email;
    const user = await Users.find({ email: email }).exec();
    const userId = user[0]._id.toString();

    res.status(200).send({ userId });
  } catch (err) {
    res
      .status(404)
      .send({ message: "The user with that email does not exist" });
  }
});

exports.usersDetailsGet = asyncHandler(async (req, res) => {
  try {
    const id = req.params.id;
    console.log(id);
    const user = await Users.find({ _id: id }).exec();
    const userDetails = user[0];

    res.status(200).send(userDetails);
  } catch (err) {
    res.status(404).send({ message: "The user with that id does not exist" });
  }
});
