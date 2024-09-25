const Users = require("../models/users");
const asyncHandler = require("express-async-handler");

exports.usersPost = asyncHandler(async (req, res) => {
  try {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.emailAddress;
    console.log(firstName)
    const user = new Users({
      firstname: firstName,
      lastname: lastName,
      email: email,
    });

    await user.save();
    res.status(200).send({ message: "Recorded user successfully" });
  } catch(err) {
    console.log(err)
    res.status(500).send({ message: "Something went wrong" });
  }
});
