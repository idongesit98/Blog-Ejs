const express = require('express')
const routes = express.Router()
const BlogController = require('../Controllers/blog_controller')
const AuthMiddleware = require('../middleware/auth_middleware')
const BlogMiddleware = require("../middleware/blog_middleware")
const { route } = require('./blog_routes')

routes.get('/', AuthMiddleware.validateToken, BlogController.GetAllPost);
routes.get('/all-posts',AuthMiddleware.validateToken, BlogController.GetAllPost)

routes.get('/create', AuthMiddleware.validateToken, (req,res) => {
    res.render('create')
})
routes.post('/create',BlogMiddleware.validateCreatePost, AuthMiddleware.validateToken, BlogController.CreatePost);

// routes.get('/:postId',  AuthMiddleware.validateToken, (req,res) => {
//     res.render('single')
// })
routes.get('/:postId', AuthMiddleware.validateToken,BlogController.GetPost);

routes.get('/update-post/:postId', AuthMiddleware.validateToken, BlogController.GetUpdatePost)

routes.patch('/update-post/:postId', AuthMiddleware.validateToken,BlogController.UpdatePost)

routes.post('/delete-post/:postId',AuthMiddleware.validateToken, BlogController.DeletePost)

module.exports = routes