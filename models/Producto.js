const mongoose = require('mongoose');

const ProductoSchema = mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    stock: {
        type: Number,
        require: true,
        trim: true
    },
    precio: {
        type: Number,
        require: true,
        trim: true
    },
    marca: {
        type: String,
        required: true,
        trim: true
    },
    proveedor: {
        type: String,
        required: true,
        trim: true
    },
    creado: {
        type: Date,
        default: Date.now()
    }
});



module.exports = mongoose.model('Producto', ProductoSchema);