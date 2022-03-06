const mongoose = require('mongoose');
const schema = mongoose.Schema({
    ean: String,
    marque: String,
    nom: String,
    img: String,
    imgSmall: String,
    nutriscore: String,
})

module.exports = mongoose.model('produits', schema)