const {gql} = require('apollo-server');


//schema
const typeDefs = gql`

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
        creado: String
    }

    type Cliente{
        id: ID
        nombre: String
        apellido: String
        fechaNac: String
        telefono: String
        medicacion: String
        productos: String
        unas: String
        cabello: String
        cueroCab: String
        creado: String
    }

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
    }

    input ClienteInput{
        nombre: String!
        apellido: String!
        fechaNac: String!
        telefono: String!
        medicacion: String
        productos: String
        unas: String
        cabello: String
        cueroCab: String
    }

    type Query {
        #Usuarios
        obtenerUsuario(token: String!): Usuario
        
        #Productos
        obtenerProductos: [Producto]
        obtenerProducto(id: ID!): Producto

        #Clientes
        obtenerClientes: [Cliente]
    }

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
    }
`;

module.exports = typeDefs;