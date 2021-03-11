const mongoose = require('mongoose');

const PedidoSchema = mongoose.Schema({
    productos: {
        type: Array,
        required: true
    },
    total: {
        type: Number,
        required: true
    },
    cliente: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Cliente'
    },
    usuarioAlta: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Usuario'
    },
    estado: {
        type: String,
        default: "Pendiente"
    },
    creado: {
        type: Date,
        default: Date.now()
    }


});


module.exports = mongoose.model('Pedido', PedidoSchema);