// Imports
import axios from "axios";

// Class du Signup/Register
class Signup {
  constructor(form, fields, setErrorMsg, navigate, setFormData) {
    this.form = form;
    this.fields = fields;
    this.setErrorMsg = setErrorMsg;
    this.navigate = navigate;
    this.transitionform = { ...this.form };
    this.setFormData = setFormData;
    this.validateonSubmit();
  }

  /**
   * Fonction asynchrone qui vérifie que toutes les conditions pour chaque champ sont respectées,
   * et change le message d'erreur affiché, qui est donc vide par défaut.
   */
  async validateonSubmit() {
    let error = 0;
    Object.keys(this.form).forEach((field) => {
      if (this.validateFields(field) == false) {
        error++;
      }
    });
    if (error == 0) {
      const username = this.form.username.value;
      const email = this.form.email.value;
      const password = this.form.password.value;
      try {
        // Envoie la requête pour enregistrer un nouveau compte
        const { data } = await axios.post("/register", {
          username,
          email,
          password,
        });
        let errorform = { ...this.form };
        Object.keys(errorform).forEach((key) => {
          errorform[key].errorMsg = "";
        });
        if (data.majerror) {
          if (data.errormail) {
            errorform["email"] = {
              ...this.form["email"],
              errorMsg: data.errormail,
            };
          }
          if (data.errorname) {
            errorform["username"] = {
              ...this.form["username"],
              errorMsg: data.errorname,
            };
          }
          this.setFormData(errorform);
        } else {
          this.navigate("/dashboard");
        }
      } catch (error) {
        console.log(error);
      }
    }
  }

  /**
   * Fonction vérifiant que tous les champs sont remplis selon des critères pré-établis.
   * @param field : champ à vérifier
   */
  validateFields(field) {
    const majusculeRegex = /[A-Z]/;
    const chiffreRegex = /\d/;
    const specialRegex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
    const mailcompo = /^[^\s@]+@[^\s@]+.[^\s@]+$/;
    // Check si le input est vide
    if (this.form[field].value.trim() === "") {
      this.setStatus(field, `${field} cannot be blank`);
      this.setErrorMsg(this.transitionform);
      return false;
    } else {
      switch (field) {
        // Verifie que l'email est au bon format
        case "email": {
          if (!mailcompo.test(this.form[field].value)) {
            this.setStatus(field, `${field} has not the right format.`);
            this.setErrorMsg(this.transitionform);
          } else {
            this.setStatus(field, "");
            this.setErrorMsg(this.transitionform);
            return true;
          }
        }
        // Verifie que le nom d'utilisateur possède au moins 4 caractères
        // et qu'il ne contient pas de caractères spéciaux.
        case "username": {
          if (this.form[field].value.length < 4) {
            this.setStatus(field, `${field} must be at least 4 characters`);
            this.setErrorMsg(this.transitionform);
            return false;
          } else if (specialRegex.test(this.form[field].value)) {
            this.setStatus(
              field,
              `${field} cannot contain a special character`
            );
            this.setErrorMsg(this.transitionform);
            return false;
          }
          this.setStatus(field, "");
          this.setErrorMsg(this.transitionform);
          return true;
        }
        // Vérifie que le mot de passe possède au moins 8 caractères.
        case "password": {
          if (this.form[field].value.length < 8) {
            this.setStatus(field, `${field} must be at least 8 characters`);
            this.setErrorMsg(this.transitionform);
            return false;
          } else {
            // Vérifie que le mot de passe possède au moins une majuscule
            if (!majusculeRegex.test(this.form[field].value)) {
              this.setStatus(
                field,
                `${field} must have at least an upper case`
              );
              this.setErrorMsg(this.transitionform);
              return false;
            }
            // Vérifie que le mot de passe possède au moins un chiffre
            else if (!chiffreRegex.test(this.form[field].value)) {
              this.setStatus(field, `${field} must have at least a number`);
              this.setErrorMsg(this.transitionform);
              return false;
            }
            // Vérifie que le mot de passe possède au moins au caractère spécial
            else if (!specialRegex.test(this.form[field].value)) {
              this.setStatus(
                field,
                `${field} must have at least a special character`
              );
              this.setErrorMsg(this.transitionform);
              return false;
            }
            // Si toutes les conditions sont validées
            this.setStatus(field, "");
            this.setErrorMsg(this.transitionform);
            return true;
          }
        }
        default: {
        }
      }
    }
  }

  /**
   * Rajoute au champ un message d'erreur sur l'objet de transition afin
   * d'appliquer tous les setters d'une boucle.
   * @param field : champ vérifié
   * @param message : message d'erreur
   */
  setStatus(field, message) {
    this.transitionform[field] = {
      ...this.transitionform[field],
      errorMsg: message,
    };
  }
}

// Export
export default Signup;
