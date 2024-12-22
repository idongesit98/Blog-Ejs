const express = require('express');
const cookieParser = require('cookie-parser')
const path = require('path')
const AuthRoutes = require('./Routes/auth_routes')
const BlogRoutes = require('./Routes/blog_routes')

const app = express();

const morgan = require('morgan')


app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({extended:false}))

//app.set('views', 'views');
app.set('view engine', 'ejs');
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, 'public')))

//define routes
app.use(morgan('tiny'))
app.use('/', AuthRoutes)
app.use('/blog',BlogRoutes)

app.get('/', (req,res) => {
    res.json({message:'Welcome to Blog Api'})
})

app.use((error,req,res,next) => {
    console.log("Error Handling Middleware called")
    console.log('Path',req.path)
    console.log('Error: ',error)

    if (error.type == 'NOT_FOUND') {
        res.status(500).send(error)
    }else if (error.type == 'NOT_FOUND') {
        res.status(404).send(error)
    }else{
        res.status(500).send(error)
    }

    next()
})


module.exports = app;

