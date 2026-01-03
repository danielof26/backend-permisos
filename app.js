const express = require("express")
let jwt = require("jsonwebtoken")

let app = express()
let port = 8081

app.use(express.json())

app.use(["/permissions"], (req,res,next) => {
    console.log("middleware execution")

    let apikey = req.query.apikey
    if(apikey == undefined){
        res.status(401).json({error: "apikey required"})
        return
    }

    let infoApiKey = null
    try{
        infoApiKey = jwt.verify(apikey, "secret")
    } catch(error){
        res.status(401).json({error: "invalid token"})
        return
    }
    req.infoApiKey = infoApiKey

    next()
})

app.use(["/users"], (req,res,next) => {
    console.log("middleware execution")
    next()
})

let routerPermissions = require("./routers/routerPermissions")
app.use("/permissions", routerPermissions)
let routerUsers = require("./routers/routerUsers")
app.use("/users", routerUsers)
let routerLogin = require("./routers/routerLogin")
app.use("/login", routerLogin)

app.listen(port, () => {
    console.log("Servidor activo en " + port)
})