import express from 'express'
import Mensajes from './DB/mensajes.js'
import Productos from './DB/productos.js'
import MDBKnex from './DB/options/mariadb.js'
import SQLiteKnex from './DB/options/sqlite.js'

const app = express()

app.get('/', (req, res) => {
    res.send('Bienvenido a mi server')
})

const mensajes = new Mensajes(SQLiteKnex)
const productos = new Productos(MDBKnex)

const PORT = process.env.PORT || 5000

const server = app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`)
})