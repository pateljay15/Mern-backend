# Mern-backend
Complete End-to-End registration and login, logout using NodeJS, ExpressJS, MongoDB, Mongoose and JWT

Reference to login, logout, registration using JWT 
Technologies used to maintain secure authentication & authorization:
BcryptJS
jsonwebtoken

Added the generated JWT by middleware methods in the cookies and maintianing the session of the user and storing that token in the MongoDB database.

If user successful login then only he can use the secret pages of the website by comparing token.

ADDTIONAL FUNCTIONALITY:
Also added the functionality like , if user logout in one particular device , he logout from all the devices he logged in before similar to NETFLIX Logout
