const { body,validationResult } = require('express-validator')

const validator = (method) => {
  switch (method) {
    case 'registerUser': 
     return [ 
        body('email', 'Invalid email').notEmpty().isEmail(),
        body('password', 'password must be 8 character at least').isLength({min : 8}),
        body('phonenumber','Invalid phonenumber').notEmpty().isInt(),
        body('username').notEmpty().isString(),
        body('')
       ]   
    case 'loginUser': 
       return [ 
          body('email', 'Invalid email').notEmpty().isEmail(),
          body('password', 'password must be 8 character at least').isLength({min : 8}),
         ]   
    
  }
}

const validate = (req,res,next)=>{
  const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
  }
  next()
}

module.exports = {
  validator,
  validate
}