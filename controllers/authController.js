require("dotenv/config");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const otpGenerator = require("otp-generator");
const { sendEmailOTP } = require("../services/nodemailer");

exports.signup = async (req, res, next) => {
  try {
    const { name, email, password, uid } = req.body;
    const isUser = await User.findOne({ email: email });

    if (isUser && !isUser.verified) {
      bcrypt.hash(
        password,
        parseInt(process.env.SALT_ROUND),
        async function (err, hash) {
          if (err) {
            console.error(err);
          }
          await isUser.save({ name, password: hash });
          req.user = isUser;
          next();
        }
      );
    } else if (isUser) {
      return res.status(400).json({
        status: "error",
        message: "This email address already registerd.",
      });
    } else {
      bcrypt.hash(
        password,
        parseInt(process.env.SALT_ROUND),
        async function (err, hash) {
          if (err) {
            console.error(err);
          }
          const userData = { ...req.body };
          const user = await new User({ ...userData, password: hash });
          await user.save();
          req.user = user;
          next();
        }
      );
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      status: "errro",
      message: "Some Internal Error Occured!",
    });
  }
};

exports.sendOTP = async (req, res) => {
  try {
    const user = req.user;
    const otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      specialChars: false,
      lowerCaseAlphabets: false,
    });
    const otpToken = jwt.sign({ userId: user._id }, process.env.JWT_KEY);
    bcrypt.hash(
      otp,
      parseInt(process.env.SALT_ROUND),
      async function (err, hash) {
        if (err) {
          console.error(err.message);
          return res
            .status(500)
            .json({ status: "errro", message: "Some Internal Error Occured!" });
        }
        await User.findByIdAndUpdate(
          user._id,
          {
            otp: hash,
            otpToken: otpToken,
            otpExpiry: Date.now() + 600000,
          },
          { new: true }
        );
      }
    );

    const verificationLink = `${process.env.CLIENT_ORIGIN}/auth/verify?token=${otpToken}`;
    const emailData = {
      to: user.email,
      subject: "Verify your account on The CRETO",
      html: `<div>
              <p>Your email verification OTP(One Time Password) is ${otp}. This OTP is valid for next 10 minutes, Verify OTP now.</p>
              <a href="${verificationLink}" >Enter your OTP here</a>
             </div>`,
    };

    await sendEmailOTP(emailData);

    const data = {
      token: otpToken,
    };

    res.status(200).json({
      status: "success",
      message: "OTP sent successfully.",
      data,
    });
  } catch (error) {
    console.error(error.message);
    res
      .status(500)
      .json({ status: "errro", message: "Some Internal Error Occured!" });
  }
};

exports.verify = async (req, res) => {
  try {
    const { token, otp } = req.body;
    const userId = jwt.verify(token, process.env.JWT_KEY, (err, decode) => {
      if (err) {
        console.error(err);
        return res.status(500).json({
          status: "error",
          message: "Some Internal Error Occurred",
        });
      }

      return decode.userId;
    });

    if (!userId) {
      return res.status(500).json({
        status: "error",
        message: "Invalid token",
      });
    }

    const user = await User.findById(userId);
    if (user.otpToken !== token) {
      return res.status(500).json({
        status: "error",
        message: "Invalid request",
      });
    }

    if (!(user.otpExpiry >= Date.now())) {
      return res.status(500).json({
        status: "error",
        message: "OTP Expired",
      });
    }

    const isPassowordCorrect = await bcrypt.compare(String(otp), user.otp);
    if (!isPassowordCorrect) {
      return res.status(500).json({
        status: "error",
        message: "Incorrect OTP",
      });
    }

    user.verified = true;
    user.otp = undefined;
    user.otpToken = undefined;
    user.otpExpiry = undefined;
    await user.save();

    res.status(200).json({
      status: "success",
      message: "Your account verified successfully.",
      data: {
        userId: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        photoUrl: user.photoUrl,
      },
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ status: "error", message: "Some Internal Error Occured!" });
  }
};

exports.signin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) {
      return res
        .status(404)
        .json({ status: "error", message: "User not found!" });
    }

    const isPassowordCorrect = await bcrypt.compare(
      String(password),
      user.password
    );
    if (!isPassowordCorrect) {
      return res
        .status(400)
        .json({ status: "error", message: "Incorrect password!" });
    }

    res.status(200).json({
      status: "success",
      message: "You are logged in.",
      data: {
        userId: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        photoUrl: user.photoUrl,
      },
    });
  } catch (err) {
    console.error(err.message);
    res
      .status(500)
      .json({ status: "errro", message: "Some Internal Error Occured!" });
  }
};

exports.signinWithGoogle = async (req, res) => {
  try {
    const { name, email, uid, photoUrl } = req.body;
    const isUser = await User.findOne({ email: email });

    if (!isUser) {
      const user = new User({
        name,
        email,
        photoUrl,
        password: process.env.GOOGLE_AUTH_PASSWORD,
        uid,
        verified: true,
      });
      await user.save();
      return res.status(200).json({
        status: "success",
        message: "You are registered successfully",
        data: {
          userId: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          photoUrl: user.photoUrl,
        },
      });
    }

    isUser.uid = uid;
    isUser.photoUrl = photoUrl;
    await isUser.save();

    res.status(200).json({
      status: "success",
      message: "You are logged in successfully",
      data: {
        userId: isUser._id,
        name: isUser.name,
        email: isUser.email,
        role: isUser.role,
        photoUrl: isUser.photoUrl,
      },
    });

  } catch (err) {
    console.error(err.message);
    res
      .status(500)
      .json({ status: "errro", message: "Some Internal Error Occured!" });
  }
};
