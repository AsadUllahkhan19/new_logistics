const userModel = require("../models/user.model");
const profileModel = require("../models/profile.model");
const commonMessages = require("../common/messages");
const { format } = require("../handler/errorHandler");
const { emailSend } = require("../services/emailService");
const crypto = require("crypto");
const mongoose = require("mongoose");
const { ObjectId } = require("mongodb");
const bcrypt = require("bcryptjs"); // Import bcryptjs
const jwt = require("jsonwebtoken");
const hashedPassword = require("../services/passwordGenerator");
const stripe = require("stripe")(process.env.STRIPE_SECRET_TEST);

const registerUser = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  console.log(req.body);
  let {
    email,
    password,
    username,
    phonenumber,
    companyname,
    companyaddress,
    country,
    city,
    vat_certificate,
    trade_certificate,
  } = req.body;
  try {
    const options = { session, new: true };

    console.log(req.body);
    const emailCheck = await userModel.findOne({ email: email });

    const verifyToken = crypto.randomBytes(32).toString("hex");
    console.log("ok 3");
    if (emailCheck) {
      throw format(commonMessages.emailExist, 403);
    }

    const Customerss = await stripe.customers.create({
      name: username,
      email: email,
      phone: phonenumber,
    });

    const userData = new userModel(
      {
        email,
        username,
        password: await hashedPassword(password),
        phonenumber,
        companyname,
        companyaddress,
        country,
        city,
        vat_certificate,
        trade_certificate,
        verifyToken,
        cust_stripeId: Customerss.id,
      }
      // options
    );
    const newUser = await userData.save();
    console.log(userData);
    const profileData = await profileModel.create(
      [
        {
          email,
          username,
          phonenumber,
          companyname,
          companyaddress,
          country,
          city,
          vat_certificate,
          trade_certificate,
          userId: newUser._id.toString(),
        },
      ],
      options
    );
    await emailSend(email, verifyToken);
    // const customer = await createStripeCustomer({username,email,phonenumber});
    // console.log(customer);
    // async function createStripeCustomer({username,email,phonenumber}) {
    //   return new Promise(async (resolve, reject) => {
    //     try {
    //       const Customer = await stripe.customers.create({
    //         name: username,
    //         email:email,
    //         phone:phonenumber,
    //       });

    //       resolve(Customer);
    //     } catch (err) {
    //       console.log(err);
    //       reject(err);
    //     }
    //   });
    // }
    // console.log(userData[0]._id,customer.id)
    try {
      // const await userModel.findByIdAndUpdate(userData[0]._id,
      // })
      console.log("suucessful");
      return res.send({ message: "success", data: userData });
    } catch (error) {
      console.log(error);
    }

    await session.commitTransaction();
    return res.status(201).json({});
  } catch (error) {
    console.log("k");
    await session.abortTransaction();
    next(error);
  } finally {
    session.endSession();
  }
};

const verifyUser = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const options = { upsert: false, session, new: true };
    let { token } = req.query;
    const tokenCheck = await userModel.findOne({ verifyToken: token });
    if (tokenCheck) {
      await userModel.updateOne(
        { _id: new ObjectId(tokenCheck._id) },
        { $set: { isVerified: true, verifyToken: null } },
        options
      );
      res.redirect("https://macworldlogistic.com/");
      await session.commitTransaction();
    } else {
      res.render("error.ejs");
    }
  } catch (error) {
    await session.abortTransaction();
    next(error);
  } finally {
    session.endSession();
  }
};

const loginUser = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const options = { upsert: false, session, new: true };
    let { email, password } = req.body;
    const User = await userModel.findOne({ email: email });

    if (User) {
      const checkPassword = await bcrypt.compare(password, User.password);
      if (checkPassword) {
        // if (User.isVerified) {
        //   const accessToken = await jwt.sign(
        //     { id: User._id, name: User.name },
        //     process.env.JWT_SECRET,
        //     { expiresIn: "1h" }
        //   );
        //   const refreshToken = await jwt.sign(
        //     { id: User._id, name: User.name },
        //     process.env.REFRESH_TOKEN,
        //     { expiresIn: "90 days" }
        //   );
        //   await userModel.updateOne(
        //     { _id: User._id },
        //     { $set: { refreshToken: refreshToken } },
        //     options
        //   );
        //   await session.commitTransaction();
        //   res.json({
        //     userId: User._id,
        //     accessToken,
        //     refreshToken,
        //   });
        // } else {
        //   throw format(commonMessages.unverified, 401);
        // }
        const token = jwt.sign({ userId: User._id }, process.env.JWT_SECRET, {
          expiresIn: "1h",
        });
        res
          .json({
            token: token,
            userId: User._id,
            customer_id: User.cust_stripeId,
            credentials: User,
          })
          .status(200);
        console.log(token);
        // const token = jwt.sign({ userId: User._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res
          .json({
            token: token,
            credentials: User,
            customer_id: User.cust_stripeId,
          })
          .status(200);
        console.log(token);
      } else {
        throw format(commonMessages.wrongCredential, 401);
      }
    } else {
      throw format(commonMessages.wrongCredential, 401);
    }
  } catch (error) {
    await session.abortTransaction();
    next(error);
  } finally {
    session.endSession();
  }
};

const reviveToken = async (req, res, next) => {
  try {
    const header = req.headers["authorization"];
    const token = header && header.split(" ")[1];
    console.log(token);
    if (!token) {
      return res.status(401).json({ msg: commonMessages.tokenNotFound });
    }
    const verified = jwt.verify(token, process.env.REFRESH_TOKEN);
    console.log("sdsd", verified);
    const accessToken = await jwt.sign(
      { id: verified._id, name: verified.name },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    const user = await userModel.findById(verified.id);
    console.log(user);
    console.log(verified.name);
    res.json({
      user: user,
      accessToken,
      refreshToken: token,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await userModel.findById(id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      user: user,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

const logout = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const options = { upsert: false, session, new: true };
    const header = req.headers["authorization"];
    const token = header && header.split(" ")[1];
    if (!token) {
      return res.status(401).json({ msg: commonMessages.tokenNotFound });
    }
    const updatedUser = await userModel.updateOne(
      { refreshToken: token },
      { $set: { refreshToken: null } },
      options
    );
    if (updatedUser.modifiedCount) {
      await session.commitTransaction();
      res.status(200).json({
        message: commonMessages.success,
      });
    } else {
      throw format(commonMessages.error, 500);
    }
  } catch (error) {
    await session.abortTransaction();
    next(error);
  } finally {
    session.endSession();
  }
};

// const hashedPassword = async (password) => {
//   const defaultSalt = 10;
//   const salt = await bcrypt.genSalt(defaultSalt);
//   const passwordHash = await bcrypt.hash(password, salt);
//   return passwordHash;
// };

module.exports = {
  registerUser,
  verifyUser,
  loginUser,
  reviveToken,
  logout,
  getUser,
};
