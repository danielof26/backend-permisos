const express = require("express")

let routerUsers = express.Router()

let users = require("../data/users")

routerUsers.get("/", (req,res) => {
    res.json(users.map( u => {return {id: u.id, email: u.email} }))
})

routerUsers.get("/:id", (req,res) => {
    let id = req.params.id
    if(id == undefined){
        res.status(400).json({error: "no id"})
        return
    }

    let user = users.find( u => u.id == id )
    if(user == undefined){
        res.status(400).json({error: "invalid id"})
        return
    }

    res.json( {id: user.id, email: user.email} )
})

routerUsers.post("/", (req,res) => {
    let email = req.body.email
    let password = req.body.password

    let errors = []
    if(email == undefined){
        errors.push("no email")
    }
    let user = users.find(u => u.email==email)
    if(user != undefined){
        errors.push("user already exists")
    }
    if(password == undefined){
        errors.push("no password")
    }
    if(password == undefined && password.length < 4){
        errors.push("password less than 4")
    }
    if(errors.length > 0){
        res.status(400).json({errors: errors})
        return
    }

    users.push({
        id: users.length+1,
        email: email,
        password: password
    })

    res.json({id: users.length})

})

module.exports = routerUsers