

import isEmail from 'validator/lib/isEmail';
import isMobilePhone from 'validator/lib/isMobilePhone';


const validator = {
    validatePassword: (password, passwordAgain, alreadySubmited) => {

        if(password == "" && passwordAgain == "" && !alreadySubmited){
            return false
        }
    
        if(password.length < 6){
            return "Minimum 6 characters"
        }
    
    
        return false;
    },

    validatePasswordAgain: (password, passwordAgain, alreadySubmited) => {

        if(password == "" && passwordAgain == "" && !alreadySubmited){
            return false
        }
    
        if(passwordAgain !== password){
            return "Passwords not match"
        }
    
    
        return false;
    },

    validateEmail: (email, alreadySubmited) => {
        if(email == "" && !alreadySubmited){
            return false;
        }
        if(isEmail(email)){
            return false;
        }
        
        return "Invalid email format"
    },


    validateName: (name, alreadySubmited) => {

        if(name.length < 1 && alreadySubmited){
            return "Name is required"
        }
    
        return false
    },

    validateTel: (tel) => {

        if(tel == ""){
            return false;
        }
    
        if(isMobilePhone(tel)){
            return false
        }
    
        return "Invalid phone format"
    },



    validateNonNegativeNumber: (value, limit) => {
        value = Number(value)

        if(value < 0){
            return "The value must not be negative"
        }

        if(value > limit){
            return "Value limit exceed"
        }
        return false
    }
}

export default validator;