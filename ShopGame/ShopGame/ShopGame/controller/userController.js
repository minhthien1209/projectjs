const Account = require("../models/userModel");
const { generateToken, refreshToken } = require("../utils/generateToken");

// Controller for creating a new account
exports.createAccount = async (req, res) => {
  
  try {
    const { email, username } = req.body;

    const checkEmail = await Account.findOne({ email });
    const checkuserName = await  Account.findOne({ username });
    if(checkEmail){
      return res.status(409).json({
        message: "Email is exits",
        error: true
      })
    }
    if(checkuserName){
      return res.status(409).json({
        message: "UserName is exits",
        error: true
      })
    }
    const newAccount = new Account(req.body);
    const savedAccount = await newAccount.save();
    res.status(201).json(savedAccount);
  } catch (error) {
    res.status(500).json({ message: "Error creating account", error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const userCheck = await Account.findOne({ username });
    if (userCheck && (await userCheck.matchPassword(password))) {
      const access_token = await generateToken({
        id: userCheck._id,
      });

      return res.json({
        status: "OK",
        message: "SUCESS",
        access_token,
        userCheck
      });
    } else {
      return res.status(400).json({ message: "Invalid Email or Password" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error login account", error: error.message });

  }
}

// Controller for getting all accounts
exports.getAllAccounts = async (req, res) => {
  try {
    const accounts = await Account.find();
    res.status(200).json(accounts);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving accounts", error: error.message });
  }
};

// Controller for getting an account by ID
exports.getAccountById = async (req, res) => {
  const accountId = req.params.id;
  try {
    const account = await Account.findById(accountId);
    if (!account) {
      res.status(404).json({ message: "Account not found" });
    } else {
      res.status(200).json(account);
    }
  } catch (error) {
    res.status(500).json({ message: "Error retrieving account", error: error.message });
  }
};

// Controller for updating an account
exports.updateAccount = async (req, res) => {
  const accountId = req.params.id;
  try {
    const updatedAccount = await Account.findByIdAndUpdate(accountId, req.body, { new: true });
    if (!updatedAccount) {
      res.status(404).json({ message: "Account not found" });
    } else {
      res.status(200).json(updatedAccount);
    }
  } catch (error) {
    res.status(500).json({ message: "Error updating account", error: error.message });
  }
};

// Controller for deleting an account
exports.deleteAccount = async (req, res) => {
  const accountId = req.params.id;
  try {
    const deletedAccount = await Account.findByIdAndDelete(accountId);
    if (!deletedAccount) {
      res.status(404).json({ message: "Account not found" });
    } else {
      res.status(200).json({ message: "Account deleted successfully" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error deleting account", error: error.message });
  }
};