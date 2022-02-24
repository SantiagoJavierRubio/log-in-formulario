import Contenedor from "./contenedor.js"

const tableStructure = (table) => {
    table.increments('id').primary()
    table.string('email').notNullable()
    table.string('message').notNullable()
    table.string('date').notNullable()
}

export default class Mensajes extends Contenedor {
    constructor(knex){
        super(knex, 'mensajes')
        this.createTable(tableStructure)
    }
}