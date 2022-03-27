// Server setup
import express from 'express'
import { Server as HttpServer} from 'http'
import { Server as IOServer } from 'socket.io'
import { engine } from 'express-handlebars'
import session from 'express-session'
import apiRoutes from './rutas/api.js'

const app = express()
const httpServer = new HttpServer(app)
const io = new IOServer(httpServer)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('./public'))

// Session setup
app.use(session({
    secret: 'eunsecreto',
    resave: true,
    saveUninitialized: true
}))

// Workaround porque no funcionaba __dirname al trabajar en módulos (creo)
import { dirname } from 'path';
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));

// HBS setup
app.engine('hbs', engine({
    extname: '.hbs',
    defaultLayout: 'index.hbs',
    layoutsDir: __dirname + "/views/layouts"
}))
app.set('views', './views')
app.set('view engine', 'hbs')

// Request handlers
const checkUsername = (req, res, next) => {
    if(!req.session.username) {
        return res.redirect('/login')
    }
    next()
}

app.get('/', checkUsername, (req, res) => {
    res.render('main.hbs', {username: req.session.username})
})
app.get('/login', (req, res) => {
    if(req.session.username) {
        return res.render('main.hbs', {username: req.session.username})
    }
    res.render('login.hbs')
})
app.post('/login', (req, res) => {
    if(req.body.nombre){
        req.session.username = req.body.nombre
        return res.render('main.hbs', {username: req.session.username})
    }
})
app.get('/logout', checkUsername, (req, res) => {
    res.render('logout.hbs', {username: req.session.username})
    req.session.destroy()
})

app.use('/api', apiRoutes)

// DAOs import
import { mensajes } from './daos/firebase.js'

// Socket handlers
import normalizar from './utils/normalizacion.js'

io.on('connection', async socket => {
    console.log(`User connected with socket id: ${socket.id}`)
    const msjs = await mensajes.getAll()
    socket.emit('messageBoard', normalizar(msjs))
    socket.on('userMessage', async (msg) => {
        await mensajes.save(msg)
        const msjs = await mensajes.getAll()
        socket.emit('messageBoard', normalizar(msjs))
    })
})

const PORT = process.env.PORT || 5000

const server = httpServer.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`)
})
server.on('error', (err) => {
    console.error(`Server error: ${err}`)
})