const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const employeeSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    gender: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true,
        unique: true
    },
    age: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    confirmpassword: {
        type: String,
        required: true
    },
    tokens:[{
        token:{
            type: String,
            required: true
        }
    }]
})

// We use .env file to hide our backend private data from outside world
employeeSchema.methods.generateAuthToken = async function(){
    try {
        console.log(this._id)
        const token = await jwt.sign({_id:this._id.toString()}, process.env.SECRET_KEY)
        this.tokens = this.tokens.concat({token})
        // console.log(token)
        const check = await this.save()
        // console.log(check)
        return token
    } catch (error) {
        res.send("The error part" + error)
        console.log("The error part" + error)
    }
}

// It is a middleware which gets every data before storing into the database and do some work on that
// and then perform the save() function on it.
// there are two methods pre() and post()
// pre : to modified data before storing on to the database
// post: to get data after storing onto the database means after performing the save() method
// this middleware will run everytime a data wants to be stored in the database 
// so we have to make check for which field this method is going to take action
// so we make use of isModified() function and it takes the field as a arguement
// below function will runs for every field and it only pass into the if statement when the 
// turn of field password came
// after getting data and before calling save() method
employeeSchema.pre("save", async function(next){

    if(this.isModified("password")){
        // console.log(`The current password is ${this.password}`)
        this.password = await bcrypt.hash(this.password, 10)
        // console.log(`The current password is ${this.password}`)
        
        this.confirmpassword = await bcrypt.hash(this.password, 10)
    }
    next()
})

// now we need to create the collection

const Register = new mongoose.model("Register", employeeSchema)

module.exports = Register