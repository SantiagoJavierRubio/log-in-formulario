import knex from "knex"
// Workaround porque no funcionaba __dirname al trabajar en módulos (creo)

const options = {
    client: 'sqlite3',
    connection: {
        filename: `DB/sqlite/ecommerce.sqlite`
    },
    useNullAsDefault: true
}

export default knex(options)