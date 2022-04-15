const user = require("../schema/user");
const bcrypt = require("bcrypt");

const createUser = async (req, res) => {
  const { username, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    let newUser = await user.create({
      username: username,
      password: hashedPassword,
      email: email,
    });
    return newUser;
    // res.status(201).send({ user: newUser });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};

const getAllUsers = async (res) => {
  try {
    let users = await user.find({});
    res.status(200).send({ users: users });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};

module.exports = { createUser, getAllUsers };
