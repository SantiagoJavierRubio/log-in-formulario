import knex from "knex"

const options = {
    client: 'sqlite3',
    connection: {
        filename: `DB/sqlite/ecommerce.sqlite`
    },
    useNullAsDefault: true
}

export default knex(options)