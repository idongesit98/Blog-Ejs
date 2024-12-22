const AuthService = require('../Services/auth_service')
const { GetAllPost } = require('../Services/blog_services')

const signUp = async(req,res) =>{
    const payload = req.body //this contain the username,password,phone number, email

    const signUpResponse = await AuthService.SignUp({
        first_name:payload.first_name,
        last_name:payload.last_name,
        email:payload.email,
        password:payload.password,
        phone_number:payload.phone_number
    })

    res.status(signUpResponse.code).render('signup',{signUpResponse})
}

const login = async(req,res) =>{
    const payload = req.body; //password email

    const loginResponse = await AuthService.Login({
        email:payload.email,
        password:payload.password
    })

    if(loginResponse.success){
        res.cookie('jwt', loginResponse.data.token, {httpOnly:true, secure:false})
        console.log('JWT token set:', loginResponse.data.token);
        console.log('User logged in:', loginResponse.data.user.email);
        
        return res.redirect('/blog')
    }    
    res.status(loginResponse.code).render('login',{message: loginResponse.message}) // changed json to render
}

module.exports = {signUp,login}