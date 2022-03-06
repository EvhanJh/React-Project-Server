const express = require("express");
const server = express();
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const bcrypt = require('bcrypt');
const saltRounds = 10;

mongoose.connect("mongodb://localhost/db_project",{useNewUrlParser:true})
mongoose.connection.on("open", () => console.log("Je suis connecté à ma base Mongo DB"))

// const Produits = require('./Models/produit_model')
const Users = require("./Models/user_model")
const {hash} = require("bcrypt");

server.use(cors())
server.use(bodyParser.json())

// Récupérer la liste des utilisateurs
server.get("/users", async function (req, res) {
    const infos = await Users.find({})
    res.json(infos)
})

// Route d'inscription
server.post("/users/register", async function (req, res) {
    const elem = req.body;
    const search_user = await Users.findOne({email: elem.email})
    if(search_user == null) {
        bcrypt.hash(elem?.password, saltRounds).then(async hash => {
             const infos = await Users.create({email: elem?.email, password: hash, meteos: []});
            res.json({error: false, msg: infos})
        });
    } else {
        res.json({error: true, msg: "L'email est déjà utilisée pour un autre compte"})
    }
})

// Route de connexion
server.post("/users/login", async function (req, res) {
    const elem = req.body;
    const search_user = await Users.findOne({email: elem.email})
    if(search_user !== null) {
        bcrypt.compare(elem?.password, search_user.password, function(err, result) {
            if(result) {
                res.json({error: false, msg: search_user});
            }
            else {
                res.json({error: true, msg: "Le mot de passe ne correspond pas à l'utilisateur"});
            }
        });
    } else {
        res.json({error: true, msg: "Le compte n'existe pas"});
    }
})

// Route de mise à jour du compte
server.put("/users/:id", async function (req, res) {
    const { id } = req.params
    const elem = req.body
    const account = await Users.findOne({_id: id})
    bcrypt.compare(elem?.password, account.password, async function (err, result) {
        if (result) {
            bcrypt.hash(elem?.newpassword, saltRounds).then(async hash => {
                const infos = await Users.updateOne({_id: id}, {
                    $set: {
                        password: hash
                    }
                })
            });
            const account_update = await Users.findOne({_id: id})
            res.json({error: false, msg: account_update});
        } else {
            res.json({error: true, msg: "Le mot de passe est incorrect"});
        }
    });
})

// Route de suppression du compte
server.delete("/users/:id", async function (req, res) {
    const { id } = req.params
    const infos = await Users.deleteOne({ _id: id })
    console.log(infos)
    res.writeHead(200)
    res.end()
})

// Route d'ajout de meteos
server.put("/users/:id/meteo", async function (req, res) {
    const { id } = req.params
    console.log(id);
    const elem = req.body.city;
    const account = await Users.findOne({_id: id})
    console.log(account)
    console.log(account.meteos)
    console.log(elem);
    if(!account.meteos.includes(elem)) {
        const account_put = await Users.updateOne({_id: id}, {
            $push: {
                meteos: elem
            }
        })
        const account_update = await Users.findOne({_id: id})
        res.json({error: false, msg: account_update});
    } else {
        res.json({error: true, msg: "La ville est déjà enregistrée"});
    }
})

// Route de suppression de meteo
server.put("/users/:id/meteo/:city", async function (req, res) {
    const { id } = req.params
    const { city } = req.params
    console.log(city)
    console.log(id)
    const account_put = await Users.updateOne({_id: id}, {
        $pull: { meteos: { $in: [city.toLowerCase()] } }
    })
    const account_update = await Users.findOne({_id: id})
    res.json({error: false, msg: account_update});
})

server.listen(3110)