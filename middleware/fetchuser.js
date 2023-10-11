var jwt = require('jsonwebtoken');
const JWT_secret = "harryisagoodb$oy"

const fetchuser = async (req, res, next)=>{

    const token = req.header('auth-token');
    if(!token){
        return res.status(401).send({error:'please authinticate using a valid token'})
    }
    try {
        const data = jwt.verify(token,JWT_secret);
        req.user = data.user;
    next()
    } catch (error) {
        res.status(400).send({error:'problems'})

    }
}

module.exports = fetchuser