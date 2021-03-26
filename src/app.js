require('dotenv').config()
const express = require('express')
const app = express()
const hbs = require('hbs')
const path = require('path')
const port = process.env.PORT || 8000

require('./db/conn')
const Register = require('./models/register')
const bcrypt = require('bcryptjs')
const cookieParser = require('cookie-parser')
const auth = require('./middleware/auth')

const static_path = path.join(__dirname, "../public")
const template_path = path.join(__dirname, "../templates/views")
const partials_path = path.join(__dirname, "../templates/partials")

app.use(express.json())
// it basically tells the express that whatever data i m passing through 
// form , i should get that data , u cant show that undefined
app.use(express.urlencoded({extended:false}))
app.use(cookieParser())

app.use(express.static(static_path))
app.set("view engine", "hbs")
app.set("views", template_path)
hbs.registerPartials(partials_path)

// console.log(process.env.SECRET_KEY)

app.get("/", (req, res) => {
    res.render("index")
})

app.get("/secret", auth, (req, res) => {
    // console.log(`The JWT is1: ${req.cookies.JWT}`)
    res.render("secret")
})

app.get("/logout", auth, async (req, res) => {
    try {
        console.log(req.token)
        // To Logout from one particular devices
        // To delete one token from database
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token != req.token
        })
        
        // Netflix like logout
        // To Logout from every devices
        // To delete all tokens from the array
        //req.user.tokens = []
        
        console.log(req.user)
        res.clearCookie("JWT")
        await req.user.save()
        res.render("login")
    } catch (error) {
        res.status(500).send(error)
    }
})

app.get("/register", (req, res) => {
    res.render("register")
})

app.post("/register", async (req, res) => {
    try {
        const password = req.body.password
        const confirmpassword = req.body.confirmpassword
        // console.log(req.body)
        if(password === confirmpassword){
            // you can use this also but make sure the name attribute is same as the fields name in the
            // database below.
            //const registerEmployee = new Register(req.body)
            const registerEmployee = new Register({
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                email: req.body.email,
                gender: req.body.gender,
                password: req.body.password,
                confirmpassword: req.body.confirmpassword,
                phone: req.body.phone,
                age: req.body.age,
            })

            const token = await registerEmployee.generateAuthToken()

            // The res.cookie() function is used to set the cookie name to value.
            // The value parameter may be a string or object converted to JSON

            // HttpOnly is a flag that can be included in a Set-Cookie response header. 
            // The presence of this flag will tell browsers to
            // not allow client side script access to the cookie (if the browser supports it)

            // Syntax:
            // res.cookie(name, value, [options])

            res.cookie("JWT", token, {
                expires: new Date(Date.now() + 600000),
                httpOnly: true
            })


            const register = await registerEmployee.save()
            res.status(201).render("index")
        }else{
            res.send("password are not matching")
        }
    } catch (error) {
        res.status(400).send(error)
    }
})

app.get("/login", (req, res) => {
    res.render("login")
})

app.post('/login', async (req, res) => {
    try {
        const email = req.body.email
        const password = req.body.password
        //Returns one document that satisfies query criteria on the collection or view
        const useremail = await Register.findOne({email: email})
        // res.status(200).send(useremail)
        // console.log(useremail)
        // it will simply compare the password which user writes and the password stored in the database
        const isMatch = await bcrypt.compare(password, useremail.password)

        const token = await useremail.generateAuthToken()

        res.cookie("JWT", token, {
            expires: new Date(Date.now() + 600000),
            httpOnly: true
        })

        if(isMatch){
            res.status(200).render("index")
        }else{
            // Dont exposes to many things about your backend server
            // just only send response as invalid login credentials so hacker cant understand
            // what things are wrong or right
            res.status(400).send("Invalid login credentials")
        }
    } catch (error) {
        res.status(400).send("Invalid login credentials")
    }


})


//bcrypt usecase:

// const bcrypt = require('bcryptjs')

// const securePassword = async (password) => {

//     const passwordHash = await bcrypt.hash(password, 10)
//     console.log(passwordHash)

//     const passwordMatch = await bcrypt.compare(password, passwordHash)
//     console.log(passwordMatch)
//     //$2a$10$Oz8n653mZsBDWPz.Z8DH8OImmTwGD3GfvI265ZPmpK/n9Sec0R/rO
//     //true
// }

// securePassword("jay@123")


// JsonWebToken JWT usecase:

// const jwt = require('jsonwebtoken')

// const createToken = async () => {
//     const token = await jwt.sign({_id: "605c66e1531304282c0595c7"}, "myfjfjkkskfjfjfjkksksskkjjjfjjfjjfllslllsf", {
//         expiresIn: "2 minutes"
//     })
//     console.log(token)

//     const userVer = await jwt.verify(token, "myfjfjkkskfjfjfjkksksskkjjjfjjfjjfllslllsf")
//     console.log(userVer)
// }

// createToken()

app.listen(port, () => {
    console.log(`listening to port no ${port}`)
})