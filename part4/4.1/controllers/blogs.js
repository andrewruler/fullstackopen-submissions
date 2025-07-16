const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken') 
const tokenExtractor = require('../middleware/tokenExtractor')

blogsRouter.use(tokenExtractor)

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', {username: 1, name: 1})
  response.json(blogs)
})


blogsRouter.post('/', async (request, response) => {
  const token = request.token
  let decodedToken 
  try{
    decodedToken = jwt.verify(token, process.env.SECRET)
  } catch (e) {
    return response.status(401).json({error: 'token missing or invalid'})
  }

  const user = await User.findById(decodedToken.id)

  const blog = new Blog({...request.body, user: user._id})

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', async (request, response) => {
  const token = request.token
  let decodedToken 
  try{
    decodedToken = jwt.verify(token, process.env.SECRET)
  } catch (e) {
    return response.status(401).json({error: 'token missing or invalid'})
  }

  const blog = await Blog.findById(request.params.id)

  if(blog.user.toString() !== decodedToken.id){
    return response.status(403).json({error: 'only creator can delete blog'})
  }

  await Blog.findByIdAndDelete(request.params.id)
  response.status(204).end()
})

module.exports = blogsRouter        