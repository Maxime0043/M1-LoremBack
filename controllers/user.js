// Validation
const joi = require("joi");
const bcrypt = require("bcrypt");

// JWT + dotenv + check for the presence of an environment variable
const jwt = require("jsonwebtoken");
require("dotenv").config();

if (!process.env.JWT_PRIVATE_KEY) {
  console.log(
    "You must create an .env file that contains the variable JWT_PRIVATE_KEY"
  );
  process.exit(1);
}

// Import Model
const { User } = require("../database/models/User.model");

/**
 * Allows you to retrieve the information of the connected user.
 */
exports.account = async function (req, res) {
  res.status(200).json(req.user);
};

/**
 * Function that will be used for the "/api/v1/user/register" route.
 * Register a new user in the database.
 */
exports.register = async function (req, res) {
  const payload = req.body;
  const schema = joi.object({
    lastname: joi.string().min(2).max(50).required(),
    firstname: joi.string().min(2).max(50).required(),
    email: joi.string().max(255).required().email(),
    password: joi.string().min(6).max(255).required(),
    role: joi.string().min(1).required(),
  });

  const { value: account, error } = schema.validate(payload);
  if (error) return res.status(400).json({ error: error.details[0].message });

  // Before registering we check that the account is unique
  const found = await User.findOne({ email: account.email });
  if (found)
    return res.status(400).json({ error: "Please signin instead of signup !" });

  // Password Hash
  const salt = await bcrypt.genSalt(10);
  const passwordHashed = await bcrypt.hash(account.password, salt);
  account.password = passwordHashed;

  // Creation of the new user
  const newUser = new User(account);
  newUser.save().then((account) => {
    res.status(201).json({
      lastname: account.lastname,
      firstname: account.firstname,
      email: account.email,
    });
  });
};

/**
 * Function that will be used for the "/api/v1/user/login" route.
 * Allows a user to login.
 */
exports.login = async function (req, res) {
  const payload = req.body;
  const schema = joi.object({
    email: joi.string().max(255).required().email(),
    password: joi.string().min(6).max(255).required(),
  });

  const { value: connexion, error } = schema.validate(payload);
  if (error) return res.status(400).json({ error: error.details[0].message });

  // We search in the database
  const account = await User.findOne({ email: connexion.email });
  if (!account) return res.status(400).json({ error: "Email Invalid !" });

  // We need to compare the hashes
  const passwordHashed = await bcrypt.compare(
    connexion.password,
    account.password
  );
  if (!passwordHashed)
    return res.status(400).json({ error: "Invalid password !" });

  // We return a JWT
  const token = jwt.sign(
    {
      id: account._id,
      email: account.email,
      lastname: account.lastname,
      firstname: account.firstname,
    },
    process.env.JWT_PRIVATE_KEY
  );
  res.status(200).json({
    token: token,
    id: account._id,
    email: account.email,
    lastname: account.lastname,
    firstname: account.firstname,
  });
};
