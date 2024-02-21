const jwt = require('jsonwebtoken');
const User = require('../models/user');

const authenticate = async (req, res, next) => {

    try {
        const token = req.header('Authorization');
        //console.log(token);
        if(!token){
          return res.status(401).json({message:'Authentication Token missing',success:false})
        }
        const user = jwt.verify(token, 'secretkey');

        //console.log('userID >>>> ', user.id)
        
        const data=await User.findById(user.id);
         //console.log("data",data);

         req.user=data;   ////very important line req.user used next line as wll
         
         //console.log("req.user", req.user);
         next();

      } catch(err) {
        console.log(err);
        return res.status(401).json({success: false})
        // err
      }

}

module.exports = {
    authenticate
}