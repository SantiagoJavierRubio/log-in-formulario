import knex from "knex"
// Las opciones de conexión están configuradas para funcionar con MAMP. Con XAMPP todas las combinaciones me daban error :(
const options = {
    client: 'mysql',
    connection: {
        host: 'localhost',
        port: 8889,
        user: 'root',
        password: 'root',
        database: 'primeradb'
    }
}

export default knex(options)