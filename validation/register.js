var validator = require('validator')
var isEmpty = require('./is.empty')

module.exports = function validateRegisterInput(data) {
    let errors = {}

    if (!validator.isLength(data.name, { min: 2, max: 30 })) {
        errors.name = "Name Must be between 2 and 30 characters"
    }
    return {
        errors,
        isValid: isEmpty(errors)
    }

}