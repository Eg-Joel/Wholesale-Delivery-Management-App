const jwt = require('jsonwebtoken'); 

const verifyToken = (req,res,next)=>{
    const authHeader = req.headers.token;

    if(authHeader){
        const token = authHeader
          jwt.verify(token, process.env.jwtSEC , (err,user)=>{
            if(err) return res.status(400).json("some error occured")
            req.user= user;
            next()
        })
    }else{
        return res.status(400).json("Access token is not vaild")
    }
    
}



  const verifyTokenAdmin = (req, res, next) => {
    verifyToken(req, res, () => {
      
      if (req.user.isAdmin) {
        next();
      } else {
        res.status(403).json("Unauthorized");
      }
    });
  };
module.exports = {verifyToken, verifyTokenAdmin }