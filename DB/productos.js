import Contenedor from "./contenedor.js"

const tableStructure = (table) => {
    table.increments('id').primary()
    table.string('title').notNullable()
    table.float('price').notNullable()
    table.string('thumbnail')
}

export default class Productos extends Contenedor {
    constructor(knex){
        super(knex, 'productos')
        this.createTable(tableStructure)
    }
}