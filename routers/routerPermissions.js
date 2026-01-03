const express = require("express")

let routerPermissions = express.Router()

let permissions = require("../data/permissions")
let users = require("../data/users")
let jwt = require("jsonwebtoken")

routerPermissions.get("/", (req,res) => {
    let text = req.query.text

    let permissionsFiltered = permissions
    if(text != undefined) {
        permissionsFiltered = permissionsFiltered.filter( (p) => p.text.includes(text))
    }
    
    res.json(permissionsFiltered)
})

routerPermissions.get("/:id", (req,res) => {
    let id = req.params.id
    if(id == undefined){
        res.status(400).json({error: "no id"})
        return
    }

    let permission = permissions.find( p => p.id == id )
    if(permission == undefined){
        res.status(400).json({error: "invalid id"})
        return
    }

    res.json(permission)
})

routerPermissions.put("/:id", (req,res) => {
    let permissionId = req.params.id
    let text = req.body.text

    if(permissionId == undefined){
        res.status(400).json({error: "no id"})
        return
    }

    let permission = permissions.find(p => p.id == permissionId && p.userId == req.infoApiKey.id)
    if(permission == undefined){
        res.status(400).json({error: "no permission with this id"})
        return
    }

     if(text != undefined){
        permission.text = text
    }

    res.json({modified: true})
})

routerPermissions.put("/:id/approvedBy", (req,res) => {
    let user = users.find( u => u.id == req.infoApiKey.id)
    if(user.role != "admin"){
        res.status(401).json({error: "user is not admin"})
        return
    }

    let permissionId = req.params.id

    //validacion
    let permission = permissions.find( p => p.id == permissionId )
    if(permission == undefined) {
        return res.status(400).json({error: "no permisionId"})
    }

    permission.approvedBy.push(req.infoApiKey.id)

    res.json(permission)
})

routerPermissions.post("/",(req,res) => {
    let text = req.body.text

    let errors = []
    if(text == undefined){
        errors.push("no text in the body")
    }
    if(errors.length > 0) {
        res.status(400).json({errors: errors})
        return
    }

    let lastId = permissions[permissions.length-1].id
    permissions.push({
            id: lastId+1, 
            text: text, 
            approbedBy: [], 
            userId: req.infoApiKey.id
        },
    )

    res.json( {id: lastId+1} )

})

routerPermissions.delete("/:id", (req,res) => {
    let permissionId = req.params.id
    if(permissionId == undefined){
        res.status(400).json({error: "no id"})
        return
    }

    let permission = permissions.find(p => p.id == permissionId)
    if(permission == undefined){
        res.status(400).json({error: "no permission with this id"})
        return
    }
    let user = users.find( u => u.id == req.infoApiKey.id)
    if(user.role == "user" && permission.userId != req.infoApiKey.id){
        res.status(401).json({error: "is not your permission"})
        return
    }

    permissions = permissions.filter( p => p.id != permissionId )

    res.json({deleted: true})
    
})

module.exports = routerPermissions