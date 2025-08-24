const { randomUUID } = require("crypto");
const path = require("path");
const fsPromises = require("fs").promises;

const data = {};
data.users = require("../data/users.json");

const userModel = {};
userModel.keySchema = Object.keys(data.users[0]);

//--  GET all Users
userModel.get = function () {
  return data.users;
};
//--  GET a user
userModel.getUser = function (id) {
  return data.users.find((user) => user.id === id);
};
//--  GET a user by Email
userModel.getUserByEmail = function (email) {
  return data.users.find((user) => user.email === email);
};
//--  Create user
userModel.create = async function (newUserData) {
  const newUser = {
    "terms-conditions": true,
    cart: [],
    roles: ["user"],
    id: randomUUID(),
    ...newUserData,
  };

  data.users = [...data.users, newUser];

  await fsPromises.writeFile(
    path.join(__dirname, "..", "data", "users.json"),
    JSON.stringify(data.users)
  );

  return newUser;
};
//--  Update user
userModel.update = async function (id, newUserData) {
  const oldUserData = data.users.find((user) => user.id === id);
  const updatedUser = {
    ...oldUserData,
    ...newUserData,
    cart: [...oldUserData.cart, newUserData.cart],
  };
  console.log("❤️", id);

  data.users = [...data.users.filter((user) => user.id !== id), updatedUser];
  await fsPromises.writeFile(
    path.join(__dirname, "..", "data", "users.json"),
    JSON.stringify(data.users)
  );
};
//--  Delete user
userModel.delete = async function (id) {
  data.users = [...data.users.filter((user) => user.id !== id)];

  await fsPromises.writeFile(
    path.join(__dirname, "..", "data", "users.json"),
    JSON.stringify(data.users)
  );
};
//set REFRESH TOKEN
userModel.setRefreshToken = async function (id, refreshToken) {
  const updatedUser = {
    ...data.users.find((user) => user.id === id),
    refreshToken,
  };

  data.users = [...data.users.filter((user) => user.id !== id), updatedUser];
  await fsPromises.writeFile(
    path.join(__dirname, "..", "data", "users.json"),
    JSON.stringify(data.users)
  );
};

// get user with REFRESH TOKEN
userModel.getUserByRefreshToken = function (refreshToken) {
  const user = data.users.find((user) => user.refreshToken === refreshToken);
  return user;
};
// Delete the REFRESH TOKEN

userModel.deleteRefreshToken = async function (id) {
  const updatedUser = {
    ...data.users.find((user) => user.id === id),
    refreshToken: "",
  };

  data.users = [...data.users.filter((user) => user.id !== id), updatedUser];

  await fsPromises.writeFile(
    path.join(__dirname, "..", "data", "users.json"),
    JSON.stringify(data.users)
  );
};
module.exports = userModel;
