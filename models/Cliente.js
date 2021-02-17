const mongoose = require('mongoose');

const ClientesSchema = mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    apellido: {
        type: String,
        required: true,
        trim: true
    },
    fechaNac: {
        type: String,
        required: true,
        trim: true
    },
    telefono: {
        type: String,
        required: true,
        trim: true
    },
    /*
    //Estos campos seguramente van en otro modelo
    medicacion: {
        type: String,
        trim: true
    },
    productos: {
        type: String,
        trim: true
    },
    unas: {
        type: String,
        trim: true
    },
    cabello: {
        type: String,
        trim: true
    },
    cueroCab: {
        type: String,
        trim: true
    },
    */
    creado: {
        type: Date,
        default: Date.now()
    },
    usuarioAlta: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Usuario'
    }

    /*,
    Esto por el momento no es necesario,
    Se deja a modo de ejemplo
    Permite saber que usuario dio de alta al cliente
    
    usuarioAlta: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Usuario'
    }
    */

});


module.exports = mongoose.model('Cliente', ClientesSchema);