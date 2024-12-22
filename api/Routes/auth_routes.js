const express = require('express')
const routes = express.Router()
const authController = require('../Controllers/auth_controller');
const { validateToken, isAuthenticated } = require('../middleware/auth_middleware');

routes.get('/', validateToken, isAuthenticated, (req,res) => {
    res.render('index', {user:req.user});
});


routes.get('/login', (req,res) => {
    res.render('login');
})

routes.get('/sign-up', (req,res) => {
    res.render('signup');
})


routes.post('/sign-up',authController.signUp)

routes.post('/login',authController.login);

module.exports = routes