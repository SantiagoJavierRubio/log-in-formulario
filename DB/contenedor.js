export default class Contenedor {

    constructor (knex, tableName) {
        this.knex = knex
        this.tableName = tableName
    }

    async createTable (tablecb) {
        try {
            const exists = await this.knex.schema.hasTable(this.tableName)
            if(exists) return console.log('Table already exists')
            const created = await this.knex.schema.createTable(this.tableName, tablecb)
            if(created){
                return console.log('Table created')
            } else {
                throw new Error('Table not created')
            }
        } catch(err){
            console.error(err)
        }
    }

    async save (obj) {
        try {
            const inserted = await this.knex(this.tableName).insert(obj)
            if(inserted){
                return console.log('Entry saved')
            } else {
                throw new Error('Entry not saved')
            }
        } catch (err) {
            console.error(err)
            return null
        }
    }

    async getById (id) {
        try {
            const result = await this.knex.from(this.tableName).select().where({id: id})
            if(!result) throw new Error('Not found')
            return result
        } catch (err) {
            console.error(err)
            return null
        }
    }

    async getAll() {
        try {
            const results = await this.knex.from(this.tableName).select()
            if(!results) throw new Error('Not found')
            return results
        } catch (err) {
            console.error(err)
            return null
        }
    }

    async deleteById(id) {
        try {
            const deleted = await this.knex(this.tableName).where('id', id).del()
            if(!deleted) return false
            return true
        } catch (err) {
            console.error(err)
            return false
        }
    }

    async deleteAll() {
        try {
            const deleted = await this.knex(this.tableName).del()
            if(!deleted) return false
            return true
        } catch (err) {
            console.error(err)
            return false
        }
    }
}