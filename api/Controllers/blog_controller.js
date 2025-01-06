const BlogService = require("../Services/blog_services")

const CreatePost = async (req,res) => {
    const payload = req.body;
    const user = req.user;
    console.log(user)

    try {
        const serviceResponse = await BlogService.createPost({
            title: payload.title,
            description:payload.description,
            body:payload.body,
            tags:payload.tags,
            author:payload.author,
            state:payload.state,
            user,
            role:payload.role
        })
        if(serviceResponse.success){
            return res.redirect('/blog/all-posts')
        }
    
        return res.status(serviceResponse.code).render('create',{message:serviceResponse.message})    
    } catch (error) {
        console.error(error)
        return res.status(500).render('error', {message:'Internal Server error'})
    }
 }

const GetPost = async (req,res) => {
    const postId = req.params.postId

    try {
        const serviceResponse = await BlogService.GetPost({ postId });

        if (serviceResponse.data.post) {
            const blog = serviceResponse.data.post; // Updated variable
            return res.status(serviceResponse.code).render('single', {
                blogs: blog,
            });
        } else {
            return res.status(404).render('error', { message: 'Post not found' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).render('error', { message: 'Internal Server Error' });
    }
}

const GetUpdatePost = async (req,res) => {
    const postId = req.params.postId

    try {
        const serviceResponse = await BlogService.GetPost({ postId });

        if (serviceResponse.data.post) {
            const blog = serviceResponse.data.post; // Updated variable
            return res.status(serviceResponse.code).render('update', {
                blogs: blog,
                created_at: dayJs(blog.created_at).format('MMMM DD, YYYY h:mm A')
            });
        } else {
            return res.status(404).render('error', { message: 'Post not found' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).render('error', { message: 'Internal Server Error' });
    }
}

const GetAllPost = async (req,res) => {
    //const {page = 1,perPage = 20} = req.query;
    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.perPage) || 20;
    const state = req.query.state || null;
    const user = req.user || null;
    const author = req.query.author || null;
    const title = req.query.title || null;
    const tags = req.query.tags ? req.query.tags.split(',') : null;
    const sortOrder = req.query.sortOrder || "desc";
    const sortBy = req.query.sortBy || "created_at"
    
    try {
        const serviceResponse = await BlogService.GetAllPost({
            page,perPage,user,state,author,title,tags,sortOrder,sortBy
        });
        
        const blogs = serviceResponse?.data?.posts || [];

        return res.status(serviceResponse?.code || 200).render('blog',{
            blogs:blogs,
            user:req.user,
        })
        

    } catch (error) {
        console.error(error)
        return res.status(500).render('error', {message: 'Internal Server Error'})
    }
}

const UpdatePost = async (req,res) => {
    const postId = req.params.postId //extract the post id from the url parameters
    const user = req.user //extract the logged in user from the request

    try {
        const {title, content, author, state} = req.body;
        const serviceResponse = await BlogService.UpdatePost({
            postId,user, title, content, author,state
        })
        if (serviceResponse.data.post) {
           const blog = serviceResponse.data.post
           return res.status(serviceResponse.code).render("update",{
            blogs:blog
        })
        }else {
            return res.status(404).render('error', {message:"Update not possible"})
        }
    } catch (error) {
        console.error(error);
        return res.status(500).render('error', { message: 'Internal Server Error' });
    }
}

const DeletePost = async (req,res) => {
    const postId = req.params.postId
    const user = req.user

    try {
        const serviceResponse = await BlogService.DeletePost({
            postId,user
        })
        if (serviceResponse.code === 200) {
            return res.redirect('/blog?deleted=true')
        }else{
            return res.status(serviceResponse.code).render('error', {message:serviceResponse.message})
        }
    } catch (error) {
        console.error(error)
        return res.status(500).render('error',{message:"Internal server error"})
    }
}

module.exports = {
    CreatePost,
    GetAllPost,
    GetPost,
    GetUpdatePost,
    UpdatePost,
    DeletePost
}