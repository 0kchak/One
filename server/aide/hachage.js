// Import
const bcrypt = require("bcrypt");

/**
 * Fonction asynchrone permettant de hacher le mot de passe.
 *
 * @param password - le mot de passe à hacher
 * @return - Promise : soit une erreur, soit le haché
 */
const hashPassword = async (password) => {
  return new Promise((resolve, reject) => {
    bcrypt.genSalt(12, (err, hash) => {
      if (err) {
        reject(err);
      }
      bcrypt.hash(password, hash, (err, hash) => {
        if (err) {
          reject(err);
        }
        resolve(hash);
      });
    });
  });
};

/**
 * Fonction asynchrone pour comparer un mot de passe avec un haché
 * pour vérifier si l'on hache le mot de passe, on retrouve le haché donné.
 *
 * @param password - un mot de passe
 * @param hash - un haché à comparer avec le haché du mot de passe donné
 */
const comparePassword = async (password, hash) => {
  return bcrypt.compare(password, hash);
};

// Export
module.exports = { hashPassword, comparePassword };
