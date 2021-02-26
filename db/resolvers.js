const Usuario = require('../models/Usuario');
const Producto = require('../models/Producto');
const Cliente = require('../models/Cliente');
const Pedido = require('../models/Pedido');
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
        },

        obtenerClientesUsuario: async (_, {}, ctx) => {
            try {
                const clientes = await Cliente.find({usuarioAlta: ctx.usuario.id.toString() });
                return clientes;
            } catch (error) {
                console.log(error);
            }
        },

        obtenerCliente: async(_, {id}, ctx) => {
            const cliente = await Cliente.findById(id);
            
            //Verificar que el cliente exista
            if (!cliente){
                throw new Error('Cliente no encontrado');
            } 

            //Quien lo crea solo puede acceder (opcional)
            if (cliente.usuarioAlta.toString() !== ctx.usuario.id ) {
                throw new Error('No tienes acceso para ver el cliente');
            }

            return cliente;
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

        nuevoCliente: async(_, {input}, ctx) => {

            //console.log(ctx);
            const {nombre, apellido} = input;

            //revisar si cliente ya existe          
            const existeCliente = await Cliente.findOne({nombre, apellido});
            if (existeCliente) {
                throw new Error('El cliente ya esta registrado');
            }

            //guardar en db
            try {
                const nuevoCliente = new Cliente(input);
                nuevoCliente.usuarioAlta = ctx.usuario.id;
                const resultado = nuevoCliente.save();

                return resultado;
            } catch (error) {
                console.log(error);
            }
        },

        actualizarCliente: async(_, {id, input}, ctx) => {
            //Verificar si existe
            let cliente = await Cliente.findById(id);
            if (!cliente) {
                throw new Error('El cliente no existe');
            }

            //Verificar si el usuario que lo dio de alta edita
            if (cliente.usuarioAlta.toString() !== ctx.usuario.id ) {
                throw new Error('No tienes acceso para ver el cliente');
            }

            //guardar el cliente
            cliente = await Cliente.findOneAndUpdate({_id: id}, input, {new: true});

            return cliente;
        },
        
        eliminarCliente: async(_, {id}, ctx) => {
            //Verificar si existe
            let cliente = await Cliente.findById(id);
            if (!cliente) {
                throw new Error('El cliente no existe');
            }

            //Verificar si el usuario que lo dio de alta edita
            if (cliente.usuarioAlta.toString() !== ctx.usuario.id ) {
                throw new Error('No tienes acceso para ver el cliente');
            }

            //Eliminar Cliente
            await Cliente.findByIdAndDelete({_id: id});
            return "El cliente ha sido eliminado"
        },

        nuevoPedido: async(_, {input}, ctx) => {

            const { cliente } = input;
            //Verificar si cliente existe
            let clienteExiste = await Cliente.findById(cliente);
            if (!clienteExiste) {
                throw new Error('El cliente no existe');
            }

            //Verificar si cliente fue dado de alta por usuario logueado
            if (clienteExiste.usuarioAlta.toString() !== ctx.usuario.id ) {
                throw new Error('No tienes acceso para ver el cliente');
            }

            //revisar stock disponible
            for await (const articulo of input.pedido) {
                const {id} = articulo;
                const producto = await Producto.findById(id);
                if (articulo.cantidad > producto.stock) {
                    throw new Error(`El articulo ${producto.nombre} no tiene suficiente stock. Hay disponibles ${producto.stock} unidades.`);
                } else {
                    producto.stock = producto.stock - articulo.cantidad;

                    await producto.save();
                }
                
            }
            //crear nuevo pedido
            const nuevoPedido = new Pedido(input);
            
            //asignarle usuario
            nuevoPedido.usuarioAlta = ctx.usuario.id;

            //guardar en db
            const resultado = await nuevoPedido.save();
            return resultado;
            
        }   

    }
}

module.exports = resolvers;