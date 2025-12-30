const express = require("express")

let routerPermissions = express.Router()

let permissions = require("../data/permissions")

routerPermissions.get("/", (req,res) => {
    res.json(permissions)
})

routerPermissions.post("/",(req,res) => {
    let text = req.body.text
    let userId = req.body.userId

    let lastId = permissions[permissions.length-1].id

    permissions.push(
         {id: lastId+1, text: text, approbedBy: [], userId: userId},
    )

    res.json( {id: lastId+1} )

})

module.exports = routerPermissions