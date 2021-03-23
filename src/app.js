const express = require('express')
const app = express()
const hbs = require('hbs')
const path = require('path')
const port = process.env.PORT || 8000

require('./db/conn')
const Register = require('./models/register')

const static_path = path.join(__dirname, "../public")
const template_path = path.join(__dirname, "../templates/views")
const partials_path = path.join(__dirname, "../templates/partials")

app.use(express.json())
// it basically tells the express that whatever data i m passing through 
// form , i should get that data , u cant show that undefined
app.use(express.urlencoded({extended:false}))

app.use(express.static(static_path))
app.set("view engine", "hbs")
app.set("views", template_path)
hbs.registerPartials(partials_path)

app.get("/", (req, res) => {
    res.render("index")
})

app.get("/register", (req, res) => {
    res.render("register")
})

app.post("/register", async (req, res) => {
    try {
        const password = req.body.password
        const confirmpassword = req.body.confirmpassword
        console.log(req.body)
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

app.listen(port, () => {
    console.log(`listening to port no ${port}`)
})