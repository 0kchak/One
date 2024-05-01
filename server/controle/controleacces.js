// Imports
const User = require("../modeles/user");
const { hashPassword, comparePassword } = require("../aide/hachage");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

// Register Endpoint
/**
 * Fonction asynchrone pour créer un nouvel utilisateur dans la base de données,
 * et enregistre le mot de passe haché.
 *
 * Si le mail ou l'username existe déjà dans la base de données, une erreur
 * sera retournée.
 *
 * @param {Object} req - requête contenant les informations de l'utilisateur
 * @param {Object} res - reponse de la requête
 */
const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    let majerror = false;
    let msgerrormail = "";
    let msgerrorname = "";
    // Check si email dans la bdd
    const existmail = await User.findOne({ email });
    if (existmail) {
      msgerrormail = "Email is taken already";
      majerror = true;
    }
    // Check si username dans la bdd
    const existname = await User.findOne({ username });
    if (existname) {
      msgerrorname = "Username is taken already";
      majerror = true;
    }
    if (majerror == true) {
      return res.json({
        majerror,
        errormail: msgerrormail,
        errorname: msgerrorname,
      });
    }
    // Hachage du mot de passe
    const hashedpassword = await hashPassword(password);
    // Création de l'utilisateur dans la base de données avec mongoose
    const user = await User.create({
      username,
      email,
      password: hashedpassword,
    });
    return res.json(user);
  } catch (error) {
    console.log(error);
  }
};

// Login Endpoint
/**
 * Fonction asynchrone pour vérifier qu'un utilisateur existe dans
 * la base de données, et que l'username et le mot de passe sont corrects :
 * créer le cookie pour stocker le token signé si c'est le cas.
 *
 * Si l'username n'est pas existant, ou que le mot de passe ne
 * correspond pas à celui retrouvé dans la base de donnée,
 * retourne une erreur.
 *
 * @param {Object} req - requête contenant les informations de l'utilisateur
 * @param {Object} res - reponse contenant un header qui set le cookie
 */
const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check si l'username existe dans la bdd
    const user = await User.findOne({ username });
    if (!user) {
      return res.json({
        error: "Wrong username or password",
      });
    }
    // Check si le mot de passe est le bon
    const match = await comparePassword(password, user.password);
    if (match) {
      // Créer le token
      jwt.sign(
        { email: user.email, id: user._id, username: user.username },
        process.env.JWT_SECRET,
        {},
        (err, token) => {
          if (err) throw err;
          res.cookie("token", token,  {
            httpOnly: true,
            sameSite: "None",
            secure: true,
          }).json({ user });
        } 
      );
    } else {
      return res.json({
        error: "Wrong username or password",
      });
    }
  } catch (error) {
    console.log(error);
  }
};

/**
 * Fonction qui vérifie que le token récupéré est valide.
 *
 * Si il existe et est valide, retourne les informations de l'utilisateur.
 * Si il n'existe pas, ne retourne rien.
 *
 * @param {Object} req - requête contenant le token
 * @param {Object} res - reponse du serveur
 */
const getProfile = (req, res) => {
  const { token } = req.cookies;
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, {}, (err, user) => {
      if (err) throw err;
      res.json(user);
    });
  } else {
    res.json(null);
  }
};

const generateresetlink = (email) => {
  const token = jwt.sign({ email: email }, process.env.JWT_SECRET, {
    expiresIn: "10m",
  });
  return `https://onegame.vercel.app/reset_password/${token}`;
};

// forgotPassword Endpoint
const forgotPassword = async (req, res) => {
  const { email } = req.body;
  // Check si l'email existe dans la bdd
  const user = await User.findOne({ email });
  if (!user) {
    return res.json({
      error: "No user found with this email",
    });
  } else {
    const link = generateresetlink(email);
    const expediteur = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });

    const contenu = {
      from: process.env.EMAIL,
      to: req.body.email,
      subject: "Reset your password",
      html: `<h1>Reset your password</h1>
      <p>Click on this link to reset your password</p>
      <a href=${link}>${link}</a>`,
    };

    expediteur.sendMail(contenu, (err, _) => {
      if (err) {
        return res.json({
          error: "Something went wrong. Please try again later.",
        });
      }
    });
    return res.json({
      message: "Password reset link sent to your email",
    });
  }
};

const verifyToken = (token) => {
  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    if (!user) {
      return {
        error: "Invalid token",
      };
    }
    return { email: user.email };
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return {
        errorexpire: "Token expired",
      };
    } else {
      return {
        error: "Invalid token",
      };
    }
  }
};

const resetPassword = async (req, res) => {
  const { email, newPassword } = req.body;
  const hashedPassword = await hashPassword(newPassword);
  User.findOneAndUpdate(
    { email: email }, // Filtre l'utilisateur en utilisant son identifiant
    { $set: { password: hashedPassword } }, // Définissez le nouveau mot de passe
    { new: true } // Si vous voulez récupérer l'objet mis à jour, utilisez { new: true }
  )
    .then((_) => {
      return res.json(null);
    })
    .catch((_) => {
      return res.json({
        error: "Something went wrong while updating the password",
      });
    });
};

const getToken = (req, res) => {
  const { token } = req.cookies;
  return res.json({token : token})
}

// Export
module.exports = {
  registerUser,
  loginUser,
  getProfile,
  forgotPassword,
  verifyToken,
  resetPassword,
  getToken,
};
