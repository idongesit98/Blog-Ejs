const jwt = require('jsonwebtoken')
const UserModel = require('../Model/user_model')

const validateToken = async(req,res,next) => {
    try {
        let token = req.cookies.jwt;
        console.log("Show token: ",token)

        if(!token){
            console.log('No token found, redirecting to login')
            return res.redirect('/login')
        }

        let validToken;
        try {
            validToken = jwt.verify(token, process.env.JWT_SECRET)
        } catch (error) {
            console.log('Token verification failed:', error.message)
            //Handling jwt token errors
            if (error.name === 'TokenExpiredError') {
                return res.status(401).render( 'login',{
                    message:"Session expired. Please log in again"
                });
            }

            return res.status(403).render('login',{
                message:'Unauthorized: Invalid token'
            });       
        }
            const user = await UserModel.findOne({email:validToken.email})
            if (!user) {
                console.log('User not found in the database: ', validToken.email)
                return res.status(403).render('login',{
                    message:'Unauthorized: User does not exist'
                })
            }
            req.user = user
            console.log('User authenticated:', user.email)
            next()
    } catch (error) {
        //other errors
        console.error('Error in token validation middleware:', error.message)
        return res.status(500).render('login',{
            message:'Internal server error',
            error:error.message
        })
    }  
}

const isAuthenticated = (req, res, next) => {
    if (req.user) {
        console.log('Authenticated User:', req.user.email);
        return next();
    }
    return res.redirect('/login');
};

module.exports = {validateToken, isAuthenticated}