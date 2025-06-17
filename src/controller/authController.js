const bcrypt = require("bcrypt");
const { body, validationResult } = require("express-validator");
const adminLayout = "./layouts/adminLayout.ejs";
const User = require("../model/userSchema");
const passport = require("../config/passport-config");
const logger = require("../../logger"); // Fix logger path

module.exports = {
  // Middleware for validating user registration
  validateUserRegister: [
    body("firstName").trim().notEmpty().withMessage("First name is required"),
    body("lastName").trim().notEmpty().withMessage("Last name is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("pwd")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters"),
    body("pwdConf").custom((value, { req }) => {
      if (value !== req.body.pwd) {
        throw new Error("Passwords do not match");
      }
      return true;
    }),
  ],

  // Middleware for validating user login
  validateUserLogin: [
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").notEmpty().withMessage("Password is required"),
  ],

  // Middleware for validating admin registration
  validateAdminRegister: [
    body("firstName").trim().notEmpty().withMessage("First name is required"),
    body("lastName").trim().notEmpty().withMessage("Last name is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("pwd")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
    body("pwdConf").custom((value, { req }) => {
      if (value !== req.body.pwd) {
        throw new Error("Passwords do not match");
      }
      return true;
    }),
  ],

  // Middleware for validating admin login
  validateAdminLogin: [
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").notEmpty().withMessage("Password is required"),
  ],

  // User GET
  getUserLogin: (req, res) => {
    if (req.user) return res.redirect("/");

    const locals = { title: "User Login" };
    res.render("user/login", {
      locals,
      success: req.flash("success"),
      error: req.flash("error"),
    });
  },

  getUserRegister: (req, res) => {
    const locals = { title: "User Register" };
    res.render("user/register", {
      locals,
      success: req.flash("success"),
      error: req.flash("error"),
    });
  },

  // User POST
  userRegister: async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.flash("error", errors.array().map(err => err.msg).join(", "));
      return res.redirect("/register");
    }

    const { firstName, lastName, email, pwd } = req.body;

    try {
      const isExist = await User.findOne({ email });

      if (isExist) {
        logger.warn(`User registration attempt with existing email: ${email}`);
        req.flash("error", "User already exists, Please login");
        return res.redirect("/login");
      }

      const hashpwd = await bcrypt.hash(pwd, 12);

      const user = await User.create({
        firstName,
        lastName,
        email,
        password: hashpwd,
      });

      if (user) {
        logger.info(`User registration success: ${email}`);
        req.flash("success", "User successfully created!!");
        res.redirect("/login");
      } else {
        logger.error(`User registration failed: ${email}`);
        req.flash("error", "User not created");
        res.redirect("/register");
      }
    } catch (err) {
      logger.error(`User registration error: ${email} - ${err.message}`);
      req.flash("error", "Server error");
      res.redirect("/register");
    }
  },

  userLogin: (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.flash("error", errors.array().map(err => err.msg).join(", "));
      return res.redirect("/login");
    }

    // Always set req.body.pwd for passport
    if (!req.body.pwd && req.body.password) req.body.pwd = req.body.password;

    passport.authenticate("user-local", (err, user, info) => {
      if (err) {
        logger.error(`User login error: ${req.body.email} - ${err.message}`);
        return next(err);
      }
      if (!user) {
        logger.warn(`User login failed: ${req.body.email}`);
        req.flash("error", info && info.message ? info.message : "Invalid Credentials");
        return res.redirect("/login");
      }

      req.logIn(user, err => {
        if (err) {
          logger.error(`User login error after authentication: ${req.body.email} - ${err.message}`);
          return next(err);
        }
        logger.info(`User login success: ${req.body.email}`);
        return res.redirect("/");
      });
    })(req, res, next);
  },

  // Admin GET
  getAdminLogin: (req, res) => {
    const locals = { title: "Admin Login" };
    res.render("admin/login", {
      locals,
      success: req.flash("success"),
      error: req.flash("error"),
      layout: adminLayout,
    });
  },

  getAdminRegister: (req, res) => {
    const locals = { title: "Admin Register" };
    res.render("admin/register", {
      locals,
      success: req.flash("success"),
      error: req.flash("error"),
      layout: adminLayout,
    });
  },

  // Admin POST
  adminRegister: async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.flash("error", errors.array().map(err => err.msg).join(", "));
      return res.redirect("/admin/register");
    }

    const { firstName, lastName, email, pwd } = req.body;

    try {
      const isExist = await User.findOne({ email });

      if (isExist) {
        logger.warn(`Admin registration attempt with existing email: ${email}`);
        req.flash("error", "User already exists, Please login");
        return res.redirect("/admin/login");
      }

      const hashpwd = await bcrypt.hash(pwd, 12);

      const user = await User.create({
        firstName,
        lastName,
        email,
        password: hashpwd,
        isAdmin: true,
      });

      if (user) {
        logger.info(`Admin registration success: ${email}`);
        req.flash("success", "User successfully created!!");
        res.redirect("/admin/login");
      } else {
        logger.error(`Admin registration failed: ${email}`);
        req.flash("error", "User not created");
        res.redirect("/admin/register");
      }
    } catch (err) {
      logger.error(`Admin registration error: ${email} - ${err.message}`);
      req.flash("error", "Server error");
      res.redirect("/admin/register");
    }
  },

  adminLogin: (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.flash("error", errors.array().map(err => err.msg).join(", "));
      return res.redirect("/admin/login");
    }

    if (!req.body.pwd && req.body.password) req.body.pwd = req.body.password;

    passport.authenticate("admin-local", (err, user, info) => {
      if (err) {
        logger.error(`Admin login error: ${req.body.email} - ${err.message}`);
        return next(err);
      }
      if (!user) {
        logger.warn(`Admin login failed: ${req.body.email}`);
        req.flash("error", "Invalid Credentials!!!");
        return res.redirect("/admin/login");
      }

      req.logIn(user, err => {
        if (err) {
          logger.error(`Admin login error after authentication: ${req.body.email} - ${err.message}`);
          return next(err);
        }
        logger.info(`Admin login success: ${req.body.email}`);
        req.flash("success", "Admin Logged In");
        return res.redirect("/admin");
      });
    })(req, res, next);
  },

  logout: (req, res) => {
    req.logOut(err => {
      if (err) {
        logger.error(`Logout error for user: ${req.user ? req.user.email : "unknown"} - ${err.message}`);
      } else {
        logger.info(`User logged out: ${req.user ? req.user.email : "unknown"}`);
        req.flash("success", `Logged Out!!`);
        res.clearCookie("connect.sid");
        res.redirect("/login");
      }
    });
  },

  adminLogout: (req, res) => {
    req.logOut(err => {
      if (err) {
        logger.error(`Admin logout error for user: ${req.user ? req.user.email : "unknown"} - ${err.message}`);
      } else {
        logger.info(`Admin logged out: ${req.user ? req.user.email : "unknown"}`);
        req.flash("success", `Logged Out!!`);
        res.clearCookie("connect.sid");
        res.redirect("/admin/login");
      }
    });
  },
};
