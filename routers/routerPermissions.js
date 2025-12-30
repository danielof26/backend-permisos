const express = require("express")

let routerPermissions = express.Router()

let permissions = require("../data/permissions")

routerPermissions.get("/", (req,res) => {
    res.json(permissions)
 })

module.exports = routerPermissions