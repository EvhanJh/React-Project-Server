const express = require('express')
const server = express()
const cors = require('cors')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/db_eit', { useNewUrlParser: true })
mongoose.connection.on('open', () => {
    console.log('Je suis connecté à ma base Mongo DB')
})

const Produits = require('./Models/produits.model')

server.use(cors())
server.use(bodyParser.json())

server.get('/produits', async function (req, res) {
    const infos = await Produits.find()
    res.json(infos)
})

server.get('/produits/:id', async function (req, res) {
    const { id } = req.params
    const infos = await Produits.findOne({ _id: id })
    console.log(infos)
    res.json(infos)
})

server.post('/produits', async (req, res) => {
    const elem = req.body
    const infos = await Produits.create(elem)
    const status = infos._id ? 201 : 400
    res.writeHead(status)
    res.end()
})

server.put('/produits/:id', async (req, res) => {
    const { id } = req.params
    const elem = req.body
    const infos = await Produits.updateOne({ _id: id }, elem)
    console.log(infos)
    const status = infos.acknowledged ? 200 : 400
    res.writeHead(status)
    res.end()
})

server.delete('/produits/:id', async (req, res) => {
    const { id } = req.params
    const infos = await Produits.deleteOne({ _id: id })
    console.log(infos)
    res.writeHead(200)
    res.end()
})

server.listen(3100)