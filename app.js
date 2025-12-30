const express = require("express")

let app = express()
let port = 8081

app.use(express.json())

let routerPermissions = require("./routers/routerPermissions")
app.use("/permissions", routerPermissions)
let routerUsers = require("./routers/routerUsers")
app.use("/users", routerUsers)

app.listen(port, () => {
    console.log("Servidor activo en " + port)
})