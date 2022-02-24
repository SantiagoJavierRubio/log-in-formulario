// Server setup
import express from 'express'
import { Server as HttpServer} from 'http'
import { Server as IOServer } from 'socket.io'
import { engine } from 'express-handlebars'
const app = express()
const httpServer = new HttpServer(app)
const io = new IOServer(httpServer)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('./public'))

// Workaround porque no funcionaba __dirname al trabajar en módulos (creo)
import { dirname } from 'path';
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));

// Database setup
import Mensajes from './DB/mensajes.js'
import Productos from './DB/productos.js'
import MDBKnex from './DB/options/mariadb.js'
import SQLiteKnex from './DB/options/sqlite.js'
const mensajes = new Mensajes(SQLiteKnex)
const productos = new Productos(MDBKnex)

// HBS setup
app.engine('hbs', engine({
    extname: '.hbs',
    defaultLayout: 'index.hbs',
    layoutsDir: __dirname + "/views/layouts"
}))
app.set('views', './views')
app.set('view engine', 'hbs')

// Request handlers
app.get('/', (req, res) => {
    res.render('main.hbs')
})
app.post('/productos', async (req, res) => {
    try {
        const userInput = {...req.body, thumbnail: curateUrl(req.body.thumbnail)}
        const added = await productos.save(userInput)
        if(!added) throw new Error('Unable to add product')
        const allProds = await productos.getAll()
        io.sockets.emit('productList', allProds)
        res.redirect('/')
    } catch (err) {
        res.status(500).json({error: err})
    }
})
const curateUrl = (url) => {
    if(url.includes('//')) return url
    return `//${url}`
}

// Socket handlers
io.on('connection', async socket => {
    console.log(`User connected with socket id: ${socket.id}`)
    const allProds = await productos.getAll()
    socket.emit('productList', allProds)
    const msjs = await mensajes.getAll()
    socket.emit('messageBoard', msjs)
    socket.on('userMessage', async (msg) => {
        const timeStamp = new Date(Date.now())
        let timeString = `[${timeStamp.toLocaleDateString()} ${timeStamp.toTimeString()}`
        let cutoffIndex = timeString.indexOf("G")-1
        let formatedTimeStamp = timeString.slice(0, cutoffIndex) + "]"
        let msgData = { ...msg, date: formatedTimeStamp }
        await mensajes.save(msgData)
        io.sockets.emit('newMessage', msgData)
    })
})

const PORT = process.env.PORT || 5000

const server = httpServer.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`)
})
server.on('error', (err) => {
    console.error(`Server error: ${err}`)
})