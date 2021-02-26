const {gql} = require('apollo-server');


//schema
const typeDefs = gql`

    #Types

    type Usuario {
        id: ID
        nombre: String
        apellido: String
        email: String
        creado: String
    }

    type Token{
        token: String
    }

    type Producto{
        id: ID
        nombre: String
        stock: Int
        precio: Float
        marca: String
        proveedor: String
        creado: String
    }

    type Cliente{
        id: ID
        nombre: String
        apellido: String
        fechaNac: String
        telefono: String
        #medicacion: String
        #productos: String
        #unas: String
        #cabello: String
        #cueroCab: String
        creado: String
        usuarioAlta: ID
    }

    type Pedido{
        id: ID
        pedido: [PedidoGrupo]
        total: Float
        cliente: ID
        usuarioAlta: ID
        fecha: String
        estado: EstadoPedido
    }

    type PedidoGrupo{
        id: ID
        cantidad: Int
    }

    #Inputs

    input UsuarioInput {
        nombre: String!
        apellido: String!
        email: String!
        password: String!
    }
    
    input AutenticarInput{
        email: String!
        password: String!
    }

    input ProductoInput{
        nombre: String!
        stock: Int!
        precio: Float!
        marca: String!
        proveedor: String!
    }

    input ClienteInput{
        nombre: String!
        apellido: String!
        fechaNac: String
        telefono: String
        medicacion: String
        productos: String
        unas: String
        cabello: String
        cueroCab: String
    }

    input PedidoProductoInput{
        id: ID
        cantidad: Int
    }

    enum EstadoPedido {
        Pendiente
        Completado
        Cancelado 
    }

    input PedidoInput{
        pedido: [PedidoProductoInput]
        total: Float!
        cliente: ID
        estado: EstadoPedido
    } 

    #Querys

    type Query {
        #Usuarios
        obtenerUsuario(token: String!): Usuario
        
        #Productos
        obtenerProductos: [Producto]
        obtenerProducto(id: ID!): Producto

        #Clientes
        obtenerClientes: [Cliente]
        obtenerClientesUsuario: [Cliente]
        obtenerCliente(id: ID!): Cliente
    }

    #Mutations

    type Mutation {
        #Usuarios
        nuevoUsuario(input: UsuarioInput): Usuario
        autenticarUsuario(input: AutenticarInput): Token

        #Productos
        nuevoProducto(input: ProductoInput): Producto
        actualizarProducto(id:ID!, input:ProductoInput): Producto
        eliminarProducto(id:ID!): String

        #Clientes
        nuevoCliente(input: ClienteInput): Cliente
        actualizarCliente(id: ID!, input: ClienteInput): Cliente
        eliminarCliente(id: ID!): String

        #Pedidos
        nuevoPedido(input: PedidoInput): Pedido
    }
`;

module.exports = typeDefs;