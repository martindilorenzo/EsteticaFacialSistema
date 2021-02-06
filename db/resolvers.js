const Usuario = require('../models/Usuario');
const Producto = require('../models/Producto');
const Cliente = require('../models/Cliente');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: 'variables.env'});


const crearToken = (usuario, secreta, expiresIn) => {
    //console.log(usuario);
    const {id, email, nombre, apellido} = usuario;

    return jwt.sign( {id, email, nombre}, secreta, {expiresIn} ) 

}

//Resolvers
const resolvers = {
    Query: {
        obtenerUsuario: async (_, {token}) => {
            const usuarioId = await jwt.verify(token, process.env.SECRETA);

            return usuarioId;
        },

        obtenerProductos: async () => {
            try {
                const productos = await Producto.find({});

                return productos;
            } catch (error) {
                console.log(error);
            }
        },

        obtenerProducto: async(_, {id}) => {
            //revisar si producto existe
            const producto = await Producto.findById(id);
            if (!producto){
                throw new Error('Producto no encontrado');
            }

            return producto;
        },

        obtenerClientes: async() => {
            try {
                const clientes = await Cliente.find({});
                return clientes;
            } catch (error) {
                console.log(error);
            }
        }
    },

    Mutation: {
        nuevoUsuario: async (_, {input} ) => {            
            const { email, password} = input;

            //Revisar si usuario esta registrado
            const existeUsuario = await Usuario.findOne({email});
            if (existeUsuario) {
                throw new Error('El usuario ya esta registrado');
            }
            console.log(existeUsuario);

            //Hashear password
            const salt = await bcryptjs.genSalt(10);
            input.password = await bcryptjs.hash(password, salt);
            
            try {
                //Guardar en db
                const usuario = new Usuario(input);
                usuario.save();
                return usuario;
            } catch (error){
                console.log(error);
            }
        },

        autenticarUsuario: async (_, {input}) => {

            const {email, password} = input;
            //Si el usuario existe
            const existeUsuario = await Usuario.findOne({email});
            if (!existeUsuario) {
                throw new Error('El usuario no existe');
            }

            //revisar password
            const passwordCorrecto = await bcryptjs.compare(password, existeUsuario.password);
            if (!passwordCorrecto){
                throw new Error('El password es incorrecto');
            }
            
            //Crear token
            return {
                token: crearToken(existeUsuario, process.env.SECRETA, '24h' )
            }
        },

        nuevoProducto: async (_, {input}) => {
            //Revisar su producto esta registrado
            const {nombre} = input;
            const existeProducto = await Producto.findOne({nombre});
            if (existeProducto){
                throw new Error('Existe otro producto con el mismo nombre');
            }
            //console.log(existeProducto);

            try {
                const producto = new Producto(input);

                //guardar en db
                const resultado = await producto.save();

                return resultado;
            } catch (error){
                console.log(error);
            }
        },

        actualizarProducto: async (_, {id, input}) => {
            //revisar si producto existe
            let producto = await Producto.findById(id);
            if (!producto){
                throw new Error('Producto no encontrado');
            }

            //Guardar producto en db
            producto = await Producto.findOneAndUpdate({_id: id}, input, {new: true});

            return producto;
        },

        eliminarProducto: async(_, {id}) => {
            //revisar si producto existe
            let producto = await Producto.findById(id);
            if (!producto){
                throw new Error('Producto no encontrado');
            }

            //Eliminar
            await Producto.findByIdAndDelete({_id: id});

            return "El producto ha sido eliminado";
        },

        nuevoCliente: async(_, {input}) => {
            //revisar si cliente ya existe
            
            const {nombre, apellido} = input;
            const existeCliente = await Cliente.findOne({nombre, apellido});
            if (existeCliente) {
                throw new Error('El cliente ya esta registrado');
            }

            //guardar en db
            try {
                const nuevoCliente = new Cliente(input);
                const resultado = nuevoCliente.save();

                return resultado;
            } catch (error) {
                console.log(error);
            }
        }


    }
}

module.exports = resolvers;